import React from 'react';
import '../styles/styles.css'; // Importa o arquivo de estilos
import { getResources } from '../services/authService';

const ActivityLog = () => {
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);


 
const fetchData = async (url, setData, setError, setLoading) => {
  try {
    const data = await getResources(url);
    setData(data);
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
  } finally {
    setLoading(false);
  }
};

// Atualização no useEffect
React.useEffect(() => {
 
  fetchData('api/login-activities', setLogs, setError, setLoading);
}, []);



  if (loading) return <p>Carregando logs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="activity-log-container">
      <h2 className="activity-log-title">Histórico de Atividades</h2>
      {logs.length > 0 ? (
        <table className="activity-log-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Horário de Login</th>
              <th>Endereço IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.username}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-logs">Nenhum log encontrado.</p>
      )}
    </div>
  );
};

export default ActivityLog;
