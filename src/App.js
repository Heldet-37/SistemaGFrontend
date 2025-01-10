import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import EmployeeDashboard from './components/EmployeeDashboard';
import SalesStats from './components/SalesStats';
import EmployeeList from './components/EmployeeList';
import ProductList from './components/ProductList';
import FinancialReport from './components/FinancialReport';
import Alerts from './components/Alerts';
import ActivityLog from './components/ActivityLog';
import EmployeeSalesHistory from './components/EmployeeSalesHistory';
import ExportReports from './components/ExportReports';
import PermissionsManager from './components/PermissionsManager';
import StockManager from './components/StockManager';
import EmployeeDataTable from './components/EmployeeDataTable';
import StockTable from './components/StockTable';
import SalesHistory from './components/SalesHistory';
import StockProfile from "./components/StockProfile";

const App = () => {
    const [employees, setEmployees] = useState([]);

    const handleAdd = (newEmployee) => {
        setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    };

    const handleEdit = (updatedEmployee) => {
        setEmployees((prevEmployees) =>
            prevEmployees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
        );
    };

    const handleDelete = (id) => {
        setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== id));
    };

    // Componente de proteção de rota
    const ProtectedRoute = ({ children, roleRequired }) => {
        const userRole = localStorage.getItem('role');
        
        if (!userRole) {
            // Redireciona para o login se o usuário não tiver nenhum papel definido
            return <Navigate to="/" />;
        } else if (userRole !== roleRequired) {
            // Exibe mensagem de "Acesso negado" se o papel não corresponder
            return <div>Acesso negado. Você não tem permissão para acessar esta página.</div>;
        }

        return children;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />

                {/* Rota protegida para o admin */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute roleRequired="admin">
                            <DashboardAdmin />
                        </ProtectedRoute>
                    }
                />

                {/* Rota protegida para o employee */}
                <Route
                    path="/employee-dashboard"
                    element={
                        <ProtectedRoute roleRequired="employee">
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Outras rotas protegidas */}
                <Route path="/sales-stats" element={<ProtectedRoute roleRequired="admin"><SalesStats /></ProtectedRoute>} />
                <Route path="/employee-list" element={<ProtectedRoute roleRequired="admin"><EmployeeList /></ProtectedRoute>} />
                <Route path="/product-list" element={<ProtectedRoute roleRequired="admin"><ProductList /></ProtectedRoute>} />
                <Route path="/financial-report" element={<ProtectedRoute roleRequired="admin"><FinancialReport /></ProtectedRoute>} />
                <Route path="/alerts" element={<ProtectedRoute roleRequired="admin"><Alerts /></ProtectedRoute>} />
                <Route path="/activity-log" element={<ProtectedRoute roleRequired="admin"><ActivityLog /></ProtectedRoute>} />
                <Route path="/employee-sales-history" element={<ProtectedRoute roleRequired="admin"><EmployeeSalesHistory /></ProtectedRoute>} />
                <Route path="/export-reports" element={<ProtectedRoute roleRequired="admin"><ExportReports /></ProtectedRoute>} />
                <Route path="/permissions-manager" element={<ProtectedRoute roleRequired="admin"><PermissionsManager /></ProtectedRoute>} />
                <Route path="/stock-manager" element={<ProtectedRoute roleRequired="admin"><StockManager /></ProtectedRoute>} />
                <Route path="/stock-table" element={<ProtectedRoute roleRequired="employee"><StockTable /></ProtectedRoute>} />
                <Route path="/vendas-pessoais" element={<ProtectedRoute roleRequired="employee"><SalesHistory /></ProtectedRoute>} />

                <Route path='/stocks'
                element={
                    <ProtectedRoute roleRequired='admin'>
                        <StockProfile></StockProfile>
                    </ProtectedRoute>
                }></Route>
                <Route
                    path="/employee-data-table"
                    element={
                        <ProtectedRoute roleRequired="admin">
                            <EmployeeDataTable 
                                employees={employees}
                                onEdit={handleEdit} 
                                onDelete={handleDelete} 
                                onAdd={handleAdd} 
                            />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
