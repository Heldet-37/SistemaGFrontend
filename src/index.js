import React from 'react';
import ReactDOM from 'react-dom/client'; // Mantendo esta importação
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles/styles.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
