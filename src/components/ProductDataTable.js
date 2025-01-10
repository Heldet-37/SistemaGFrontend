import React, { useState } from 'react';
import { getResources } from '../services/authService';

const ProductDataTable = ({ products, onEdit, onDelete }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    acquisition_value: '',
    quantity: ''
  });

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setUpdatedProduct(product); // Preenche o formulário com os valores do produto atual
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedProductData = await getResources(
        `api/products/${updatedProduct.id}/update`,
        'PUT',
        updatedProduct
      );
      onEdit(updatedProductData); // Atualiza a lista de produtos
      setEditingProduct(null); // Fecha o formulário de edição
      setInterval(function(){
        window.location.reload()
      }, 1000) // 1 second
    } catch (error) {
      console.error('Erro ao atualizar o produto:', error);
    }
  };
  

  return (
    <div className="product-data-table">
      <h2>Lista de Produtos</h2>
      {editingProduct ? (
        <div>
          <h3>Editando Produto: {editingProduct.name}</h3>
          <form>
            <label>
              Nome:
              <input
                type="text"
                name="name"
                value={updatedProduct.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Descrição:
              <input
                type="text"
                name="description"
                value={updatedProduct.description}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Preço de Venda:
              <input
                type="number"
                name="price"
                value={updatedProduct.price}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Valor de Aquisição:
              <input
                type="number"
                name="acquisition_value"
                value={updatedProduct.acquisition_value}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Quantidade em Estoque:
              <input
                type="number"
                name="quantity"
                value={updatedProduct.quantity}
                onChange={handleInputChange}
              />
            </label>
          </form>
          <button onClick={handleSave}>Salvar</button>
          <button onClick={() => setEditingProduct(null)}>Cancelar</button>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço de Venda</th>
              <th>Valor de Aquisição</th>
              <th>Quantidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price} MT</td>
                <td>{product.acquisition_value ? product.acquisition_value.toFixed(2) : 'N/A'} MT</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => handleEditProduct(product)}>Editar</button>
                  <button onClick={() => onDelete(product.id)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductDataTable;
