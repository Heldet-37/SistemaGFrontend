import React from 'react';

const ProductList = ({ products = [] }) => {


  return (
    <div className="product-list">
      <h2>Lista de Produtos</h2>
      {products.length === 0 ? (
        <p>Nenhum produto disponível.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Nome do Produto</th>
              <th>Preço (MT)</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const price = parseFloat(product.price); // Converte para número

              return (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{isNaN(price) ? 'Preço inválido' : price.toFixed(2)} MT</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;
