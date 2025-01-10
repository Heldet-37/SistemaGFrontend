import React, { useState, useEffect } from 'react';
import { getResources } from '../services/authService';
import '../styles/styles.css'; // Arquivo de CSS atualizado

const ExportReports = () => {
  const [salesData, setSalesData] = useState([]);
  const [employees, setEmployees] = useState([]); // Lista de funcionários
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [exportAll, setExportAll] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');

  
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const result = await getResources('api/sales-by-employee');
        setSalesData(result || []);
      } catch (error) {
        console.error('Erro ao buscar histórico de vendas:', error);
        setSalesData([]);
      } finally {
        setLoadingSales(false);
      }
    };

    fetchSalesData();
  }, []);

  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await getResources('api/employee'); 
        const formattedResult = result.map(employee => ({
          id: employee.id,
          name: employee.name
        }));
        setEmployees(formattedResult || []);
      } catch (error) {
        console.error('Erro ao buscar lista de funcionários:', error);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  const downloadFile = (data, filename) => {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      // Define a URL da API para gerar o relatório
      const employeeId = exportAll ? '' : selectedEmployee; 
      const reportDate = exportAll ? '' : selectedDate; 

      
      const response = await getResources(`/api/generate-report/?id=${employeeId}&date=${reportDate}`);

      if (response) {
        const filename = `relatorio_vendas_${employeeId}_${reportDate || 'todos'}.${exportFormat}`;
        downloadFile(response, filename);
        setShowModal(false);
        alert("Exportação realizada com sucesso!");
      } else {
        alert("Erro: Não foi possível gerar o relatório.");
      }
    } catch (error) {
      console.error('Erro ao gerar o relatório:', error);
      alert("Erro ao gerar o relatório. Tente novamente mais tarde.");
    }
  };

  const openModal = (format) => {
    setExportFormat(format);
    setShowModal(true);
  };

  return (
    <div className="export-reports">
      <h2>Exportar Relatórios de Vendas</h2>
      {loadingSales || loadingEmployees ? (
        <p>Carregando dados...</p>
      ) : (
        <>
          <button className="btn-export" onClick={() => openModal('csv')}>
            Exportar como CSV
          </button>
          <button className="btn-export" onClick={() => openModal('pdf')}>
            Exportar como PDF
          </button>
        </>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Deseja exportar vendas de todos os funcionários?</h3>
            <div className="modal-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="exportOption"
                  value="all"
                  checked={exportAll}
                  onChange={() => setExportAll(true)}
                />
                Todos os funcionários
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="exportOption"
                  value="individual"
                  checked={!exportAll}
                  onChange={() => setExportAll(false)}
                />
                Apenas um funcionário
              </label>
            </div>

            {!exportAll && (
              <div className="filter-options">
                <label>
                  Funcionário:
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">Selecione um funcionário</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Data/Mês:
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </label>
              </div>
            )}

            <button className="btn-confirm" onClick={handleExport}>
              Exportar como {exportFormat.toUpperCase()}
            </button>
            <button className="btn-cancel" onClick={() => setShowModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportReports;
