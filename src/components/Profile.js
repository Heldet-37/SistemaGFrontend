import React, { useState } from 'react';
import './Profile.css'; // Certifique-se de que o caminho está correto

const Profile = ({ userProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    // Aqui você pode implementar a lógica para salvar as alterações no perfil
    console.log('Perfil salvo:', editedProfile);
    setIsEditing(false);
  };

  return (
    <div className="profile">
      <h2>Perfil do Funcionário</h2>
      {isEditing ? (
        <div>
          <input
            type="text"
            name="name"
            value={editedProfile.name}
            onChange={handleInputChange}
            placeholder="Nome"
          />
          <input
            type="email"
            name="email"
            value={editedProfile.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          {/* Adicione mais campos conforme necessário */}
          <button className="edit-profile-button" onClick={handleSaveClick}>
            Salvar
          </button>
        </div>
      ) : (
        <div>
          <p><strong>Nome:</strong> {userProfile.name}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>
          {/* Adicione mais dados do perfil conforme necessário */}
          <button className="edit-profile-button" onClick={handleEditClick}>
            Editar Perfil
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
