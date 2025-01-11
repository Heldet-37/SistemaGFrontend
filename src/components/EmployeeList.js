import React, { useState } from 'react';
import './EmployeeList.css';
import EmployeeDataTable from './EmployeeDataTable'; // Importando o componente de tabela

const EmployeeList = ({ employees: initialEmployees, onAdd }) => {
  const [employees, setEmployees] = useState(initialEmployees || []); // Lista de funcionários recebida como prop
  const [name, setName] = useState(''); // Nome do funcionário
  const [username, setUsername] = useState(''); // Usuário do funcionário
  const [email, setEmail] = useState(''); // Email do funcionário
  const [contact, setContact] = useState(''); // Contato do funcionário
  const [address, setAddress] = useState(''); // Endereço do funcionário
  const [role, setRole] = useState('employee'); // Função do funcionário (admin/employee)
  const [password, setPassword] = useState(''); // Senha do funcionário
  const [editingId, setEditingId] = useState(null); // ID do funcionário em edição
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Para exibir o modal de confirmação
  const [employeeToDelete, setEmployeeToDelete] = useState(null); // Para armazenar o funcionário a ser removido
  const [showForm, setShowForm] = useState(false); // Estado para controlar a exibição do formulário

  // Função para adicionar ou atualizar um funcionário
  const handleAddOrUpdateEmployee = (e) => {
    e.preventDefault(); // Evita o recarregamento da página

    if (name && username && email && contact && address && role && password) { // Verifica se todos os campos estão preenchidos
      const newEmployee = {
        id: editingId !== null ? editingId : employees.length + 1, // ID único para o funcionário
        name,
        username,
        email,
        contact,
        address,
        role,
        password,
      };

      if (editingId !== null) {
        // Atualiza o funcionário existente
        const updatedEmployees = employees.map(employee => employee.id === editingId ? newEmployee : employee);
        setEmployees(updatedEmployees);
        setEditingId(null); // Limpa a edição
      } else {
        // Adiciona um novo funcionário
        const updatedEmployees = [...employees, newEmployee];
        setEmployees(updatedEmployees);
      }

      // Limpa os campos
      setName('');
      setUsername('');
      setEmail('');
      setContact('');
      setAddress('');
      setRole('employee'); // Reseta a função para 'employee'
      setPassword('');
      setShowForm(false); // Oculta o formulário após a adição ou atualização
      
      // Chama a função onAdd se fornecida
      if (typeof onAdd === 'function') {
        onAdd(newEmployee); // Passa o novo funcionário para o callback
      }
    }
  };

  // Função para iniciar a edição de um funcionário
  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setName(employee.name);
    setUsername(employee.username);
    setEmail(employee.email);
    setContact(employee.contact);
    setAddress(employee.address);
    setRole(employee.role);
    setPassword(employee.password);
    setShowForm(true); // Exibe o formulário ao editar
  };

  // Função para confirmar a remoção do funcionário
  const confirmLogout = () => {
    if (employeeToDelete !== null) {
      const updatedEmployees = employees.filter(employee => employee.id !== employeeToDelete);
      setEmployees(updatedEmployees);
      setShowLogoutConfirm(false); // Fecha o modal
      setEmployeeToDelete(null); // Limpa a seleção do funcionário
    }
  };

  // Função para cancelar a remoção
  const cancelLogout = () => {
    setShowLogoutConfirm(false); // Fecha o modal
    setEmployeeToDelete(null); // Limpa a seleção do funcionário
  };

  // Função para mostrar o modal de confirmação
  const handleDelete = (id) => {
    setEmployeeToDelete(id); // Armazena o ID do funcionário a ser removido
    setShowLogoutConfirm(true); // Abre o modal de confirmação
  };

  // Função para cancelar a edição ou adição de um funcionário
  const handleCancel = () => {
    setShowForm(false); // Fecha o formulário
    setEditingId(null); // Limpa a edição
    setName(''); // Limpa o nome
    setUsername(''); // Limpa o usuário
    setEmail(''); // Limpa o email
    setContact(''); // Limpa o contato
    setAddress(''); // Limpa o endereço
    setRole('employee'); // Reseta a função para 'employee'
    setPassword(''); // Limpa a senha
  };

  return (
    <div>
      {/* Botão para exibir o formulário */}

      {/* Formulário para adicionar ou editar funcionário */}
      {showForm && (
        <form onSubmit={handleAddOrUpdateEmployee}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="exemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="ex: 943919317"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="ex: Rua 1 de maio"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="admin">Admin</option>
          <option value="employee">Funcionário</option>
          </select>
          
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{editingId ? 'Atualizar Funcionário' : 'Adicionar Funcionário'}</button>
          <button type="button" onClick={handleCancel}>Cancelar</button> {/* Botão de cancelar */}
        </form>
      )}

      {/* Componente de tabela de funcionários */}
      <EmployeeDataTable
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={onAdd} // Passando a função onAdd, se necessário
      />

      {/* Modal de confirmação */}
      {showLogoutConfirm && ( 
        <div className="modal">
          <div className="modal-content">
            <h2>Remoção</h2> 
            <p>Tens a certeza que desejas remover?</p> 
            <button onClick={confirmLogout}>Sim</button>
            <button onClick={cancelLogout}>Não</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
