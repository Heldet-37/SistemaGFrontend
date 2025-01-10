import { API } from "../components/API";

let refreshingFunc = undefined;

// Função que verifica se a resposta é de erro de não autorizado (401)
function isUnauthorizedError(response) {
  return response.status === 401;
}

// Função para autenticação de usuário
export async function authenticate(userName, password) {
  const loginPayload = {
    username: userName,
    password: password,
  };

  const response = await fetch(`${API}/api/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginPayload),
  });

  const data = await response.json();
  const token = data.access;
  const refreshToken = data.refresh;
  const role = data.employee["role"];
  const employeeId = data.employee["id"];

  return [token, refreshToken, role, employeeId];
}

// Função para renovar o token de acesso
export async function renewToken() {
  const refreshToken = localStorage.getItem("refresh");

  if (!refreshToken) throw new Error("Refresh token does not exist");

  const refreshPayload = {
    refreshToken: refreshToken,
  };

  const response = await fetch(`${API}/api/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(refreshPayload),
  });

  const data = await response.json();
  const newToken = data.authorizationToken;
  const newRefreshToken = data.refreshToken;

  return [newToken, newRefreshToken];
}

// Função para buscar recursos da API com autenticação
export async function getResources(url, method = "GET", body = null) {
  const headers = withAuth();

  const options = {
    method: method,
    headers: headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API}/${url}/`, options);

  if (isUnauthorizedError(response)) {
    const [newToken, newRefreshToken] = await handleTokenRefresh();
    return await fetch(`${API}/${url}`, {
      method: method,
      headers: withAuth(newToken),
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  const data = await response.json();
  return data;
}

// Função para renovar o token
async function handleTokenRefresh() {
  try {
    if (!refreshingFunc) {
      refreshingFunc = renewToken();
    }

    const [newToken, newRefreshToken] = await refreshingFunc;

    localStorage.setItem("access", newToken);
    localStorage.setItem("refresh", newRefreshToken);

    return [newToken, newRefreshToken];
  } catch (error) {
    console.error("Error during token renewal:", error);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location = `${window.location.origin}/`;
    throw error;
  } finally {
    refreshingFunc = undefined;
  }
}

// Função para adicionar o token de autenticação nas requisições
function withAuth(token) {
  const authToken = token || localStorage.getItem("access");

  if (!authToken) {
    window.location = `${window.location.origin}/`;
    return {};
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };
}

// Função para atualizar permissões de um funcionário
export async function updatePermissions(url, employeeId, permissions) {
  const headers = withAuth();

  const response = await fetch(`${API}/${url}/`, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify({
      employeeId,
      permissions, // As permissões selecionadas
    }),
  });

  if (isUnauthorizedError(response)) {
    const [newToken, newRefreshToken] = await handleTokenRefresh();
    return await fetch(`${API}/${url}`, {
      method: "PUT",
      headers: withAuth(newToken),
      body: JSON.stringify({
        employeeId,
        permissions,
      }),
    });
  }

  const data = await response.json();
  return data;
}

