import { auth } from '../auth.js';
import { showToast } from '../components/toast.js';

// Redirect if already authenticated
document.addEventListener('DOMContentLoaded', () => {
  if (auth.isAuthenticated()) {
    window.location.href = 'index.html';
  }
});

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!email || !password) {
    showError('الرجاء تعبئة جميع الحقول');
    return;
  }

  if (password.length < 6) {
    showError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.classList.add('loading');
  button.disabled = true;
  button.textContent = 'جاري الدخول...';

  try {
    const result = await auth.login(email, password);
    auth.setToken(result.idToken);
    auth.updateUserData(email);
    showToast('success', 'تم تسجيل الدخول بنجاح');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    showToast('error', error.message);
  } finally {
    button.classList.remove('loading');
    button.disabled = false;
    button.textContent = 'دخول';
  }
});

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  errorMessage.classList.add('show');
  setTimeout(() => {
    errorMessage.classList.remove('show');
    errorMessage.classList.add('hidden');
  }, 5000);
}
