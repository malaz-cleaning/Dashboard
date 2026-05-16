export const state = {
  clients: [],
  chalets: [],
  orders: [],
};

export function initializeState() {
  state.clients = [
    { client_id: 'CL001', type: 'owner', name: 'owner', phone: '0551234567', created_at: '2026-05-07', is_deleted: false },
    { client_id: 'CL002', type: 'broker', name: 'broker النخبة', phone: '0559876543', created_at: '2026-04-22', is_deleted: false },
    { client_id: 'CL003', type: 'owner', name: 'عائشة للضيافة', phone: '0551112233', created_at: '2026-03-15', is_deleted: false },
  ];
  state.chalets = [
    { chalet_id: 'CH001', chalet_code: 'CH001', client_id: 'CL001', chalet_name: 'شاليه البحيرة', location: 'الرياض', details: 'شاليه فخم 3 غرف', created_at: '2026-05-07', is_deleted: false },
    { chalet_id: 'CH002', chalet_code: 'CH002', client_id: 'CL002', chalet_name: 'شاليه النخبة', location: 'جدة', details: 'دور أرضي مع مسبح', created_at: '2026-04-28', is_deleted: false },
    { chalet_id: 'CH003', chalet_code: 'CH003', client_id: 'CL003', chalet_name: 'فيلا الوادي', location: 'الخبر', details: 'فيلا كبيرة 5 غرف', created_at: '2026-03-18', is_deleted: false },
  ];
  state.orders = [
    { order_id: 'OR001', client_id: 'CL001', chalet_id: 'CH001', status: 'pending', price: 420, notes: 'تنظيف شامل', created_at: '2026-05-07', scheduled_at: '', deposit: 0, created_by: 'admin', completed_at: '', is_deleted: false },
    { order_id: 'OR002', client_id: 'CL002', chalet_id: 'CH002', status: 'in_progress', price: 600, notes: 'تنظيف بعد احتفال', created_at: '2026-05-03', scheduled_at: '', deposit: 0, created_by: 'admin', completed_at: '', is_deleted: false },
    { order_id: 'OR003', client_id: 'CL003', chalet_id: 'CH003', status: 'done_paid', price: 1250, notes: 'تنظيف شامل مع تعقيم', created_at: '2026-04-30', scheduled_at: '2026-04-30', deposit: 0, created_by: 'admin', completed_at: '2026-04-30', is_deleted: false },
    { order_id: 'OR004', client_id: 'CL001', chalet_id: 'CH001', status: 'done_unpaid', price: 320, notes: 'تنظيف سريع', created_at: '2026-04-18', scheduled_at: '2026-04-18', deposit: 0, created_by: 'admin', completed_at: '2026-04-18', is_deleted: false },
    { order_id: 'OR005', client_id: 'CL002', chalet_id: 'CH002', status: 'cancelled', price: 0, notes: 'تم إلغاء الطلب', created_at: '2026-05-01', scheduled_at: '', deposit: 0, created_by: 'admin', completed_at: '', is_deleted: false },
  ];
};
