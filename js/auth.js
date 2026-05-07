const FIREBASE_API_KEY = 'YOUR_FIREBASE_API_KEY_HERE'; // Replace with your actual Firebase API key
const FIREBASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts';

const ALLOWED_EMAILS = new Set([
  'admin@malaz.com',
  'ayman@malaz.com',
  'abdo@malaz.com',
  'yousef@malaz.com'
]);

async function firebaseSignUp(email, password) {
  const response = await fetch(`${FIREBASE_AUTH_URL}:signUp?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });
  return response.json();
}

async function firebaseSignIn(email, password) {
  const response = await fetch(`${FIREBASE_AUTH_URL}:signInWithPassword?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });
  return response.json();
}

export const auth = {
  async signup() {
    throw new Error('إنشاء حساب جديد غير مسموح');
  },

  async login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!ALLOWED_EMAILS.has(normalizedEmail)) {
      throw new Error('هذا الحساب غير مسموح بالدخول');
    }

    try {
      const signInResult = await firebaseSignIn(normalizedEmail, password);
      if (signInResult.error) {
        if (signInResult.error.message === 'EMAIL_NOT_FOUND') {
          // Create the allowed account in Firebase if it does not exist yet.
          const signUpResult = await firebaseSignUp(normalizedEmail, password);
          if (signUpResult.error) {
            throw new Error(signUpResult.error.message || 'خطأ في إنشاء الحساب');
          }
          return { idToken: signUpResult.idToken, email: signUpResult.email };
        }
        throw new Error(signInResult.error.message || 'خطأ في تسجيل الدخول');
      }
      return { idToken: signInResult.idToken, email: signInResult.email };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  setToken(token) {
    localStorage.setItem('authToken', token);
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  logout() {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
  },
};
