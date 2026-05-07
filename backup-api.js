import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';
import admin from 'firebase-admin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load Google Service Account
const serviceAccountKey = JSON.parse(fs.readFileSync(path.join(__dirname, 'google-service-key.json'), 'utf8'));

// Initialize Google Auth
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });
const BACKUP_FOLDER_ID = process.env.GOOGLE_DRIVE_BACKUP_FOLDER_ID || '1p-MDHWFURtie1qgR4bNlr5-5HKk0PO0Z';

// Initialize Firebase Admin (for accessing Firestore)
const serviceAccount = serviceAccountKey;
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

/**
 * Fetch backup data from Firestore
 */
async function fetchBackupData() {
  try {
    const ordersSnap = await db.collection('orders').get();
    const clientsSnap = await db.collection('clients').get();
    const chaletsSnap = await db.collection('chalets').get();

    const orders = ordersSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const clients = clientsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const chalets = chaletsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    return { orders, clients, chalets };
  } catch (error) {
    console.error('Error fetching backup data:', error);
    throw error;
  }
}

/**
 * Create Excel backup file
 */
function createExcelBackup(data) {
  const wb = XLSX.utils.book_new();

  // Orders sheet
  if (data.orders.length > 0) {
    const ordersData = data.orders.map((order) => ({
      'رقم الطلب': order.order_id || order.id,
      'العميل': order.client_name || 'غير محدد',
      'الشاليه': order.chalet_name || 'غير محدد',
      'الحالة': order.status,
      'السعر (EGP)': order.price || 0,
      'الملاحظات': order.notes || '-',
      'تاريخ الإنشاء': order.created_at,
      'تاريخ الإنجاز': order.completed_at || '-',
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ordersData), 'الطلبات');
  }

  // Clients sheet
  if (data.clients.length > 0) {
    const clientsData = data.clients.map((client) => ({
      'معرف العميل': client.client_id || client.id,
      'الاسم': client.name,
      'الهاتف': client.phone,
      'النوع': client.type || '-',
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(clientsData), 'العملاء');
  }

  // Chalets sheet
  if (data.chalets.length > 0) {
    const chaletsData = data.chalets.map((chalet) => ({
      'معرف الشاليه': chalet.chalet_id || chalet.id,
      'اسم الشاليه': chalet.chalet_name,
      'الموقع': chalet.location,
      'العميل': chalet.client_name || 'غير محدد',
      'التفاصيل': chalet.details || '-',
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(chaletsData), 'الشاليهات');
  }

  return wb;
}

/**
 * Upload backup file to Google Drive
 */
async function uploadToGoogleDrive(filePath, fileName) {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [BACKUP_FOLDER_ID],
    };

    const media = {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      body: fs.createReadStream(filePath),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink',
    });

    console.log(`✅ File uploaded: ${file.data.name}`);
    return file.data;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}

/**
 * POST /api/backup/manual - Manual backup trigger
 */
app.post('/api/backup/manual', async (req, res) => {
  const timestamp = new Date().toISOString().slice(0, 10);
  const fileName = `backup-malaz-${timestamp}.xlsx`;
  const filePath = path.join(__dirname, 'backups', fileName);

  try {
    // Ensure backups directory exists
    const backupsDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Fetch data
    const data = await fetchBackupData();

    // Create Excel file
    const wb = createExcelBackup(data);
    XLSX.writeFile(wb, filePath);

    // Upload to Google Drive
    const uploadResult = await uploadToGoogleDrive(filePath, fileName);

    res.json({
      success: true,
      message: 'Backup created and uploaded successfully',
      file: uploadResult,
    });
  } catch (error) {
    console.error('Backup failed:', error);
    res.status(500).json({
      success: false,
      message: 'Backup failed',
      error: error.message,
    });
  }
});

/**
 * GET /api/backup/status - Get backup status
 */
app.get('/api/backup/status', async (req, res) => {
  try {
    const backupsDir = path.join(__dirname, 'backups');
    let files = [];

    if (fs.existsSync(backupsDir)) {
      files = fs.readdirSync(backupsDir).map((file) => {
        const filePath = path.join(backupsDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          date: stats.mtime,
        };
      });
    }

    res.json({
      success: true,
      lastBackup: files.length > 0 ? files[files.length - 1] : null,
      totalBackups: files.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get backup status',
      error: error.message,
    });
  }
});

const PORT = process.env.BACKUP_PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backup API server running on port ${PORT}`);
});
