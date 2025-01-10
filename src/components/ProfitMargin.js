import React, { useEffect, useState } from 'react';
import { getResources } from '../services/authService';

const ProfitMargin = ({marginStatic}) => {
 
  if (!marginStatic) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="profit-margin">
      <h2>Margem de Venda</h2>
      <p>Margem: {marginStatic.margin.toFixed(2)}%</p>
    </div>
  );
};

export default ProfitMargin;
