# نظام النسخ الاحتياطية التلقائي

## الميزات
✅ **نسخ احتياطية تلقائية كل 8 ساعات**  
✅ **تحميل مباشر إلى Google Drive**  
✅ **أزرار يدوية في لوحة التحكم**  
✅ **ملفات Excel منسقة وسهلة الاستخدام**  

## المكونات

### 1. **backup-api.js** - خادم API للـ Backup اليدوي
```bash
npm run backup:api
```
- يشغّل على المنفذ `3001`
- يوفر endpoint لإنشاء backup يدوي
- يتعامل مع البيانات من Firestore
- يرفع الملفات إلى Google Drive

### 2. **backup-server.js** - جدول الـ Backup التلقائي
```bash
npm run backup:scheduler
```
- جدول Cron كل 8 ساعات
- ينفذ `performBackup()` تلقائياً
- يحفظ ملفات محلية بتاريخ اليوم

### 3. **google-service-key.json** - مفاتيح Google API
- ملف آمن يحتوي على Service Account credentials
- **لا تشاركه أو تضعه على GitHub**

## طريقة الاستخدام

### الخيار 1️⃣: تشغيل كل شيء معاً
```bash
npm run backup:all
```
هذا الأمر يشغل:
- الـ Vite dev server على `http://localhost:5173`
- API server على `http://localhost:3001`
- Scheduler للـ backup التلقائي

### الخيار 2️⃣: تشغيل منفصل
```bash
# ترمينال 1 - الـ dev server
npm run dev

# ترمينال 2 - API server
npm run backup:api

# ترمينال 3 - Scheduler (اختياري للـ local development)
npm run backup:scheduler
```

## API Endpoints

### 1. تشغيل Backup يدوي
```
POST http://localhost:3001/api/backup/manual
```
**الرد:**
```json
{
  "success": true,
  "message": "Backup created and uploaded successfully",
  "file": {
    "id": "...",
    "name": "backup-malaz-2024-05-07.xlsx",
    "webViewLink": "https://drive.google.com/file/d/..."
  }
}
```

### 2. الحصول على حالة الـ Backup
```
GET http://localhost:3001/api/backup/status
```
**الرد:**
```json
{
  "success": true,
  "lastBackup": {
    "name": "backup-malaz-2024-05-07.xlsx",
    "size": 12345,
    "date": "2024-05-07T12:30:00.000Z"
  },
  "totalBackups": 5
}
```

## الأزرار في الـ Dashboard

### زر "تحميل Excel"
- موجود في الـ navbar الرئيسي
- يستدعي API endpoint للـ backup
- يحفظ الملف على Google Drive مباشرة
- يعرض رسالة نجاح عند الانتهاء

## بيانات الـ Backup
كل backup يحتوي على:
- ✅ جدول الطلبات (orders)
- ✅ جدول العملاء (clients)
- ✅ جدول الشاليهات (chalets)

## ملفات التخزين
```
D:\Malaz-Cleaning2\
├── backups/               # المجلد المحلي للـ backups
│   ├── backup-malaz-2024-05-07.xlsx
│   ├── backup-malaz-2024-05-06.xlsx
│   └── ...
├── google-service-key.json  # مفاتيح Google (حماية ⚠️)
├── backup-api.js           # خادم API
└── backup-server.js        # Scheduler التلقائي
```

## جدول التشغيل التلقائي
| الوقت | العملية |
|------|--------|
| 00:00 | Backup اليومي الأول |
| 08:00 | Backup كل 8 ساعات |
| 16:00 | Backup في المساء |

## الأمان ⚠️

### ❌ لا تفعل
- لا تشارك ملف `google-service-key.json`
- لا تضعه على GitHub بدون إخفاء
- لا تكشف المفتاح الخاص في أي مكان

### ✅ أفضل الممارسات
- احفظ المفتاح في مجلد محلي فقط
- استخدم `.gitignore` لإخفاء الملف:
```
google-service-key.json
backups/
.env
```

## استكشاف الأخطاء

### ❌ خطأ: "Connection refused on port 3001"
```bash
# التحقق من أن API server يعمل
npm run backup:api
```

### ❌ خطأ: "Google Drive upload failed"
- تأكد من أن Service Account credentials صحيحة
- تأكد من تفعيل Google Drive API في Google Cloud

### ❌ خطأ: "Firestore connection failed"
- تأكد من أن Firebase متصل بشكل صحيح
- تحقق من firebase.js وأن المشروع معرّف

## البيئات المختلفة

### Local Development
```bash
npm run backup:all
```

### Production (في الخادم)
- استخدم process manager مثل PM2:
```bash
pm2 start backup-api.js --name "backup-api"
pm2 start backup-server.js --name "backup-scheduler"
pm2 save
```

- أو استخدم Docker للـ containerization

## المتطلبات
- Node.js v18+
- npm 9+
- Google Cloud Account
- Firebase Project

## الملاحظات
- الـ backups تُحفظ محلياً **و** على Google Drive
- كل backup يشمل timestamp تاريخ اليوم
- الـ API يعمل على منفذ منفصل عن الـ dev server
