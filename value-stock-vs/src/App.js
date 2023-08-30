import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  
  // Simulate fetching data from an API
  useEffect(() => {
    try {
      debugger;
      // Replace this with actual API call or data import
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
      <h1>User List</h1>
      <table className="centered-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
