import cron from 'node-cron';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load Google Service Account Key
const serviceAccountKey = JSON.parse(fs.readFileSync(path.join(__dirname, 'google-service-key.json'), 'utf8'));

// Initialize Google Auth
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });
const BACKUP_FOLDER_ID = process.env.GOOGLE_DRIVE_BACKUP_FOLDER_ID || '1p-MDHWFURtie1qgR4bNlr5-5HKk0PO0Z';

/**
 * Fetch backup data from API
 */
async function fetchBackupData() {
  try {
    // This assumes your API endpoints are available
    // Adjust URLs based on your actual API setup
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:5173';
    
    // For this example, we'll use mock data
    // In production, you'd call your actual API endpoints
    return {
      orders: [],
      clients: [],
      chalets: [],
    };
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
      'رقم الطلب': order.order_id,
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
      'معرف العميل': client.client_id,
      'الاسم': client.name,
      'الهاتف': client.phone,
      'النوع': client.type || '-',
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(clientsData), 'العملاء');
  }
  
  // Chalets sheet
  if (data.chalets.length > 0) {
    const chaletsData = data.chalets.map((chalet) => ({
      'معرف الشاليه': chalet.chalet_id,
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

    console.log(`✅ File uploaded successfully: ${file.data.name} (ID: ${file.data.id})`);
    console.log(`📎 Link: ${file.data.webViewLink}`);
    
    return file.data;
  } catch (error) {
    console.error('❌ Error uploading to Google Drive:', error);
    throw error;
  }
}

/**
 * Perform backup operation
 */
async function performBackup() {
  const timestamp = new Date().toISOString().slice(0, 10);
  const fileName = `backup-malaz-${timestamp}.xlsx`;
  const filePath = path.join(__dirname, 'backups', fileName);

  try {
    console.log(`\n🔄 Starting backup at ${new Date().toLocaleString('ar-EG')}`);

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
    console.log(`✅ Local backup created: ${filePath}`);

    // Upload to Google Drive
    await uploadToGoogleDrive(filePath, fileName);

    console.log(`✅ Backup completed successfully!\n`);
  } catch (error) {
    console.error('❌ Backup failed:', error);
  }
}

/**
 * Schedule backup every 8 hours
 * Cron pattern: "0 */8 * * *" = every 8 hours at minute 0
 */
function scheduleBackup() {
  console.log('📅 Backup scheduler started');
  console.log('⏰ Scheduled to run every 8 hours\n');

  // Run immediately on startup
  performBackup();

  // Schedule for every 8 hours
  cron.schedule('0 */8 * * *', () => {
    performBackup();
  });
}

// Start the scheduler
scheduleBackup();

console.log('🚀 Backup service is running...');
