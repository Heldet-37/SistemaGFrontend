import React, { useState } from 'react';

const EmployeeEditForm = ({ employee, onSubmit, onCancel }) => {
  const [name, setName] = useState(employee.name);
  const [role, setRole] = useState(employee.role);
  const [email, setEmail] = useState(employee.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...employee, name, role, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nome:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Cargo:
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <button type="submit">Salvar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default EmployeeEditForm;

