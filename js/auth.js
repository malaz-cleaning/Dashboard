import { firebaseAuth } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const ALLOWED_EMAILS = new Set([
  'admin@malaz.com',
  'ayman@malaz.com',
  'abdo@malaz.com',
  'yousef@malaz.com'
]);

async function firebaseSignUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    return {
      idToken: await userCredential.user.getIdToken(),
      email: userCredential.user.email,
    };
  } catch (error) {
    return { error: { message: error.message } };
  }
}

async function firebaseSignIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return {
      idToken: await userCredential.user.getIdToken(),
      email: userCredential.user.email,
    };
  } catch (error) {
    return { error: { message: error.message } };
  }
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
        if (signInResult.error.message.includes('user-not-found')) {
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
    signOut(firebaseAuth).catch(error => console.error('Logout error:', error));
    window.location.href = 'login.html';
  },
};
