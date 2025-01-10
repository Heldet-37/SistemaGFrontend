import React, { useState, useEffect } from 'react';
import AddStockItemForm from './AddStockItemForm';
import EditStockItemForm from './EditStockItemForm';
import { getResources } from '../services/authService';

const StockManager = () => {
  const [stockItems, setStockItems] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  const [activeStockItem, setActiveStockItem] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função genérica para requisições
  const fetchData = async (url, method = 'GET', data = null) => {
    try {
      setIsLoading(true);
      const result = await getResources(url, method, data);
      setIsLoading(false);

      if (result === undefined) {
        return null; // Se a resposta for vazia, retorna null
      }

      return result;
    } catch (err) {
      setIsLoading(false);
      setError(`Erro ao carregar dados: ${err.message}`);
      console.error('Erro:', err);
      throw err; // Repassa o erro para quem chamou a função
    }
  };

  // Função para buscar os itens de estoque
  const fetchStockItems = async () => {
    try {
      const data = await fetchData('api/stockmanager');
      if (data) setStockItems(data);
    } catch (error) {
      setError('Erro ao buscar itens de estoque.');
    }
  };

  useEffect(() => {
    fetchStockItems();
  }, []);

  // Ativar/desativar item de estoque
  const handleActivateStock = (item) => {
    setMessage('Processando, aguarde...');
    setIsLoading(true);

    const isActive = activeStockItem?.product_id === item.product_id;
    setTimeout(() => {
      if (isActive) {
        setActiveStockItem(null);
        setMessage('Estoque desativado.');
      } else {
        setActiveStockItem(item);
        setMessage(`Estoque ${item.product_name} ativado.`);
      }
      fetchStockItems(); // Atualiza a lista após a ativação/desativação
      setIsLoading(false);
    }, 2000);
  };

  const handleAddItem = async (newItem) => {
    try {
      const data = await fetchData('api/stockmanager', 'POST', newItem);
      if (data) {
        setIsAdding(false);
        fetchStockItems();
      }
    } catch (error) {
      setError('Erro ao adicionar item.');
    }
  };

  const handleEditClick = (item) => setEditingItem(item);

  const handleSaveEdit = async (updatedItem) => {
    try {
      const data = await fetchData(`api/stockmanager/${updatedItem.product_id}`, 'PUT', updatedItem);
      if (data) {
        setEditingItem(null);
        fetchStockItems();
      }
    } catch (error) {
      setError('Erro ao salvar alterações.');
    }
  };

  const handleDeleteItem = async (productId, productName) => {
    if (window.confirm(`Deseja remover ${productName} do estoque?`)) {
      try {
        const data = await fetchData(`api/stockmanager/${productId}`, 'DELETE');
        if (data === null) {
          setMessage('Item removido com sucesso.'); // Se não houver resposta, considera como sucesso
        } else {
          fetchStockItems();
        }
      } catch (error) {
        setError('Item removido com sucesso. Por favor, faz um refresh manual!');
      }
    }
  };

  const handleCloseForm = () => setIsAdding(false);

  return (
    <div className="stock-manager">
      <h2>Gerenciamento de Estoque</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}

      <button onClick={() => setIsAdding(true)}>Adicionar Item</button>
      {isAdding && <AddStockItemForm onAdd={handleAddItem} onClose={handleCloseForm} />}

      {editingItem && (
        <EditStockItemForm
          item={editingItem}
          onSave={handleSaveEdit}
          onClose={() => setEditingItem(null)}
        />
      )}

      {isLoading && <div className="loading">Carregando...</div>}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço de Venda</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {stockItems.length === 0 ? (
            <tr>
              <td colSpan="5">Nenhum item no estoque.</td>
            </tr>
          ) : (
            stockItems.map(item => (
              <tr key={item.product_id}>
                <td>{item.product_id}</td>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toFixed(2)} MT</td>
                <td>
                  <button onClick={() => handleEditClick(item)}>Editar</button>
                  <button onClick={() => handleDeleteItem(item.product_id, item.product_name)}>Remover</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockManager;
