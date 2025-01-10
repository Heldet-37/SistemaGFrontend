import React, { useEffect, useState } from 'react';

const FinancialReport = ({ finaStatic }) => {
  

  if (!finaStatic) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="financial-report">
      <h2>Relatório Financeiro</h2>
      <p>Total de Vendas: {finaStatic.total_sales_value}</p>
      <p>Total de Custos: {finaStatic.total_acquisition_value}</p>
      <p>Lucro: {finaStatic.profit}</p>
    </div>
  );
};

export default FinancialReport;
