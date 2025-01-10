import React, { useState, useEffect, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import SalesStats from './SalesStats';
import FinancialReport from './FinancialReport';
import Alerts from './Alerts';
import TotalInventoryValue from "./TotalInventoryValue"
import ProfitMargin from './ProfitMargin';
import ProductDataTable from './ProductDataTable';
import EmployeeEditForm from './EmployeeEditForm';
import ProductEditForm from './ProductEditForm';
import { getResources } from '../services/authService';
import StockProfile from "./StockManager";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [totalSalesData, setTotalSalesData] = useState([]);
  const [filteredProductData, setFilteredProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockItems, setStockItems] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', acquisition_value: '', quantity: '' });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const sidebarRef = useRef();
  const [logoutConfirmed, setLogoutConfirmed] = useState(false);
  const [staticData, setStaticData] = useState(null);
  const [totalValue, setTotalValue] = useState(0);

  const fetchTotalInventoryValue = async () => {
    try {
      const data = await getResources(`api/total-product-value`); // Use getResources para buscar os dados
      setTotalValue(data.total_stock_value); // Define o valor total do estoque
    } catch (error) {
      console.error('Erro ao buscar o valor total do estoque:', error);
      setError('Não foi possível carregar o valor total do estoque.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalInventoryValue();
  }, []);

  const fetchData = async (url, setData) => {
    try {
      const data = await getResources(url, 'GET'); // Usa a função getResources
  
      setData(data);
      if (setData === setProductData) setFilteredProductData(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      setError(`Não foi possível carregar os dados de ${url.split('/')[2]}.`);
    }
  };
  
  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchData(`api/sales`, setSalesData),
      fetchData(`api/employee`, setEmployeeData),
      fetchData(`api/products`, setProductData),
      fetchData(`api/stockmanager`, setStockItems),
      fetchData("api/static-value", setStaticData)
    ]);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchAllData();
  }, []);
  

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = productData.filter((product) =>
      product.id.toString().includes(query) ||
      product.name.toLowerCase().includes(query) ||
      product.price.toString().includes(query)
    );

    setFilteredProductData(filtered);
  };

  const handleEditProduct = (product) => setEditingProduct(product);
  
  const handleDeleteProduct = async (id) => {
    try {
      // Optimistically remove the product from the UI immediately
      setProductData((prevProducts) => prevProducts.filter(product => product.id !== id));
  
      // Call the function to delete the product from the backend
      await getResources(`api/products/${id}`, 'DELETE');
  
      // After the delete is successful, fetch updated data (if necessary)
      fetchAllData();
     
    } catch (error) {
  
      // If deletion fails, rollback the UI change (optional)
      fetchAllData(); // You can re-fetch the products or restore the deleted item in the state
      fetchTotalInventoryValue();  
    }
  };
  
  
  const handleAddProduct = async (newProduct) => {
    try {
      await getResources('api/products/create', 'POST', newProduct);
      fetchData(`api/products`, setProductData);
      setNewProduct({ name: '', description: '', price: '', acquisition_value: '', quantity: '' });
      setShowAddProductForm(false);
      fetchTotalInventoryValue()
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      alert(`Erro ao adicionar produto: Talvez seja devido a mesma descriçao`);
    }
  };
  
  const handleUpdateEmployee = async (updatedEmployee) => {
    try {
      await getResources(`api/employee/update/${updatedEmployee.id}`, 'PUT', updatedEmployee);
      setEditingEmployee(null);
      fetchData(`api/employee`, setEmployeeData);
    } catch (error) {
      console.error('Erro ao atualizar empregado:', error);
      alert(`Erro ao atualizar empregado: ${error.message}`);
    }
  };
  
  const handleUpdateProduct = async (updatedProduct) => {
    try {
      await getResources(`api/products/${updatedProduct.id}/update`, 'PUT', updatedProduct);
      setEditingProduct(null);
      fetchData(`api/products`, setProductData);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert(`Erro ao atualizar produto: ${error.message}`);
    }
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

const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
};

const handleClickOutside = (event) => {
  if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
    setIsSidebarOpen(false);
  }
};
  
  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);


  return (
    <div className="dashboard-admin">
      <h1>Painel do Administrador</h1>

      <button onClick={toggleSidebar} className="menu-button">
        <i className="fa fa-bars"></i>
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

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

      {isSidebarOpen && (
        <div className="sidebar" ref={sidebarRef}>
          <h2>Menu</h2>
          <ul>
            {/* <li><a onClick={() => navigate('/product-list')}>Lista de Produtos</a></li> */}
            <li><a onClick={() => navigate('/employee-list')}>Lista de Funcionários</a></li>
            <li><a onClick={() => navigate('/activity-log')}>Registro de Atividades</a></li>
            <li><a onClick={() => navigate('/employee-sales-history')}>Histórico de Vendas</a></li>
            <li><a onClick={()=> navigate('/stocks')}>Stocks</a></li>
            <li><a onClick={() => navigate('/export-reports')}>Exportar Relatórios</a></li>
            <li><a onClick={() => navigate('/permissions-manager')}>Gerenciar Permissões</a></li>
            <li><a onClick={() => navigate('/stock-manager')}>Gerenciar Estoque</a></li>
          </ul>
          <button onClick={toggleSidebar}>Fechar</button>
        </div>
      )}

      <div className="dashboard-overview">
        <SalesStats  staticValue={staticData}/>
        <FinancialReport  finaStatic={staticData}/>
        <Alerts />
        <TotalInventoryValue totalValue={totalValue} />

        <ProfitMargin marginStatic={staticData}/>
        {/* <StockProfile></StockProfile> */}
      </div>

      <div className="dashboard-lists">
        {/* <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div> */}

      <div style={{
        'position': 'relative'
      }}>
        
        {showAddProductForm && (
          <div className="add-product-form" style={
            {

            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            }
          }>
            {/* <h2>Adicionar Produto</h2> */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddProduct(newProduct);
              }}
            >
              <input
                type="text"
                placeholder="Nome"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Descrição"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Valor de Venda"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Valor de Aquisição"
                value={newProduct.acquisition_value}
                onChange={(e) => setNewProduct({ ...newProduct, acquisition_value: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Quantidade do produto"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                required
              />
              <button type="submit">Adicionar Produto</button>
              <button type="button" onClick={() => setShowAddProductForm(false)}>Cancelar</button>
            </form>
          </div>
        )}
      <button onClick={() => setShowAddProductForm(true)} className="add-product-button">
        Adicionar Novo Produto
      </button>
      </div> 


        <ProductDataTable
          products={filteredProductData}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />

      </div>
      
      {editingEmployee && (
        <EmployeeEditForm
          employee={editingEmployee}
          onUpdate={handleUpdateEmployee}
          onClose={() => setEditingEmployee(null)}
        />
      )}

     

      {editingProduct && (
        <ProductEditForm
          product={editingProduct}
          onUpdate={handleUpdateProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default DashboardAdmin;
