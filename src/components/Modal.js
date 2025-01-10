import React from 'react';
import './Modal.css'; // Crie um arquivo CSS para estilizar o modal

const Modal = ({ isOpen, onClose, data, onSave }) => {
  if (!isOpen) return null;

  const handleSave = () => {
    // Implementar lógica de salvar
    onSave(data);
    onClose(); // Fecha o modal após salvar
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Item</h2>
        {/* Renderizar campos de edição aqui com base nos dados */}
        <input 
          type="text" 
          value={data.name} 
          onChange={(e) => (data.name = e.target.value)} 
        />
        {/* Adicione mais campos conforme necessário */}
        <button onClick={handleSave}>Salvar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default Modal;
