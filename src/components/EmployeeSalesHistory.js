import React, { useEffect, useState } from 'react';
import { getResources } from '../services/authService';
const EmployeeSalesHistory = () => {
  const [salesHistory, setSalesHistory] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Estado para o funcionário selecionado

  const token = localStorage.getItem('access'); // Supondo que você armazena o token no localStorage

  const fetchData = async (url, setData, setError) => {
    try {
      // Fazendo a requisição usando `getResources` com método 'GET'
      const data = await getResources(url, 'GET');
  
      // Define os dados retornados no estado
      setData(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      setError(error.message || 'Erro ao buscar dados.'); // Define a mensagem de erro
    }
  };

  useEffect(() => {
    fetchData(`api/sales-by-employee`, setSalesHistory);
  }, []);

  // Função para lidar com o clique no botão "Detalhes"
  const handleDetailsClick = (employee) => {
    setSelectedEmployee(employee); // Atualiza o estado com o funcionário selecionado
  };

  return (
    <div className="sales-history">
      <h2>Histórico de Vendas dos Funcionários</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID Funcionário</th>
            <th>Nome</th>
            <th>Total de Vendas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {salesHistory.map(sale => (
            <tr key={sale.employee_id}>
              <td>{sale.employee_id}</td>
              <td>{sale.employee_name}</td>
              <td>{sale.total_sales}</td>
              <td>
                <button onClick={() => handleDetailsClick(sale)}>Detalhes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Renderiza os detalhes do funcionário selecionado */}
      {selectedEmployee && (
        <div className="employee-details">
          <h3>Detalhes do Funcionário</h3>
          <p><strong>ID Funcionário:</strong> {selectedEmployee.employee_id}</p>
          <p><strong>Nome:</strong> {selectedEmployee.employee_name}</p>
          <p><strong>Total de Vendas:</strong> {selectedEmployee.total_sales}</p>
          {/* Aqui você pode adicionar mais detalhes se disponível */}
        </div>
      )}
    </div>
  );
};

export default EmployeeSalesHistory;
