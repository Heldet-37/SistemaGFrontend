import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import './Notifications.css';
import { useNavigate } from 'react-router-dom';
import { getResources } from '../services/authService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch inicial das notificações quando o componente é montado
    fetchData(`api/notifications`, setNotifications);
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = async (id) => {
    try {
      // Atualiza o estado local antes de fazer a requisição
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      );
  
      // Chama a API para marcar como lida
      const response = await getResources(`api/notifications/${id}/read`, 'PATCH');
  
      console.log('Notificação marcada como lida:', response);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };
  
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchData = async (url, setData) => {
    try {
      const data = await getResources(url);
      setData(data);
     
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      setError(`Não foi possível carregar os dados de ${url.split('/')[2]}.`);
    }
  };



  return (
    <div className="notifications-container">
      <div className="bell-icon" onClick={toggleNotifications}>
        <FaBell />
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </div>
      {showNotifications && (
        <div className="notification-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
              onClick={() => markAsRead(notification.id)}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Notifications;
