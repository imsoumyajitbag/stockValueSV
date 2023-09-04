import React from 'react';

function FinancialDataRow({ title, dates, data={} }) {
  return (
    <tr>
      <td>
        <strong>{title}</strong>
      </td>
      {dates.map((date) => (
        <td key={date}>
          {data[date] !== undefined ? data[date] : date}
        </td>
      ))}
    </tr>
  );
}

export default FinancialDataRow;
