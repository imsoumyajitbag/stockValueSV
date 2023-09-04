import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import FinancialDataRow from './FinancialDataRow';


function App() {
  const [data, setData] = useState([]);
  
  // Simulate fetching data from an API
  useEffect(() => {
    try {
      fetch('http://127.0.0.1:8000/api/stockdata').then(
        (response) => response.json()
      ).then(
        (jsonData) => setData(jsonData)
      );

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  return (
    <div className="App">
      <h1>Stock Values</h1>
      <table className="centered-table">
        <tbody>
        {
          Object.keys(data).map((key) => {
            const netProfitData = data[key].net_profit;
            const dates = Object.keys(netProfitData);
            const epsData = data[key].eps;
            const netCashFlowData = data[key].net_cash_flow;
            const faceValue = data[key].face_value;

            return (
              <div key={key} className="mb-4">
                <strong>{key}</strong>
                <p>
                  <strong>Face Value</strong><br/>
                  <span>{faceValue}</span>
                </p>
                <table className="table table-bordered">
                  <thead className="thead-light">
                    <FinancialDataRow title="Date" dates={dates}/>
                  </thead>
                  <tbody>
                    <FinancialDataRow title="Net Profit" data={netProfitData} dates={dates} />
                    <FinancialDataRow title="EPS Data" data={epsData} dates={dates} />
                    <FinancialDataRow title="Net Cash Flow" data={netCashFlowData} dates={dates} />
                  </tbody>
                </table>
              </div>
            );
          })
        }
        </tbody>
      </table>
    </div>
  );
}

export default App;
