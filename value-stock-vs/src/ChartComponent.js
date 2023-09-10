import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';


function ChartComponent ({ dateLabels, netProfitData, epsData, netCashFlowData }) {
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
    ],
  };

  const chartOptions = {
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
    // responsive: false,
    maintainAspectRatio: false,
    elements: {
      canvas: {
        backgroundColor: 'ivory',
      },
    },
  };


  return (
    <div>
      <Line data={chartData} options={chartOptions}/>
    </div>
  );
};

export default ChartComponent;
