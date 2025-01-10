import React from 'react';

const TotalInventoryValue = ({totalValue}) => {

  return (
    <div className="total-inventory-value">
      <h2>Valor Total da Mercadoria</h2>
      <p>Total: {totalValue} MT</p>
    </div>
  );
};

export default TotalInventoryValue;
