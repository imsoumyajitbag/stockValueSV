import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';

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

            return (
              <div key={key} className="mb-4">
                <strong>{key}</strong>
                <table className="table table-bordered">
                  <thead className="thead-light">
                    <tr>
                      <th>Date</th>
                      {dates.map((date) => (
                        <th key={date}>{date}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Net Profit</strong></td>
                      {dates.map((date) => (
                        <td key={date}>{netProfitData[date]}</td>
                      ))}
                    </tr>
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
