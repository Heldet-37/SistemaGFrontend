// src/components/Sidebar.js
import React, { forwardRef } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Sidebar.css';

const Sidebar = forwardRef((props, ref) => {
  return (
    <div className="sidebar" ref={ref}>
      <h2>Menu Lateral</h2>
      <ul>
        <li>
          <i className="fa fa-home"></i> Home
        </li>
        <li>
          <i className="fa fa-list"></i> Vendas
        </li>
        <li>
          <i className="fa fa-cog"></i> Configurações
        </li>
        <li>
          <i className="fa fa-user"></i> Perfil
        </li>
        <li>
          <i className="fa fa-sign-out"></i> Logout
        </li>
      </ul>
    </div>
  );
});

export default Sidebar;
