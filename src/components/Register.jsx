import { useState, useTransition, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmId = useId();

  // Password strength calculation
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password)
  ].filter(Boolean).length;

  const strengthColor =
    score <= 1 ? 'var(--accent-red)' : score === 2 ? 'var(--accent-gold)' : 'var(--accent-green)';
  const strengthWidth = `${(score / 4) * 100}%`;

  const handleFillSample = () => {
    const id = Math.floor(Math.random() * 899) + 100;
    setName('Jordan Hayes');
    setEmail(`jordan.hayes${id}@example.com`);
    setPassword(`Password${id}!`);
    setConfirmPassword(`Password${id}!`);
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Valid email address is required.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    startTransition(() => {
      try {
        register(name, email, password);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setErrorMessage(err.message || 'Registration failed.');
      }
    });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <header className="auth-header">
          <div className="auth-top-bar">
            <span className="auth-brand-tag">user_dashboard</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '○ Light' : '● Dark'}
            </button>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Enter details to establish membership</p>
        </header>

        {errorMessage && (
          <div className="error-banner" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-item">
            <label htmlFor={nameId} className="form-label">
              Full Name
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Hayes…"
              autoComplete="name"
              required
              className="form-input"
            />
          </div>

          <div className="form-item">
            <label htmlFor={emailId} className="form-label">
              Work Email
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@example.com…"
              autoComplete="email"
              spellCheck={false}
              required
              className="form-input"
            />
          </div>

          <div className="form-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor={passwordId} className="form-label">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id={passwordId}
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters…"
              autoComplete="new-password"
              required
              className="form-input"
            />
            {password.length > 0 && (
              <div className="strength-track">
                <div
                  className="strength-thumb"
                  style={{ width: strengthWidth, backgroundColor: strengthColor }}
                />
              </div>
            )}
          </div>

          <div className="form-item">
            <label htmlFor={confirmId} className="form-label">
              Confirm Password
            </label>
            <input
              id={confirmId}
              name="confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password…"
              autoComplete="new-password"
              required
              className="form-input"
            />
          </div>

          <button
            type="submit"
            className="btn btn-solid-white"
            style={{ width: '100%', marginTop: '6px' }}
            disabled={isPending}
          >
            {isPending ? 'Registering…' : 'Register Account'}
          </button>

          <div className="quick-bar">
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quick Testing</span>
            <button
              type="button"
              onClick={handleFillSample}
              className="btn btn-outline"
              style={{ height: '24px', padding: '0 8px', fontSize: '11px' }}
            >
              Fill Sample
            </button>
          </div>
        </form>

        <footer style={{ marginTop: '16px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
          Existing user?{' '}
          <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>
            Sign In
          </Link>
        </footer>
      </div>
    </div>
  );
}
