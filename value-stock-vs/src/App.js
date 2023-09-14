import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StockList from './StockList';
import StockDetails from './StockDetails';

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
    <Router>
      <div className="App">
        <h1>Stock Values</h1>
        <Routes>
          <Route path="/" element={<StockList stock={data} />} />
          <Route path="/stock/:id" element={<StockDetails stocks={data} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
