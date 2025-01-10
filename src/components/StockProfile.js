import React, { useState, useEffect } from "react";
import { getResources } from "../services/authService";

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [newStock, setNewStock] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Controle do Modal
  const [stockToActivate, setStockToActivate] = useState(null); // Armazenar o estoque que será ativado

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: value });
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null); // Resetando erro
    try {
      const data = await getResources("api/create-stock", "GET");
      if (data && Array.isArray(data)) {
        setStocks(data);
        // Persistindo os dados no localStorage
        localStorage.setItem("stocks", JSON.stringify(data));
      } else {
        throw new Error("Dados inválidos recebidos da API");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError("Não foi possível carregar os estoques.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedStocks = localStorage.getItem("stocks");
    if (storedStocks) {
      setStocks(JSON.parse(storedStocks));
    } else {
      fetchData();
    }
  }, []);

  const addStock = async () => {
    if (!newStock.name || !newStock.description) {
      alert("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError(null); // Resetando erro
    try {
      await getResources("api/create-stock", "POST", newStock);
      fetchData();
      setNewStock({ name: "", description: "" });
    } catch (error) {
      console.error("Erro ao adicionar estoque:", error);
      setError("Erro ao conectar com a API.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStockStatus = async (stockId, currentStatus) => {
    if (currentStatus === "active") {
      return; // Nenhuma ação necessária, já está ativo
    }

    // Verifica se já existe um estoque ativo
    const activeStock = stocks.find((stock) => stock.status === "active");
    if (activeStock) {
      // Se já houver estoque ativo, abre o modal para informar o usuário
      setStockToActivate(stockId); // Armazenar o estoque a ser ativado
      setShowModal(true);
    } else {
      // Caso contrário, ativa o estoque
      setLoading(true);
      setError(null); // Resetando erro
      try {
        await getResources(`api/stock-reference/${stockId}/activate`, "POST");
        const updatedStocks = stocks.map((stock) =>
          stock.id === stockId ? { ...stock, status: "active" } : stock
        );
        setStocks(updatedStocks);
        localStorage.setItem("stocks", JSON.stringify(updatedStocks));
      } catch (error) {
        console.error("Erro ao ativar estoque:", error);
        setError("Erro ao conectar com a API.");
      } finally {
        setLoading(false);
      }
    }
  };

  const deactivateStock = async (stockId) => {
    setLoading(true);
    setError(null); // Resetando erro
    try {
      // Desativa o estoque atual
      await getResources(`api/stock-reference/${stockId}/deactivate`, "POST");
      const updatedStocks = stocks.map((stock) =>
        stock.id === stockId ? { ...stock, status: "inactive" } : stock
      );
      setStocks(updatedStocks);
      localStorage.setItem("stocks", JSON.stringify(updatedStocks));

      // Ativa o estoque selecionado após a desativação
      await toggleStockStatus(stockToActivate, "inactive");

      setShowModal(false); // Fechar modal após a desativação
    } catch (error) {
      console.error("Erro ao desativar estoque:", error);
      setError("Erro ao conectar com a API.");
    } finally {
      setLoading(false);
    }
  };

  const deleteStock = async (stockId) => {
    if (!stockId) return;

    if (window.confirm("Tem certeza de que deseja excluir este estoque?")) {
      setLoading(true);
      try {
        await getResources(`api/stock-reference/${stockId}/delete`, "DELETE");
        fetchData();
        const persistedStatuses = JSON.parse(localStorage.getItem("stockStatuses")) || {};
        delete persistedStatuses[stockId];
        localStorage.setItem("stockStatuses", JSON.stringify(persistedStatuses));
      } catch (error) {
        console.error("Erro ao excluir estoque:", error);
        alert("Erro ao conectar com a API.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Gestão de Estoques</h1>

      {error && (
        <div style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>
          <strong>{error}</strong>
        </div>
      )}

      <div style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "20px", borderRadius: "5px" }}>
        <h2 style={{ marginBottom: "10px", color: "#007BFF" }}>Adicionar Estoque</h2>
        <input
          type="text"
          name="name"
          placeholder="Nome do Estoque"
          value={newStock.name}
          onChange={handleInputChange}
          style={{ margin: "5px", padding: "8px", width: "100%" }}
        />
        <input
          type="text"
          name="description"
          placeholder="Descrição"
          value={newStock.description}
          onChange={handleInputChange}
          style={{ margin: "5px", padding: "8px", width: "100%" }}
        />
        <button
          onClick={addStock}
          style={{
            padding: "10px 15px",
            marginTop: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
          disabled={loading}
          aria-label="Adicionar Estoque"
        >
          {loading ? "Adicionando..." : "Adicionar Estoque"}
        </button>
      </div>

      <div>
        <h2 style={{ marginBottom: "10px", color: "#333" }}>Estoques Cadastrados</h2>
        {loading ? (
          <p style={{ textAlign: "center", color: "#666" }}>Carregando estoques...</p>
        ) : stocks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>Nenhum estoque cadastrado ainda.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {stocks.map((stock) => (
              <li
                key={stock.id}
                style={{
                  marginBottom: "10px",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  backgroundColor: stock.status === "active" ? "#e9f7ef" : "#f8d7da",
                }}
              >
                <strong style={{ color: stock.status === "active" ? "#28a745" : "#d0021b" }}>
                  {stock.name} ({stock.status === "active" ? "Ativo" : "Inativo"})
                </strong>
                <p style={{ margin: "5px 0", color: "#555" }}>Descrição: {stock.description}</p>
                <button
                  onClick={() => toggleStockStatus(stock.id, stock.status)}
                  style={{
                    backgroundColor: stock.status === "active" ? "#d0021b" : "#28a745",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    marginRight: "10px",
                  }}
                  aria-label={stock.status === "active" ? "Desativar Estoque" : "Ativar Estoque"}
                >
                  {stock.status === "active" ? "Desativar" : "Ativar"}
                </button>
                <button
                  onClick={() => deleteStock(stock.id)}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                  }}
                  aria-label="Excluir Estoque"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "5px",
              textAlign: "center",
              width: "300px",
            }}
          >
            <h3>Já existe um estoque ativo!</h3>
            <p>Você precisa desativar o estoque atual antes de ativar outro.</p>
            <button
              onClick={() => deactivateStock(stocks.find((stock) => stock.status === "active").id)}
              style={{
                padding: "10px 15px",
                marginTop: "10px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              Desativar Estoque Atual
            </button>
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "10px 15px",
                marginTop: "10px",
                backgroundColor: "#d0021b",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
