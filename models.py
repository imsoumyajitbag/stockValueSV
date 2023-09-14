from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Stock(Base):
    __tablename__ = "stocks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    face_value = Column(Float)


class DateTable(Base):
    __tablename__ = "dates"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, unique=True)


class FinancialData(Base):
    __tablename__ = "financial_data"
    id = Column(Integer, primary_key=True, index=True)
    stock_id = Column(Integer, ForeignKey("stocks.id"))
    date_id = Column(Integer, ForeignKey("dates.id"))
    eps = Column(Float)
    net_profit = Column(Float)
    net_cash_flow = Column(Float)

    stock = relationship("Stock", back_populates="financial_data")
    date = relationship("DateTable", back_populates="financial_data")


Stock.financial_data = relationship("FinancialData", back_populates="stock")
DateTable.financial_data = relationship("FinancialData", back_populates="date")
