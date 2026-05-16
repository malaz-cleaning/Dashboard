import { auth } from './auth.js';
import { state } from './state.js';
const FIREBASE_PROJECT_ID = 'malaz-cleaning';
const FIREBASE_DATABASE_URL = `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`;

const cache = {
  clients: null,
  chalets: null,
  orders: null,
  transactions: null,
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
  try {
    const data = await firebaseRequest(`/${resource}`);
    if (!data) {
      cache[resource] = [];
      return [];
    }
    // Filter out deleted items (soft delete)
    cache[resource] = Object.values(data).filter(item => !item.is_deleted);
    return cache[resource];
  } catch (error) {
    console.warn(`Failed to fetch ${resource} from Firebase, using local state:`, error);
    // Fallback to local state
    cache[resource] = state[resource] || [];
    return cache[resource];
  }
}

function invalidateCache(...resources) {
  resources.forEach((resource) => {
    if (cache[resource] !== undefined) {
      cache[resource] = null;
    }
  });
}

async function fetchResourceRaw(resource) {
  try {
    const data = await firebaseRequest(`/${resource}`);
    return data || {};
  } catch (error) {
    console.warn(`Failed to fetch raw ${resource} from Firebase:`, error);
    return {};
  }
}

function getNextResourceId(rawData, prefix, padLength = 3) {
  const ids = Object.keys(rawData || {}).filter((id) => typeof id === 'string');
  const maxIndex = ids.reduce((max, id) => {
    if (!id.startsWith(prefix)) return max;
    const value = parseInt(id.slice(prefix.length), 10);
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `${prefix}${String(maxIndex + 1).padStart(padLength, '0')}`;
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
  async addOrder({ client_id, chalet_id, status, price, notes, created_at, scheduled_at = '', deposit = 0, created_by = '' }) {
    const rawOrders = await fetchResourceRaw('orders');
    const order_id = getNextResourceId(rawOrders, 'OR', 3);
    const payload = {
      order_id,
      client_id,
      chalet_id,
      status,
      price: Number(price),
      notes,
      created_at,
      scheduled_at: scheduled_at || '',
      deposit: Number(deposit || 0),
      created_by: created_by || '',
      completed_at: status.includes('done') ? created_at : '',
      is_deleted: false,
    };
    await firebaseRequest(`/orders/${order_id}`, 'PUT', payload);
    invalidateCache('orders');
    try {
      if (payload.deposit > 0) {
        await this.addTransaction({
          type: 'income',
          amount: Number(payload.deposit),
          date: payload.created_at,
          details: `دفعة مقدمة من الطلب ${order_id}`,
          order_id,
          created_by: payload.created_by || '',
        });
      }

      if (payload.status === 'done_paid') {
        const remaining = Number(payload.price || 0) - Number(payload.deposit || 0);
        if (remaining > 0) {
          await this.addTransaction({
            type: 'income',
            amount: remaining,
            date: payload.created_at,
            details: `باقي الدفع من الطلب ${order_id}`,
            order_id,
            created_by: payload.created_by || '',
          });
        }
      }
    } catch (err) {
      console.error('Failed to create income transaction for order:', err);
    }
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
    // Get existing order to detect status change
    const existingOrders = await fetchResource('orders');
    const existing = existingOrders.find((o) => o.order_id === order_id) || {};

    // If status is being updated, automatically set completed_at for completed statuses
    if (payload.status) {
      const currentDate = new Date().toISOString().split('T')[0];
      if (payload.status === 'done_paid' || payload.status === 'done_unpaid' || payload.status === 'cancelled') {
        payload.completed_at = currentDate;
      } else if (payload.status === 'pending' || payload.status === 'in_progress') {
        // Clear completed_at for non-completed statuses
        payload.completed_at = '';
      }
    }

    await firebaseRequest(`/orders/${order_id}`, 'PATCH', payload);
    invalidateCache('orders');
    const orders = await fetchResource('orders');
    const updated = orders.find((o) => o.order_id === order_id);

    try {
      const prevStatus = existing.status;
      const newStatus = payload.status || updated?.status;
      const price = Number(payload.price ?? updated?.price ?? 0);
      const deposit = Number(payload.deposit ?? updated?.deposit ?? 0);
      const allTransactions = await this.getTransactions();
      const orderIncomes = allTransactions
        .filter((t) => !t.is_deleted && t.order_id === order_id && t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      if (deposit > 0 && deposit > Number(existing.deposit || 0)) {
        const depositDiff = deposit - Number(existing.deposit || 0);
        if (depositDiff > 0) {
          await this.addTransaction({
            type: 'income',
            amount: depositDiff,
            date: new Date().toISOString().split('T')[0],
            details: `زيادة الدفعة من الطلب ${order_id}`,
            order_id,
            created_by: payload.created_by || updated?.created_by || '',
          });
        }
      }

      if (prevStatus !== 'done_paid' && newStatus === 'done_paid') {
        const freshTransactions = await this.getTransactions();
        const freshIncome = freshTransactions
          .filter((t) => !t.is_deleted && t.order_id === order_id && t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);
        const remaining = price - freshIncome;
        if (remaining > 0) {
          const createdBy = payload.created_by || updated?.created_by || '';
          await this.addTransaction({
            type: 'income',
            amount: remaining,
            date: new Date().toISOString().split('T')[0],
            details: `باقي الدفع من الطلب ${order_id}`,
            order_id,
            created_by: createdBy,
          });
        }
      }
    } catch (err) {
      console.error('Failed to create income transaction for updated order:', err);
    }

    return updated;
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
  // Transactions resource for simple accounting
  async getTransactions() {
    return fetchResource('transactions');
  },
  async addTransaction({ type, amount, date, details = '', order_id = '', created_by = '' }) {
    const rawTransactions = await fetchResourceRaw('transactions');
    const transaction_id = getNextResourceId(rawTransactions, 'TR', 4);
    const payload = {
      transaction_id,
      type,
      amount: Number(amount || 0),
      date: date || new Date().toISOString().split('T')[0],
      details: details || '',
      order_id: order_id || '',
      created_by: created_by || '',
      created_at: new Date().toISOString(),
      is_deleted: false,
    };
    await firebaseRequest(`/transactions/${transaction_id}`, 'PUT', payload);
    invalidateCache('transactions');
    return payload;
  },
  async updateTransaction(transaction_id, payload) {
    await firebaseRequest(`/transactions/${transaction_id}`, 'PATCH', payload);
    invalidateCache('transactions');
    const transactions = await fetchResource('transactions');
    return transactions.find((t) => t.transaction_id === transaction_id);
  },
  async deleteTransaction(transaction_id) {
    const result = await firebaseRequest(`/transactions/${transaction_id}`, 'PATCH', { is_deleted: true });
    invalidateCache('transactions');
    return result;
  },
};
