// ============================================================
// ZAP API Client — centralized fetch helper
// ============================================================

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Thin wrapper around fetch for the ZAP backend.
 * @param {string} path   - API path, e.g. "/auth/login"
 * @param {object} options
 * @param {string} [options.method]  - HTTP method (default GET)
 * @param {object} [options.body]    - Request body (will be JSON-stringified)
 * @param {string} [options.token]   - JWT token for Authorization header
 * @returns {Promise<object>} Parsed JSON response
 */
export async function apiFetch(path, { method, body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method: method || 'GET',
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, config);

  const data = await res.json();

  if (!res.ok || data.success === false) {
    const error = new Error(data.error || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export default apiFetch;