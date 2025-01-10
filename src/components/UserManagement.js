// src/components/UserManagement.js

import React, { useEffect, useState } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [editUserId, setEditUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getResource('/api/users'); // Usa a função getResource para obter os usuários
            setUsers(data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { username, role };

        if (editUserId) {
            // Editar usuário existente
            await fetch(`/api/users/${editUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
        } else {
            // Adicionar novo usuário
            await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
        }

        setUsername('');
        setRole('');
        setEditUserId(null);
        fetchUsers();
    };

    const handleEdit = (user) => {
        setUsername(user.username);
        setRole(user.role);
        setEditUserId(user._id);
    };

    const handleDelete = async (userId) => {
        await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        fetchUsers();
    };

    return (
        <div className="container mt-4">
            <h2>Gerenciar Usuários</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nome de Usuário</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Função</label>
                    <select
                        className="form-control"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="">Selecione...</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Funcionário</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    {editUserId ? 'Atualizar Usuário' : 'Adicionar Usuário'}
                </button>
            </form>

            <h3 className="mt-4">Usuários</h3>
            <table className="table mt-2">
                <thead>
                    <tr>
                        <th>Nome de Usuário</th>
                        <th>Função</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="btn btn-warning" onClick={() => handleEdit(user)}>Editar</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>Remover</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
