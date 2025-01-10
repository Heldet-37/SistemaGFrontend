import React, { useState, useEffect } from 'react';
import { getResources } from '../services/authService';

const PermissionsManager = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSector, setSelectedSector] = useState('');
  const [employeeSectors, setEmployeeSectors] = useState({});

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('access');

    if (!token) {
      console.error('Token de acesso não encontrado');
      setLoading(false);
      return;
    }

    try {
      const data = await getResources('api/employee', token);
      setEmployees(data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSector = async (employeeId) => {
    const updatedSector = employeeSectors[employeeId] || '';

    try {
      const response = await fetch(`api/employee/${employeeId}/sector`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sector: updatedSector }),
      });

      if (response.ok) {
        alert(`Setor do funcionário ${employeeId} atualizado para: ${updatedSector}`);
      } else {
        throw new Error('Falha ao atualizar o setor');
      }
    } catch (error) {
      console.error('Erro ao atualizar setor:', error);
      alert('Erro ao atualizar setor. Tente novamente.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderSectorSelection = (employee) => (
    <select
      value={employeeSectors[employee.id] || employee.sector || ''}
      onChange={(e) => {
        setEmployeeSectors((prev) => ({
          ...prev,
          [employee.id]: e.target.value,
        }));
      }}
    >
      <option value="">Selecione um Setor</option>
      <option value="mercearia">Mercearia</option>
      <option value="restaurante">Restaurante</option>
    </select>
  );

  const renderEmployees = () => {
    return employees
      .filter((employee) => selectedSector === '' || employee.sector === selectedSector)
      .map((employee) => (
        <tr key={employee.id}>
          <td>{employee.id}</td>
          <td>{employee.name}</td>
          <td>{renderSectorSelection(employee)}</td>
          <td>
            <button onClick={() => handleUpdateSector(employee.id)}>Atualizar</button>
          </td>
        </tr>
      ));
  };

  return (
    <div>
      <h2>Gerenciamento de Permissões</h2>

      <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
        <option value="">Filtrar por Setor</option>
        <option value="mercearia">Mercearia</option>
        <option value="restaurante">Restaurante</option>
      </select>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Funcionário</th>
              <th>Setor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {renderEmployees()}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PermissionsManager;
