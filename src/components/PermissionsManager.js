import React, { useState, useEffect } from 'react';
import { getResources } from '../services/authService';
import { API } from './API';

const PermissionsManager = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSector, setSelectedSector] = useState('');
  const [sectors, setSectors] = useState([]);
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
      const data = await getResources('api/employee');
      setEmployees(data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch(`${API}/api/stock-references`);
        const data = await response.json();
        setSectors(data);
      } catch (error) {
        console.error('Erro ao buscar setores:', error);
      }
    };

    fetchSectors();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSector = async (employeeId) => {
    const updatedSector = employeeSectors[employeeId] || '';

    try {
      const response = await fetch(`${API}/api/employee/${employeeId}/sector`, {
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

  const renderSectorSelection = (employee) => {
    const selectedSectorRender = employeeSectors[employee.id] || ''; // Usa o setor selecionado para este funcionário

    return (
      <select
        value={selectedSectorRender}
        onChange={(e) => {
          const selectedSector = e.target.value;
          setEmployeeSectors((prev) => ({
            ...prev,
            [employee.id]: selectedSector,
          }));
        }}
      >
        <option value="" disabled>Selecione um setor</option>
        {sectors.map((sector) => (
          <option key={sector.id} value={sector.id}>
            {sector.name}
          </option>
        ))}
      </select>
    );
  };

  const renderEmployees = () => {
    return employees
      .filter((employee) => {
        if (!selectedSector) return true; // Exibe todos se nenhum setor for selecionado
        return employee.stock_reference === selectedSector;
      })
      .map((employee) => (
        <tr key={employee.id}>
          <td>{employee.id}</td>
          <td>{employee.name}</td>
          <td>{renderSectorSelection(employee)}</td>
          <td>
            <button onClick={() => handleUpdateSector(employee.id)}>
              Atualizar
            </button>
          </td>
        </tr>
      ));
  };

  return (
    <div>
      <h2>Gerenciamento de Permissões</h2>

      <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
        <option value="">Filtrar por Setor</option>
        {sectors.map((sector) => (
          <option key={sector.id} value={sector.id}>
            {sector.name}
          </option>
        ))}
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
