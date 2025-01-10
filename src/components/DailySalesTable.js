// src/components/DailySalesTable.js
import React from 'react';

const DailySalesTable = ({ salesData }) => {
  // Verifique se salesData existe e é um array antes de usar map
  if (!salesData || !Array.isArray(salesData)) {
    return <div>No sales data available.</div>; // Mensagem amigável caso não haja dados
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Employee</th>
          <th>Total Sales</th>
        </tr>
      </thead>
      <tbody>
        {salesData.map((sale, index) => (
          <tr key={index}>
            <td>{sale.date}</td>
            <td>{sale.employee}</td>
            <td>{sale.totalSales}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export default DailySalesTable;
