import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams to access route parameters
import FinancialDataRow from './FinancialDataRow';
import ChartComponent from './ChartComponent';

function StockDetails() {
  const [stock, setStock] = useState(null);
  const { id } = useParams(); // Access the 'id' parameter from the route

  useEffect(() => {

    try {
      fetch(`http://127.0.0.1:8000/api/stock/${id}`)
        .then((response) => response.json())
        .then((jsonData) => setStock(jsonData));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [id]);

  if (stock === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div class="link-container">
        <Link className="back-link" to="/"></Link>
        <br/>
        <p></p>Back to Stock List
      </div>
      
      <table className="centered-table">
        <tbody>
        {
          Object.keys(stock).map((key) => {
            const netProfitData = stock[key].net_profit;
            const dates = Object.keys(netProfitData);
            const epsData = stock[key].eps;
            const netCashFlowData = stock[key].net_cash_flow;
            const faceValue = stock[key].face_value;
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
                <ChartComponent dateLabels={dates} netProfitData={netProfitData} epsData={epsData} netCashFlowData={netCashFlowData}/>
              </div>
            );
          })
        }
        </tbody>
      </table>
    </div>
  );
}

export default StockDetails;
