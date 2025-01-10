import React, { useState } from 'react';
import { getResources } from '../services/authService';
import './SalesForm.css';

const SalesForm = ({ products, token }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductList, setShowProductList] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      alert('Por favor, selecione um produto.');
      return;
    }

    const sale = {
      product_id: selectedProduct,
      quantity,
    };

    try {
      const data = await getResources('api/cart/add', 'POST', sale);

      if (data.error) {
        throw new Error(data.error || 'Erro desconhecido ao adicionar ao carrinho');
      }

      setSelectedProduct('');
      setQuantity(1);
      setSearchTerm('');
      setShowProductList(false);

      setInterval(function() {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert(`Erro ao adicionar ao carrinho: ${error.message}`);
    }
  };

  if (!Array.isArray(products)) {
    return <div className="error-message">Erro: Lista de produtos não disponível.</div>;
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (product) => {
    setSelectedProduct(product.id);
    setSearchTerm(product.name);
    setShowProductList(false);
  };

  return (
    <form onSubmit={handleSubmit} className="sales-form">
      <label htmlFor="search">Buscar Produto:</label>
      <input
        type="text"
        id="search"
        value={searchTerm}
        onClick={() => setShowProductList(true)}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Digite para buscar um produto"
      />

      {showProductList && (
        <div className="product-list">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="product-item"
            >
              {product.name}
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="error-message">Nenhum produto encontrado</div>
          )}
        </div>
      )}

      <label htmlFor="quantity">Quantidade:</label>
      <input
        type="number"
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
        placeholder="Quantidade"
      />

      <button type="submit">Adicionar ao Carrinho</button>
    </form>
  );
};

export default SalesForm;