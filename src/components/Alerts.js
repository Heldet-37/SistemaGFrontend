import React, { useEffect, useState } from 'react';
import { getResources } from '../services/authService';
import './alerts.css';

const fetchData = async (url, setData, setLoading, setError) => {
  try {
    setLoading(true);
    const data = await getResources(url);
    setData(data);
  } catch (error) {
    console.error(`Erro ao buscar dados de ${url}:`, error);
    setError('Ocorreu um erro ao carregar os alertas.');
  } finally {
    setLoading(false);
  }
};

const AlertItem = ({ alert }) => {
  const alertClass = `alert-${alert.type || 'info'}`;
  return (
    <li className={alertClass}>
      {alert.message}
    </li>
  );
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData('api/notifications', setAlerts, setLoading, setError);
  }, []);

  return (
    <div className="alerts">
      <h2>Alertas</h2>
      {loading && <p>Carregando alertas...</p>}
      {error && (
        <div>
          <p>{error}</p>
          <button onClick={() => fetchData('api/notifications', setAlerts, setLoading, setError)}>
            Tentar novamente
          </button>
        </div>
      )}
      <div className="alerts-list">
        <ul>
          {alerts.map((alert, index) => (
            <AlertItem key={index} alert={alert} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Alerts;
