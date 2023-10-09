import os
import openpyxl
import pandas as pd

from io import BytesIO
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from prepare import stock_data_export, _format_date, _load_data_from_workbook
from dateutil.parser import parse
from pathlib import Path


from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Stock, DateTable, FinancialData

DATABASE_URL = "sqlite:///./test.db"


def init_database():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    return SessionLocal()

app = FastAPI()


def insert_data_if_not_present(stock_name, date, financial_data):
    stock = app.db.query(Stock).filter_by(name=stock_name).first()
    insertion_flag = False
    # Check if the stock already exists in the database
    try:
        if not stock:
            stock = Stock(name=stock_name)
            app.db.add(stock)
            app.db.commit()
            insertion_flag = True

        # Check if the date already exists in the database
        date_record = app.db.query(DateTable).filter_by(date=date.date())
        if not date_record.count():
            date_record = DateTable(date=date)
            app.db.add(date_record)
            app.db.commit()
        else:
            date_record = date_record.first()

        # Check if financial data already exists for the given stock and date
        existing_data = app.db.query(FinancialData).filter_by(stock_id=stock.id, date_id=date_record.id).first()
        
        # If data does not exist, insert it
        if stock and not stock.face_value:
            stock.face_value = financial_data.get('face_value', None)
            app.db.commit()
        if existing_data and not existing_data.book_value_per_share:
            existing_data.book_value_per_share = financial_data.get('book_value_per_share', None)
            app.db.commit()
        if not existing_data:
            financial_data_record = FinancialData(
                stock_id=stock.id,
                date_id=date_record.id,
                eps=financial_data.get('eps', None),
                net_profit=financial_data.get('net_profit', None),
                net_cash_flow=financial_data.get('net_cash_flow', None),
                book_value_per_share=financial_data.get('book_value_per_share', None),
            )
            app.db.add(financial_data_record)
            app.db.commit()
    except Exception as e:
        print(e)
        print(stock_name)

    app.db.close()
    return insertion_flag



# Enable CORS to allow your React app to make requests to this FastAPI server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your React app's URL
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get('/api/stock/{stock_id}')
async def get_stock_details(stock_id: str):
    stock = app.db.query(Stock).get(stock_id)
    stock_data = {}
    if stock:
        stock_data[stock.name] = {
            'net_profit': {
                _format_date(data.date.date): data.net_profit or None
                for data in stock.financial_data
            },
            'eps': {
                _format_date(data.date.date): data.eps or None
                for data in stock.financial_data
            },
            'net_cash_flow': {
                _format_date(data.date.date): data.net_cash_flow or None
                for data in stock.financial_data
            },
            'face_value': stock.face_value,
            'id': stock.id,
            'book_value_per_share': {
                _format_date(data.date.date): round(data.book_value_per_share, 2)
                if data.book_value_per_share else None for data in stock.financial_data
            },
        }
    return stock_data

@app.post('/api/import')
async def upload_file(file: UploadFile):
    file_data = await file.read()
    xlsx_file = BytesIO(file_data)

    workbook = openpyxl.load_workbook(xlsx_file)
    data = _load_data_from_workbook(file.filename, workbook)
    stock_name = workbook['Data Sheet']['B1'].value
    if not stock_name:
        stock_name = file.filename.replace('.xlsx', '')
    insertion_check = _insert_stock_data_to_db(stock_name, data)
    if insertion_check:
        return {
            "message": "File uploaded and processed successfully",
            "code": 201,
        }
    else:
        return {
            "message": "Stock already exists",
            "code": 409,
        }


@app.get("/api/stockdata")
async def read_stock_data():
    for parent_dir, _, stocks in os.walk('./EPS_trail'):
        stock_data = {}
        data_df_cols = ['Date', 'Net Profit', 'EPS', 'Net Cash Flow']
        for i in app.db.query(Stock).all():
            data_df = []
            date_set = set()
            stock_data[i.name] = {
                'net_profit': {
                    _format_date(data.date.date): data.net_profit or None
                    for data in i.financial_data
                },
                'eps': {
                    _format_date(data.date.date): data.eps or None
                    for data in i.financial_data
                },
                'net_cash_flow': {
                    _format_date(data.date.date): data.net_cash_flow or None
                    for data in i.financial_data
                },
                'face_value': i.face_value,
                'id': i.id,
                'book_value_per_share': {
                    _format_date(data.date.date): round(data.book_value_per_share, 2)
                    if data.book_value_per_share else None for data in i.financial_data
                },
            }
            for j in i.financial_data:
                date_iter = _format_date(j.date.date)
                if date_iter not in date_set:
                    data_df.append((date_iter, j.net_profit, j.eps, j.net_cash_flow))
                    date_set.add(date_iter)
            df = pd.DataFrame(data_df, columns=data_df_cols)
            
        # _add_excel_data_to_db(parent_dir, stocks)
    return stock_data

def _add_excel_data_to_db(parent_dir, stocks):
    stock_data = stock_data_export(parent_dir, stocks) 
    stock_insertions = {}
    
    for stock_name, data in stock_data.items():
        insertion_check = _insert_stock_data_to_db(stock_name, data)
        stock_insertions[stock_name] = insertion_check
    return stock_insertions

def _insert_stock_data_to_db(stock_name, data):
    newly_added_stock_flag = False
    for date, financial_data in data['eps'].items():
        if date:
            insertion_check = insert_data_if_not_present(stock_name, parse(date), {
                'eps': financial_data,
                'net_profit': data['net_profit'].get(date, None),
                'net_cash_flow': data['net_cash_flow'].get(date, None),
                'face_value': data['face_value'],
                'book_value_per_share': data['book_value_per_share'].get(date, None),
            })
            if insertion_check:
                newly_added_stock_flag = True
    return newly_added_stock_flag


# Initialize the database on application startup
@app.on_event("startup")
async def startup_db_client():
    app.db = init_database()

# Close the database connection on application shutdown
@app.on_event("shutdown")
async def shutdown_db_client():
    app.db.close()
