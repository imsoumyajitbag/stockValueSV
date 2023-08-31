import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prepare import stock_data_export


app = FastAPI()

# Enable CORS to allow your React app to make requests to this FastAPI server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your React app's URL
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/api/stockdata")
async def read_stock_data():
    for parent_dir, _, stocks in os.walk('./EPS_trail'):
        stock_data = stock_data_export(parent_dir, stocks)

    return stock_data

