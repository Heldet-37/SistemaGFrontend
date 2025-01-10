// src/components/Loading.js
import React from 'react';
import './Loading.css';

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="loader"></div>
            <p>Carregando...</p>
        </div>
    );
};

export default Loading;
