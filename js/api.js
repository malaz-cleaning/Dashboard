import { auth } from './auth.js';
const FIREBASE_PROJECT_ID = 'malaz-cleaning';
const FIREBASE_DATABASE_URL = `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`;

const cache = {
  clients: null,
  chalets: null,
  orders: null,
};

async function firebaseRequest(path, method = 'GET', data = null) {
  try {
    const token = auth.getToken();
    let url = `${FIREBASE_DATABASE_URL}${path}.json`;

    // Add auth token as query parameter for Firebase
    if (token) {
      url += `?auth=${token}`;
    }

    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        auth.logout();
        throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
      }
      throw new Error(`Firebase error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Firebase Error:', error);
    throw error;
  }
}

async function fetchResource(resource) {
  if (cache[resource]) {
    return cache[resource];
  }
  const data = await firebaseRequest(`/${resource}`);
  if (!data) {
    cache[resource] = [];
    return [];
  }
  // Filter out deleted items (soft delete)
  cache[resource] = Object.values(data).filter(item => !item.is_deleted);
  return cache[resource];
}

function invalidateCache(...resources) {
  resources.forEach((resource) => {
    if (cache[resource] !== undefined) {
      cache[resource] = null;
    }
  });
}

export const api = {
  async getClients() {
    return fetchResource('clients');
  },
  async getChalets() {
    return fetchResource('chalets');
  },
  async getOrders() {
    return fetchResource('orders');
  },
  async addClient({ type, name, phone }) {
    const clients = await fetchResource('clients');
    const client_id = `CL${String(clients.length + 1).padStart(3, '0')}`;
    const payload = {
      client_id,
      type,
      name,
      phone,
      created_at: new Date().toISOString().split('T')[0],
      is_deleted: false,
    };
    await firebaseRequest(`/clients/${client_id}`, 'PUT', payload);
    invalidateCache('clients');
    return payload;
  },
  async addChalet({ client_id, chalet_name, location, details }) {
    const chalets = await fetchResource('chalets');
    const chalet_id = `CH${String(chalets.length + 1).padStart(3, '0')}`;
    const payload = {
      chalet_id,
      chalet_code: chalet_id,
      client_id,
      chalet_name,
      location,
      details,
      created_at: new Date().toISOString().split('T')[0],
      is_deleted: false,
    };
    await firebaseRequest(`/chalets/${chalet_id}`, 'PUT', payload);
    invalidateCache('chalets');
    return payload;
  },
  async addOrder({ client_id, chalet_id, status, price, notes, created_at }) {
    const orders = await fetchResource('orders');
    const order_id = `OR${String(orders.length + 1).padStart(3, '0')}`;
    const payload = {
      order_id,
      client_id,
      chalet_id,
      status,
      price: Number(price),
      notes,
      created_at,
      completed_at: status.includes('done') ? created_at : '',
      is_deleted: false,
    };
    await firebaseRequest(`/orders/${order_id}`, 'PUT', payload);
    invalidateCache('orders');
    return payload;
  },
  async updateClient(client_id, payload) {
    await firebaseRequest(`/clients/${client_id}`, 'PATCH', payload);
    invalidateCache('clients');
    const clients = await fetchResource('clients');
    return clients.find((c) => c.client_id === client_id);
  },
  async updateChalet(chalet_id, payload) {
    await firebaseRequest(`/chalets/${chalet_id}`, 'PATCH', payload);
    invalidateCache('chalets');
    const chalets = await fetchResource('chalets');
    return chalets.find((c) => c.chalet_id === chalet_id);
  },
  async updateOrder(order_id, payload) {
    await firebaseRequest(`/orders/${order_id}`, 'PATCH', payload);
    invalidateCache('orders');
    const orders = await fetchResource('orders');
    return orders.find((o) => o.order_id === order_id);
  },
  async deleteClient(client_id) {
    const result = await firebaseRequest(`/clients/${client_id}`, 'PATCH', { is_deleted: true });
    invalidateCache('clients');
    return result;
  },
  async deleteChalet(chalet_id) {
    const result = await firebaseRequest(`/chalets/${chalet_id}`, 'PATCH', { is_deleted: true });
    invalidateCache('chalets');
    return result;
  },
  async deleteOrder(order_id) {
    const result = await firebaseRequest(`/orders/${order_id}`, 'PATCH', { is_deleted: true });
    invalidateCache('orders');
    return result;
  },
};
