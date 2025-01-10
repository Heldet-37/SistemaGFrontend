// src/components/SalesChart.js

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrando os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = ({ salesData }) => {
  const data = {
    labels: salesData.map((item) => item.label), // Rótulos do gráfico
    datasets: [
      {
        label: 'Vendas',
        data: salesData.map((item) => item.value), // Valores do gráfico
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de fundo
        borderColor: 'rgba(75, 192, 192, 1)', // Cor da borda
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfico de Vendas',
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}> {/* Ajuste o tamanho do gráfico aqui */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default SalesChart;
