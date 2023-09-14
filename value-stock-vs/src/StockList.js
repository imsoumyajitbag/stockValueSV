import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function StockList({ stock }) {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Stock List</h1>
      <table className="table table-light table-borderless mb-0">
        <thead className="thead-light">
          <tr>
            <th></th>
            <th>Stock Name</th>
            <th>Face Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(stock).map((stockIter, index) => (
            <tr key={index+1}>
              <td>{index+1}</td>
              <td>{stockIter}</td>
              <td>{stock[stockIter].face_value}</td>
              <td>
                <Link to={`/stock/${stock[stockIter].id}`} className="btn btn-dark ">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockList;
