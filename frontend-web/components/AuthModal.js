import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './AuthModal.module.css';

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', full_name: '', password: '' });
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
        toast.success('Welcome back!');
        onClose();
      } else {
        await register({ email: form.email, full_name: form.full_name, password: form.password });
        toast.success('Account created! Please sign in.');
        onSwitch('login');
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Something went wrong. Please try again.';
      setError(Array.isArray(msg) ? msg.map((m) => m.msg).join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.header}>
          <div className={styles.headerIcon}>🔨</div>
          <h2 className={styles.title}>
            {mode === 'login' ? 'Welcome back' : 'Join ToolRent'}
          </h2>
          <p className={styles.subtitle}>
            {mode === 'login'
              ? 'Sign in to rent or list tools near you'
              : 'Create your account to get started'}
          </p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
            onClick={() => onSwitch('login')}
          >
            Sign in
          </button>
          <button
            className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
            onClick={() => onSwitch('register')}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'register' && (
            <div className={styles.field}>
              <label className={styles.label}>Full name</label>
              <input
                className={styles.input}
                type="text"
                placeholder="Your full name"
                value={form.full_name}
                onChange={set('full_name')}
                required
                minLength={2}
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email address</label>
            <input
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
              value={form.password}
              onChange={set('password')}
              required
              minLength={mode === 'register' ? 8 : 1}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? (
              <span className={styles.spinner} />
            ) : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className={styles.footer}>
          Secured with JWT · OAuth2 · Your data stays private
        </p>
      </div>
    </div>
  );
}
