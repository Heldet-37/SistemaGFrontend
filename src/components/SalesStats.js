const SalesStats = ({staticValue}) => {
  


  if (!staticValue || staticValue.length === 0) {
    return <p>No sales data available.</p>;
  }

  // Exemplo de como processar os dados
  const totalSales = staticValue.total_sales_value;
  
  return (
    <div className="sales-stats">
      <h2>Estatísticas de Vendas</h2>
      <p>Total de Vendas: {totalSales}</p>
      {/* Adicione mais estatísticas conforme necessário */}
    </div>
  );
};

export default SalesStats;
