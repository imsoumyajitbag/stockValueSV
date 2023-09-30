import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StockList from './StockList';
import StockDetails from './StockDetails';

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearch] = useState('');
  const [filteredData, setfilteredData] = useState({});
  const [filteredCount, setfilteredCount] = useState({});

  // Simulate fetching data from an API
  useEffect(() => {
    try {
      fetch('http://127.0.0.1:8000/api/stockdata').then(
        (response) => response.json()
      ).then(
        (jsonData) => {
          setData(jsonData);
          setfilteredData(jsonData);
          setfilteredCount(Object.keys(jsonData).length);
        }
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  function handleSearch(e) {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    if (searchTerm) {
      const dataArray = Object.keys(data);

      const filteredArray = dataArray.filter(
        (stock) => stock.toLowerCase().includes(searchTerm.toLowerCase())
      )

      const filteredDict = {};

      filteredArray.map(
        (item) => {
          filteredDict[item] = data[item]
        }
      );
    
      setfilteredData(filteredDict);
      setfilteredCount(filteredArray.length);
    }
    else {
      setfilteredData(data);
      setfilteredCount(Object.keys(data).length);
    }
  }

  return (
    <Router>
      <div className="App">
        <input
        className="form-control w-50 mt-4 mb-4"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {Object.keys(filteredData).length > 0 ? (
        <div>
          {
            <div>{Object.keys(filteredData).length} stocks found</div>
          }
        </div>
      ) : (
        <div>No matching stocks found.</div>
      )}
        <h1>Stock Values</h1>
        <Routes>
          <Route path="/" element={<StockList stock={filteredData} />} />
          <Route path="/stock/:id" element={<StockDetails stock={data} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
