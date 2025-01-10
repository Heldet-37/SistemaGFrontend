import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/styles.css'; // Certifique-se de que o caminho esteja correto para o seu projeto
import { getResources } from '../services/authService';

const EmployeeDataTable = ({ employees = [], onEdit, onDelete, onAdd }) => {
    const [showForm, setShowForm] = useState(false);
    const [fetchedEmployees, setFetchedEmployees] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

    const token = localStorage.getItem('access');

    const sectors = [
        { value: '', label: 'Selecione um setor' },
        { value: 'Mercearia', label: 'Mercearia' },
        { value: 'Restaurante', label: 'Restaurante' },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getResources(`api/employee`);
            setFetchedEmployees(data);
        } catch (error) {
            console.error(`Erro ao buscar dados:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [newEmployee, setNewEmployee] = useState({
        name: '',
        username: '',
        email: '',
        contact: '',
        address: '',
        role: '',
        password: '',
        sector: '',
    });

    const handleAddClick = async () => {
        try {
            if (isEditing) {
                await getResources(`api/employee/${currentEmployeeId}`, 'PUT', newEmployee);
            } else {
                const addedEmployee = await getResources(`api/employee`, 'POST', newEmployee);
                setFetchedEmployees([...fetchedEmployees, addedEmployee]);
            }

            await fetchData();
            handleCloseForm();
        } catch (error) {
            console.error('Erro ao adicionar ou editar funcionário:', error);
        }
    };

    const handleEditClick = (employee) => {
        setIsEditing(true);
        setShowForm(true);
        setNewEmployee(employee);
        setCurrentEmployeeId(employee.id);
    };

    const handleDeleteClick = async (employeeId) => {
        try {
            await getResources(`api/employee/${employeeId}`, 'DELETE');
            await fetchData();
        } catch (error) {
            console.error('Erro ao remover funcionário:', error);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setIsEditing(false);
        setNewEmployee({
            name: '',
            username: '',
            email: '',
            contact: '',
            address: '',
            role: '',
            password: '',
            sector: '',
        });
    };

    return (
        <div className="employee-data-table">
            <h2>Dados dos Funcionários</h2>
            <button onClick={() => setShowForm(true)}>Adicionar Funcionário</button>

            {loading ? (
                <p>Carregando funcionários...</p>
            ) : (
                <>
                    {showForm && (
                        <div className="form-container">
                            <form onSubmit={(e) => { e.preventDefault(); handleAddClick(); }}>
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    value={newEmployee.name}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Usuário"
                                    value={newEmployee.username}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Contato"
                                    value={newEmployee.contact}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, contact: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Endereço"
                                    value={newEmployee.address}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Função"
                                    value={newEmployee.role}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Senha"
                                    value={newEmployee.password}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                                    required
                                />
                                <select
                                    value={newEmployee.sector}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, sector: e.target.value })}
                                    required
                                >
                                    {sectors.map((sector) => (
                                        <option key={sector.value} value={sector.value}>
                                            {sector.label}
                                        </option>
                                    ))}
                                </select>
                                <button type="submit">{isEditing ? 'Editar' : 'Adicionar'}</button>
                                <button type="button" onClick={handleCloseForm}>Fechar</button>
                            </form>
                        </div>
                    )}

                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Usuário</th>
                                <th>Email</th>
                                <th>Contato</th>
                                <th>Endereço</th>
                                <th>Função</th>
                                <th>Setor</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetchedEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="9">Nenhum funcionário encontrado.</td>
                                </tr>
                            ) : (
                                fetchedEmployees.map(employee => (
                                    <tr key={employee.id}>
                                        <td>{employee.id}</td>
                                        <td>{employee.name}</td>
                                        <td>{employee.username}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.contact}</td>
                                        <td>{employee.address}</td>
                                        <td>{employee.role === 'employee' ? 'Funcionário' : 'Administrador'}</td>
                                        <td>{employee.sector || 'Não informado'}</td>
                                        <td>
                                            <button onClick={() => handleEditClick(employee)}>Editar</button>
                                            <button onClick={() => handleDeleteClick(employee.id)}>Remover</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

EmployeeDataTable.propTypes = {
    employees: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired, 
};

export default EmployeeDataTable;
