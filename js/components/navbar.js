import { auth } from '../auth.js';
import { api } from '../api.js';
import { showToast } from './toast.js';

function formatStatusLabel(status) {
  const map = {
    pending: 'معلقة',
    in_progress: 'قيد التنفيذ',
    done_unpaid: 'تمت ولم يُدفع',
    done_paid: 'تمت ودُفع',
    cancelled: 'ملغاة',
  };
  return map[status] || status;
}

async function ensureJsPdf() {
  if (window.jspdf && window.jspdf.jsPDF) {
    return window.jspdf.jsPDF;
  }

  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load jsPDF'));
    document.head.appendChild(script);
  });

  if (!window.html2canvas) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load html2canvas'));
      document.head.appendChild(script);
    });
  }

  return window.jspdf.jsPDF;
}

async function ensureXLSX() {
  if (window.XLSX) {
    return window.XLSX;
  }

  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load XLSX'));
    document.head.appendChild(script);
  });

  return window.XLSX;
}

function buildBackupHtml({ orders, clients, chalets }) {
  const now = new Date().toLocaleString('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const orderRows = orders
    .map((order) => {
      const client = clients.find((item) => item.client_id === order.client_id) || {};
      const chalet = chalets.find((item) => item.chalet_id === order.chalet_id) || {};
      return `
        <tr>
          <td>${order.order_id}</td>
          <td>${client.name || 'غير محدد'}</td>
          <td>${chalet.chalet_name || 'غير محدد'}</td>
          <td>${formatStatusLabel(order.status)}</td>
          <td>${Number(order.price || 0).toLocaleString('ar-EG')} EGP</td>
          <td>${order.notes ? order.notes.replace(/\n/g, '<br/>') : '-'}</td>
          <td>${order.created_at}</td>
          <td>${order.completed_at || '-'}</td>
        </tr>
      `;
    })
    .join('');

  const clientRows = clients
    .map((client) => `
      <tr>
        <td>${client.client_id}</td>
        <td>${client.name}</td>
        <td>${client.phone}</td>
        <td>${client.type || '-'}</td>
      </tr>
    `)
    .join('');

  const chaletRows = chalets
    .map((chalet) => {
      const client = clients.find((item) => item.client_id === chalet.client_id) || {};
      return `
        <tr>
          <td>${chalet.chalet_id}</td>
          <td>${chalet.chalet_name}</td>
          <td>${chalet.location}</td>
          <td>${client.name || 'غير محدد'}</td>
          <td>${chalet.details || '-'}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div style="font-family: 'Inter', sans-serif; color: #0f172a; width: 100%; padding: 20px;">
      <div style="margin-bottom: 28px;">
        <h1 style="margin: 0 0 8px 0; font-size: 24px;">نسخة احتياطية كاملة</h1>
        <p style="margin: 0; color: #4b5563; font-size: 12px;">تاريخ الإنشاء: ${now}</p>
      </div>

      <section style="margin-bottom: 26px;">
        <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #111827;">الطلبات</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background: #1f2937; color: white; text-align: left;">
              <th style="padding: 10px; border: 1px solid #d1d5db;">رقم الطلب</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">العميل</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">الشاليه</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">الحالة</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">السعر</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">الملاحظات</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">تاريخ الإنشاء</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">تاريخ الإنجاز</th>
            </tr>
          </thead>
          <tbody>${orderRows}</tbody>
        </table>
      </section>

      <section style="margin-bottom: 26px;">
        <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #111827;">العملاء</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background: #1f2937; color: white; text-align: left;">
              <th style="padding: 10px; border: 1px solid #d1d5db;">معرف العميل</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">الاسم</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">الهاتف</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">النوع</th>
            </tr>
          </thead>
          <tbody>${clientRows}</tbody>
        </table>
      </section>

      <section>
        <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #111827;">الشاليهات</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background: #1f2937; color: white; text-align: left;">
              <th style="padding: 10px; border: 1px solid #d1d5db;">معرف الشاليه</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">اسم الشاليه</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">الموقع</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">العميل</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">التفاصيل</th>
            </tr>
          </thead>
          <tbody>${chaletRows}</tbody>
        </table>
      </section>
    </div>
  `;
}

async function fetchBackupData() {
  const [orders, clients, chalets] = await Promise.all([
    api.getOrders(),
    api.getClients(),
    api.getChalets(),
  ]);
  return { orders, clients, chalets };
}

async function downloadPdfBackup() {
  const button = document.getElementById('download-backup-pdf');
  if (button) button.disabled = true;

  try {
    const data = await fetchBackupData();
    const jsPDFConstructor = await ensureJsPdf();
    const doc = new jsPDFConstructor({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const container = document.createElement('div');
    container.style.width = '1100px';
    container.style.padding = '20px';
    container.style.direction = 'rtl';
    container.style.textAlign = 'right';
    container.innerHTML = buildBackupHtml(data);
    container.style.fontFamily = 'Inter, sans-serif';
    container.style.background = '#ffffff';
    container.style.color = '#111827';
    container.style.lineHeight = '1.4';
    container.style.boxSizing = 'border-box';
    container.style.maxWidth = '1100px';
    container.style.margin = '0 auto';
    container.style.fontSize = '11px';

    document.body.appendChild(container);
    await doc.html(container, {
      callback: () => {
        const date = new Date().toISOString().slice(0, 10);
        doc.save(`backup-malaz-${date}.pdf`);
        container.remove();
      },
      x: 20,
      y: 20,
      html2canvas: {
        scale: 1.4,
        useCORS: true,
      },
      windowWidth: 1100,
    });
  } catch (error) {
    console.error(error);
    showToast('error', 'حدث خطأ أثناء إنشاء نسخة PDF. حاول مرة أخرى.');
  } finally {
    if (button) button.disabled = false;
  }
}

async function downloadExcelBackup() {
  const button = document.getElementById('download-backup-xlsx');
  if (button) button.disabled = true;

  try {
    const XLSX = await ensureXLSX();
    const data = await fetchBackupData();

    const orderRows = data.orders.map((order) => {
      const client = data.clients.find((item) => item.client_id === order.client_id) || {};
      const chalet = data.chalets.find((item) => item.chalet_id === order.chalet_id) || {};
      return {
        'رقم الطلب': order.order_id,
        'العميل': client.name || 'غير محدد',
        'الشاليه': chalet.chalet_name || 'غير محدد',
        'الحالة': formatStatusLabel(order.status),
        'السعر (EGP)': Number(order.price || 0),
        'الملاحظات': order.notes || '-',
        'تاريخ الإنشاء': order.created_at,
        'تاريخ الإنجاز': order.completed_at || '-',
      };
    });

    const clientRows = data.clients.map((client) => ({
      'معرف العميل': client.client_id,
      'الاسم': client.name,
      'الهاتف': client.phone,
      'النوع': client.type || '-',
    }));

    const chaletRows = data.chalets.map((chalet) => {
      const client = data.clients.find((item) => item.client_id === chalet.client_id) || {};
      return {
        'معرف الشاليه': chalet.chalet_id,
        'اسم الشاليه': chalet.chalet_name,
        'الموقع': chalet.location,
        'العميل': client.name || 'غير محدد',
        'التفاصيل': chalet.details || '-',
      };
    });

    const wb = XLSX.utils.book_new();
    const ordersSheet = XLSX.utils.json_to_sheet(orderRows);
    const clientsSheet = XLSX.utils.json_to_sheet(clientRows);
    const chaletsSheet = XLSX.utils.json_to_sheet(chaletRows);

    ordersSheet['!cols'] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 20 },
      { wch: 18 },
      { wch: 12 },
      { wch: 30 },
      { wch: 14 },
      { wch: 14 },
    ];
    clientsSheet['!cols'] = [{ wch: 14 }, { wch: 20 }, { wch: 18 }, { wch: 14 }];
    chaletsSheet['!cols'] = [{ wch: 14 }, { wch: 20 }, { wch: 18 }, { wch: 20 }, { wch: 30 }];

    XLSX.utils.book_append_sheet(wb, ordersSheet, 'الطلبات');
    XLSX.utils.book_append_sheet(wb, clientsSheet, 'العملاء');
    XLSX.utils.book_append_sheet(wb, chaletsSheet, 'الشاليهات');

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `backup-malaz-${date}.xlsx`);
  } catch (error) {
    console.error(error);
    showToast('error', 'حدث خطأ أثناء إنشاء ملف Excel. حاول مرة أخرى.');
  } finally {
    if (button) button.disabled = false;
  }
}

export function renderNavbar(root) {
  if (!root) return;
  root.innerHTML = `
    <div class="navbar-inner">
      <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle menu">☰</button>
      <div class="navbar-title">
        <span>لوحة إدارة ملاذ</span>
      </div>
      <div class="navbar-actions">
        <button class="quick-action download-button" id="download-backup-pdf">PDF</button>
        <button class="quick-action download-button" id="download-backup-xlsx">Excel</button>
        <button class="quick-action" id="logout-button">خروج</button>
      </div>
    </div>
  `;

  document.getElementById('logout-button')?.addEventListener('click', () => {
    auth.logout();
  });
  document.getElementById('download-backup-pdf')?.addEventListener('click', downloadPdfBackup);
  document.getElementById('download-backup-xlsx')?.addEventListener('click', downloadExcelBackup);
}

function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);
  return page === '' ? 'index.html' : page;
}
