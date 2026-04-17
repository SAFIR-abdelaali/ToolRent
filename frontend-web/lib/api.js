import axios from 'axios';
import Cookies from 'js-cookie';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8000';
const TOOLS_URL = process.env.NEXT_PUBLIC_TOOLS_API_URL || 'http://localhost:8001';

// ── Auth API ────────────────────────────────────────────────────────────────

const getToken = () => Cookies.get('toolrent_token') || null;

const authClient = () => {
  const token = getToken();
  return axios.create({
    baseURL: AUTH_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const authApi = {
  /**
   * POST /register
   * Body: { email, full_name, password }
   * Returns: { id, email, full_name }
   */
  register: async ({ email, full_name, password }) => {
    const res = await axios.post(`${AUTH_URL}/register`, { email, full_name, password });
    return res.data;
  },

  /**
   * POST /login
   * Body: { email, password }
   * Returns: { access_token, token_type }
   */
  login: async ({ email, password }) => {
    const res = await axios.post(`${AUTH_URL}/login`, { email, password });
    const { access_token, token_type } = res.data;
    // Persist token in a cookie (7 days)
    Cookies.set('toolrent_token', access_token, { expires: 7, sameSite: 'strict' });
    return { access_token, token_type };
  },

  logout: () => {
    Cookies.remove('toolrent_token');
  },

  getToken,

  me: async () => {
    const client = authClient();
    const res = await client.get('/me');
    return res.data;
  },

  updateMe: async (payload) => {
    const client = authClient();
    const res = await client.put('/me', payload);
    return res.data;
  },

  deleteMe: async () => {
    const client = authClient();
    await client.delete('/me');
  },
};

// ── Tools API ───────────────────────────────────────────────────────────────

const toolsClient = () => {
  const token = authApi.getToken();
  return axios.create({
    baseURL: TOOLS_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const toolsApi = {
  /**
   * GET /tools
   * Public — returns all tools
   */
  getAll: async () => {
    const res = await axios.get(`${TOOLS_URL}/tools`);
    return res.data;
  },

  /**
   * POST /tools  (multipart/form-data)
   * Fields: title, description, price (float), file (image)
   * Requires JWT
   */
  create: async ({ title, description, price, file }) => {
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('price', price);
    form.append('file', file);

    const client = toolsClient();
    const res = await client.post('/tools', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  /**
   * GET /tools/me
   * Requires JWT
   */
  getMine: async () => {
    const client = toolsClient();
    const res = await client.get('/tools/me');
    return res.data;
  },

  /**
   * PUT /tools/:id
   * Requires JWT
   */
  update: async (id, payload) => {
    const client = toolsClient();
    const res = await client.put(`/tools/${id}`, payload);
    return res.data;
  },

  /**
   * DELETE /tools/:id
   * Requires JWT
   */
  remove: async (id) => {
    const client = toolsClient();
    await client.delete(`/tools/${id}`);
  },
};
