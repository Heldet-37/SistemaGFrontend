// frontend/src/components/AddEmployeeModal.js
import React, { useState } from 'react';

const AddEmployeeModal = ({ isOpen, onClose, onAddEmployee }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmployee = { name, email, role, password };
    onAddEmployee(newEmployee);
    onClose();
    setName('');
    setEmail('');
    setRole('');
    setPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Adicionar Funcionário</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Função"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Salvar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default AddEmployeeModal;
