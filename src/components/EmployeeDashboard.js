import React, { useState, useEffect, useRef } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import SalesHistory from './SalesHistory';
import ProductList from './ProductList';
import SalesForm from './SalesForm';
import Notifications from './Notifications';
import Cart from './Cart';
import '../pages/EmployeeDashboard.css';
import { useNavigate } from 'react-router-dom';
import { getResources } from '../services/authService';
import StockTable from './StockTable';


const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }


  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(5);
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [logoutConfirmed, setLogoutConfirmed] = useState(false);
  const [saleConfirmed, setSaleConfirmed] = useState(false);
  const [saleFinalized, setSaleFinalized] = useState(false);
  const [printReceiptConfirmed, setPrintReceiptConfirmed] = useState(false);
  const [productNotSelected, setProductNotSelected] = useState(false);
  const [filteredProductData, setFilteredProductData] = useState([]);




  const token = localStorage.getItem('access'); // Supondo que você armazena o token no localStorage
  const id = localStorage.getItem("employee_id")


  const fetchData = async (url, setData) => {
    try {
      const data = await getResources(url); // Usa a função getResources
      setData(data);

      if (setData === setProductData) {
        setFilteredProductData(data);
      }
    } catch (error) {
      console.error(`Venda realizada com sucesso sub algum erro`);
      setError(`Não foi possível carregar os dados de ${url.split('/')[2]}.`);
    }
  };


  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        // fetchData(`api/employee/${id}/sales`, setSalesData),
        fetchData(`api/products`, setProductData),
        fetchData(`api/cart/items/${id}`, setCart)
      ]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  // Função para calcular o preço total de todos os itens
  const calculateTotalPrices = (items) => {
    return items.reduce((total, { product_price, quantity }) => {
      const price = parseFloat(product_price);
      const qty = parseInt(quantity, 10);

      if (isNaN(price) || isNaN(qty) || qty < 0) {
        console.error("Valores inválidos:", { product_price, quantity });
        return total; // Retornar o total acumulado em caso de erro
      }

      return total + (price * qty); // Somar o total para cada item ao total geral
    }, 0); // Começar o total em 0
  };

  const salesProduct = async ({ cart }) => {
    try {
      // Loop sobre cada item no carrinho
      for (const item of cart) {
        // Preparar os dados para cada venda
        const saleData_ = {
          employee: id, // ID do funcionário
          product: item.product_id, // ID do produto
          sale_quantity: item.quantity, // Quantidade vendida
        };

        // Usa getResources para enviar os dados da venda
        const data = await getResources('api/sales', 'POST', saleData_);

        console.log(`Venda registrada com sucesso! ID da venda: ${data.sale_id}`);
      }

      alert('Todas as vendas registradas com sucesso!');

    } catch (error) {
      alert(`Ocorreu um erro: ${error.message}`); // Exibe a mensagem de erro do servidor
      console.error(error);
    }
  };






  const handleSale = () => {
    const totalAmount = calculateTotalPrices(cart);

    if (payment < totalAmount) {
      alert('Valor pago não é suficiente para completar a venda.');
      return;
    }

    // Passo 1: Confirmar a venda
    setSaleConfirmed(true);
  };

  const confirmSale = () => {
    // Passo 2: Perguntar sobre a impressão da fatura
    setPrintReceiptConfirmed(true); // Mostrar mensagem de confirmação de impressão

    // Finalizar a venda

    setPayment(0);
    setSaleFinalized(true); // Marcar venda como finalizada
    setSaleConfirmed(false); // Fechar a confirmação da venda
    salesProduct({ cart })
  };

  const cancelSale = () => {
    setSaleConfirmed(false); // Fechar a confirmação da venda
  };

  const confirmPrintReceipt = () => {
    printReceipt(); // Imprimir fatura
    setPrintReceiptConfirmed(false); // Fechar confirmação de impressão
    setInterval(function () {
      window.location.reload()
    }, 1000) // 1 second
  };

  const cancelPrintReceipt = () => {
    setPrintReceiptConfirmed(false); // Fechar confirmação de impressão
    setInterval(function () {
      window.location.reload()
    }, 1000) // 1 second
  };

  const handleLogout = () => {
    console.log("Botão de logout clicado");
    setLogoutConfirmed(true); // Apenas define o estado para mostrar a confirmação
  };


  const confirmLogout = () => {
    console.log("Logout confirmado");
    localStorage.removeItem('access'); // Remove o token no logout
    localStorage.removeItem('refresh');
    localStorage.removeItem("employee_id");
    window.location.href = '/';
  };

  const cancelLogout = () => {
    setLogoutConfirmed(false); // Fecha a confirmação de logout
  };

  const filteredProducts = productData.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSales = calculateTotalPrices(cart) //salesData.reduce((total, sale) => total + sale.amount, 0);


  const printReceipt = () => {
    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toLocaleDateString('pt-MZ', { timeZone: 'Africa/Maputo' });
    const formattedTime = currentDateTime.toLocaleTimeString('pt-MZ', { timeZone: 'Africa/Maputo' });

    // Dados do cliente (pode ser dinâmico se necessário)
    const customerInfo = {
      name: "Cliente Padrão", // Atualizável
      address: "1 de Maio, Av. do Trabalho",
      email: "cliente@exemplo.com",
    };

    // Dados do estabelecimento
    const establishmentInfo = {
      name: "Vuchada",
      address: "1 de Maio, Av. do Trabalho",
      email: "vuchada@gmail.com",
    };

    // Função para formatar valores em moeda local (Meticais Moçambique)
    const formatCurrency = (value) => new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
    }).format(value);

    // Função para calcular o total geral
    const calculateTotal = () => {
      return cart.reduce((total, item) => total + (item.quantity * item.product_price), 0).toFixed(2);
    };

    // Número da fatura gerado automaticamente (exemplo)
    const invoiceNumber = Math.floor(Math.random() * 1000000);

    // Dados do recibo (sem repetição)
    const receiptData = `
      Itens Vendidos:
      ${cart.map(item =>
      `${item.product_name} - Quantidade: ${item.quantity}, Preço Unitário: ${formatCurrency(item.product_price)}, Total: ${formatCurrency(item.quantity * item.product_price)}`
    ).join('\n')}
      
      Total Geral: ${formatCurrency(calculateTotal())}
      Forma de Pagamento: Dinheiro
    `;

    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank', 'width=600,height=400');
    printWindow.document.write(`
      <html>
        <head>
          <title>Recibo</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 14px; }
            pre { white-space: pre-wrap; }
            h1 { text-align: center; }
            .details { margin-bottom: 20px; }
            .divider { border-top: 1px solid black; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>Recibo de Venda</h1>
          <div class="details">
            <strong>Nome do Estabelecimento:</strong> ${establishmentInfo.name}<br />
            <strong>Endereço do Estabelecimento:</strong> ${establishmentInfo.address}<br />
            <strong>E-mail do Estabelecimento:</strong> ${establishmentInfo.email}<br />
            <strong>Data:</strong> ${formattedDate} - <strong>Hora:</strong> ${formattedTime}<br />
            <strong>Número da Fatura:</strong> #${invoiceNumber}<br />
            <strong>Nome do Cliente:</strong> ${customerInfo.name}<br />
            <strong>Endereço do Cliente:</strong> ${customerInfo.address}<br />
            <strong>E-mail do Cliente:</strong> ${customerInfo.email}
          </div>
          <div class="divider"></div>
          <pre>${receiptData}</pre>
        </body>
      </html>
    `);

    printWindow.document.close(); // Fecha o documento para aplicar as alterações
    printWindow.print(); // Abre a janela de impressão
    printWindow.close(); // Fecha a janela após a impressão
  };



  return (
    <div className="employee-dashboard">


      <header className="dashboard-header">
        <button onClick={toggleSidebar}>
          <i className="fa fa-bars"></i> Menu
        </button>
        <h1><i className="fa fa-user-circle"></i> Painel do Funcionário</h1>
        <div className="header-icons">
          <Cart />
        </div>
        <button onClick={handleLogout}>
          <i className="fa fa-sign-out"></i> Logout
        </button>
      </header>

      {isSidebarOpen && (
        <div className="sidebar" ref={sidebarRef}>
          <h2>Menu</h2>
          <ul>
            <li><a onClick={() => navigate('/vendas-pessoais')}>Vendas pessoais</a></li>
            <li><a onClick={() => navigate('/stock-table')}>Estoque de Produtos</a></li>

          </ul>
          <button onClick={toggleSidebar}>Fechar</button>
        </div>
      )}


      {loading && (
        <div className="loading-spinner">
          <i className="fa fa-spinner fa-spin"></i> Carregando...
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            <i className="fa fa-refresh"></i> Tentar novamente
          </button>
        </div>
      )}

      <div className="dashboard-content">

        {/* <h2>Produtos Disponíveis</h2>
        <input
          type="text"
          placeholder="Pesquisar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ProductList products={filteredProducts}/> */}

        <div className="sales-container">
          <h2 className="section-title">Registrar Venda</h2>
          <SalesForm products={filteredProducts} token={token} />

          <div className="total-section">
            <h2 className="section-title">Valor Total</h2>
            <p className="total-amount">
              <strong>Total a pagar: {totalSales} MT</strong>
            </p>

            <input
              type="number"
              placeholder="Valor de pagamento"
              value={payment}
              onChange={(e) => setPayment(parseFloat(e.target.value))}
              className="payment-input"
            />

            <button onClick={handleSale} className="finalize-button">
              Finalizar Venda
            </button>
          </div>

          <div className="sales-summary">
            <h2 className="section-title">Total de Vendas</h2>
            <p>
              <strong>Total de vendas realizadas: {salesData.total_sales} MT</strong>
            </p>
          </div>
        </div>

      </div>

      {logoutConfirmed && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <p>Você deseja realmente sair?</p>
            <button className="confirm-button" onClick={confirmLogout}>
              Sim
            </button>
            <button className="cancel-button" onClick={cancelLogout}>
              Não
            </button>
          </div>
        </div>
      )}

      {saleConfirmed && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <p>Deseja realizar esta venda?</p>
            <button className="confirm-button" onClick={confirmSale}>
              Sim
            </button>
            <button className="cancel-button" onClick={cancelSale}>
              Não
            </button>
          </div>
        </div>
      )}

      {printReceiptConfirmed && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <p>Deseja imprimir a fatura?</p>
            <button className="confirm-button" onClick={confirmPrintReceipt}>
              Sim
            </button>
            <button className="cancel-button" onClick={cancelPrintReceipt}>
              Não
            </button>
          </div>
        </div>
      )}

      {productNotSelected && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <p>Nenhum produto selecionado. Por favor, selecione um produto.</p>
            <button className="close-button" onClick={() => setProductNotSelected(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
