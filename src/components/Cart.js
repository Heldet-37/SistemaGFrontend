import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { API } from './API'; // Certifique-se de ter configurado corretamente o endpoint API
import { getResources
  
 } from '../services/authService';
const Cart = () => {
  const [cartData, setCartData] = useState(null); // Estado para armazenar os dados do carrinho
  const [loading, setLoading] = useState(true); // Estado para controle de loading
  const [error, setError] = useState(null); // Estado para capturar erros

  const token = localStorage.getItem("access"); // Substitua pelo seu token
  // Função para remover item do carrinho
  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`${API}/api/cart/remove/${itemId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        // Item removido com sucesso, atualize o estado do carrinho
        setCartData((prevCartData) => ({
          ...prevCartData,
          items: prevCartData.items.filter((item) => item.id !== itemId),
        }));
        setInterval(function(){
           window.location.reload();
         }, 1000);
      } else {
        console.error('Erro ao remover item do carrinho');
      
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  };

  // Função para buscar dados do carrinho usando getResources
  const fetchCartData = async () => {
    try {
      const data = await getResources('api/cart', 'GET');
      setCartData(data); // Armazena os dados do carrinho
    } catch (err) {
      console.error('Erro ao buscar dados do carrinho:', err);
      setError(err.message || 'Erro ao buscar dados do carrinho'); // Armazena o erro
      alert(`Erro: ${err.message}`); // Exibe a mensagem de erro do backend
    } finally {
      setLoading(false); // Finaliza o loading
    }
  };

  // useEffect para chamar a função de fetch quando o componente monta
  useEffect(() => {
    fetchCartData();
  }, []);

  // Renderiza o conteúdo
  return (
    <div className="cart">
      <h3>
        <FaShoppingCart /> Carrinho
      </h3>
      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
      {cartData && cartData.items.length > 0 ? (
        <ul>
          {cartData.items.map((item) => (
            <li key={item.id}>
              {item.product_name} - {item.product_price} MT (Quantidade: {item.quantity})
              <button onClick={() => removeFromCart(item.id)}>Remover</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>O carrinho está vazio.</p>
      )}
    </div>
  );
};

export default Cart;
