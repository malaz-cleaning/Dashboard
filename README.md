# Malaz Cleaning Dashboard

لوحة تحكم شركة مالاز للتنظيف - تطبيق ويب متجاوب لإدارة الطلبات والعملاء والشاليهات.

## المميزات

- 📱 **تصميم متجاوب** - يعمل على جميع الأجهزة (موبايل، تابلت، ديسكتوب)
- 🔐 **نظام مصادقة آمن** - Firebase Authentication
- 📊 **إحصائيات تفاعلية** - رسوم بيانية باستخدام Chart.js
- 🏠 **إدارة شاملة** - عملاء، شاليهات، طلبات
- 🌙 **وضع مظلم/فاتح** - تبديل بين الأوضاع
- 🔔 **إشعارات ذكية** - تذكيرات وتحديثات
- 📱 **PWA جاهز** - يمكن تثبيته كتطبيق

## التقنيات المستخدمة

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend:** Firebase Realtime Database
- **Authentication:** Firebase Auth
- **Charts:** Chart.js
- **Icons:** Lucide Static
- **Fonts:** Inter (Google Fonts)

## التثبيت والتشغيل

### 1. استنساخ المشروع
```bash
git clone https://github.com/your-username/malaz-cleaning-dashboard.git
cd malaz-cleaning-dashboard
```

### 2. إعداد Firebase
1. أنشئ مشروع جديد في [Firebase Console](https://console.firebase.google.com/)
2. فعل Authentication و Realtime Database
3. انسخ API Key من Project Settings
4. عدل `js/auth.js` واستبدل `YOUR_FIREBASE_API_KEY_HERE` بمفتاحك

### 3. إعداد قواعد البيانات
في Firebase Console → Database → Rules:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### 4. تشغيل المشروع
```bash
npx live-server --port=8080 --open=login.html
```

## الحسابات المسموح بها

التطبيق يدعم الحسابات التالية فقط:
- admin@malaz.com
- ayman@malaz.com
- abdo@malaz.com
- yousef@malaz.com

## البناء والتطوير

### متطلبات النظام
- Node.js (لـ live-server)
- متصفح حديث يدعم ES6+

### هيكل المشروع
```
malaz-cleaning-dashboard/
├── css/
│   └── styles.css          # الأنماط الرئيسية
├── js/
│   ├── auth.js            # مصادقة Firebase
│   ├── api.js             # API calls لقاعدة البيانات
│   ├── common.js          # التهيئة العامة
│   ├── components/        # مكونات UI
│   │   ├── navbar.js
│   │   ├── sidebar.js
│   │   ├── modal.js
│   │   └── toast.js
│   └── pages/             # صفحات التطبيق
│       ├── dashboard.js
│       ├── orders.js
│       ├── clients.js
│       ├── chalets.js
│       └── analytics.js
├── index.html             # الصفحة الرئيسية
├── login.html            # صفحة تسجيل الدخول
├── orders.html
├── clients.html
├── chalets.html
├── analytics.html
├── manifest.json          # PWA manifest
├── sw.js                 # Service Worker
└── offline.html          # صفحة offline
```

## الأمان

- 🔒 **مصادقة مطلوبة** - جميع الصفحات محمية
- 🚫 **لا إنشاء حسابات** - الحسابات محددة مسبقاً
- 🔑 **Firebase Security Rules** - تحمي قاعدة البيانات
- 🛡️ **HTTPS مطلوب** - للـ PWA

## المساهمة

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للـ branch (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

## الترخيص

هذا المشروع مفتوح المصدر تحت رخصة MIT.

## الدعم

للأسئلة أو المشاكل، يرجى فتح issue في GitHub.