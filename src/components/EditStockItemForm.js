import React, { useState } from 'react';

const EditStockItemForm = ({ item, onSave, onClose }) => {
  const [productName, setProductName] = useState(item.product_name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [price, setPrice] = useState(item.price);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedItem = {
      ...item,
      product_name: productName,
      quantity,
      price,
    };
    onSave(updatedItem);  // Chama a função onEdit passada como prop
  };

  return (
    <div className="edit-stock-item-form">
      <h2>Editar Item de Estoque</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Produto:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div>
          <label>Quantidade:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        
        <button type="submit">Salvar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default EditStockItemForm;
