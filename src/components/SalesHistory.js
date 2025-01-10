import React, { useState, useEffect } from 'react';
import { getResources } from '../services/authService';

const SalesHistory = () => {
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('access'); // Supondo que você armazena o token no localStorage
  const id = localStorage.getItem('employee_id'); // ID do funcionário

  const fetchData = async (url, setData) => {
    try {
      const data = await getResources(url); // Usa a função getResources
      setData(data);
    } catch (error) {
      console.error(`Erro ao buscar dados de ${url}:`, error);
      setError(`Não foi possível carregar os dados de ${url.split('/')[2]}.`);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchData(`api/employee/${id}/sales`, setSalesData);
    };
    fetchAllData();
  }, [id]);

  // Verifique se salesData e salesData.sales estão disponíveis
  if (!salesData || !salesData.sales || salesData.sales.length === 0) {
    return <p>Nenhuma venda registrada.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Produto</th>
          <th>Quantidade</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        {salesData.sales.map((sale, index) => (
          <tr key={`${sale.product_name}-${sale.date}-${index}`}>
            <td>{sale.product_name}</td>
            <td>{sale.total_quantity}</td>
            <td>{sale.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SalesHistory;
