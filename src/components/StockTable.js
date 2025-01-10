// StockTable.js
import React from 'react';
import { useState, useEffect } from 'react';
import { getResources } from '../services/authService';

const StockTable = () => {
    const [stockData, setStockData] = useState([]);
    const [filteredProductData, setFilteredProductData] = useState([]);
    const [error, setError] = useState(null);
    const [productData, setProductData] = useState([]);

     
  const fetchData = async (url, setData) => {
    try {
      const data = await getResources(url); // Usa a função getResources
      setData(data);
  
      if (setData === setProductData) {
        setFilteredProductData(data);
      }
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      setError(`Não foi possível carregar os dados de ${url.split('/')[2]}.`);
    }
  };
  

    useEffect(() => {
        const fetchAllData = async () => {
         
          await Promise.all([
            fetchData(`api/stockmanager`, setStockData),
          ]);

        };
        fetchAllData();
      }, []);
  return (
    <div>
      <h2>Estoque</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Qtd</th>
            <th>Valor de venda</th>
            <th>Disponível</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map(item => (
            <tr key={item.product_id}>
              <td>{item.product_id}</td>
              <td>{item.product_name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>{item.is_available ? 'Sim' : 'Não'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
