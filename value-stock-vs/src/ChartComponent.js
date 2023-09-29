import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';


function ChartComponent({ dateLabels, netProfitData, epsData, netCashFlowData, bookValueData }) {
  const [activeChart, setActiveChart] = useState('line');
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    // Destroy the previous chart instance when the active chart changes
    if (chartInstance) {
      chartInstance.destroy();
    }
  }, [activeChart, chartInstance]);

  const renderChart = () => {
    switch (activeChart) {
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  const chartData = {
    labels: dateLabels,
    datasets: [
      {
        label: 'Net Profit',
        data: netProfitData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: false,
      },
      {
        label: 'EPS',
        data: epsData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        fill: false,
      },
      {
        label: 'Net Cash Flow',
        data: netCashFlowData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
      {
        label: 'BVPS',
        data: bookValueData,
        borderColor: 'rgba(32, 54, 54, 1)',
        backgroundColor: 'rgba(67, 43, 121, 1)',
        fill: false,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: 'auto', height: 'auto' }}>
      <div className="d-flex justify-content-center">
        <button className="btn button-17" onClick={() => setActiveChart('line')}>Line Chart</button>
        <button className="btn button-17" onClick={() => setActiveChart('bar')}>Bar Chart</button>
        <button className="btn button-17" onClick={() => setActiveChart('pie')}>Pie Chart</button>
      </div>
      <br/>
      <div>
        {renderChart()}
      </div>
      
    </div>
  );
}

export default ChartComponent;
