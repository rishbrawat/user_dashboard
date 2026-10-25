import { useState, useTransition, useId } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, demoCredentials } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const emailId = useId();
  const passwordId = useId();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleFillDemo = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Email address is required.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    startTransition(() => {
      try {
        login(email, password);
        navigate(from, { replace: true });
      } catch (err) {
        setErrorMessage(err.message || 'Invalid credentials.');
      }
    });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <header className="auth-header">
          <span className="auth-brand-tag">user_dashboard</span>
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-sub">Enter credentials to access account</p>
        </header>

        {errorMessage && (
          <div className="error-banner" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-item">
            <label htmlFor={emailId} className="form-label">
              Email
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.morgan@example.com…"
              autoComplete="email"
              spellCheck={false}
              required
              className={`form-input ${errorMessage && !email ? 'error' : ''}`}
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
              placeholder="••••••••••••…"
              autoComplete="current-password"
              required
              className={`form-input ${errorMessage && !password ? 'error' : ''}`}
            />
          </div>

          <button
            type="submit"
            className="btn btn-solid-white"
            style={{ width: '100%', marginTop: '6px' }}
            disabled={isPending}
          >
            {isPending ? 'Authenticating…' : 'Sign In'}
          </button>

          <div className="quick-bar">
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Demo Account</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="btn btn-outline"
              style={{ height: '24px', padding: '0 8px', fontSize: '11px' }}
            >
              Fill Demo
            </button>
          </div>
        </form>

        <footer style={{ marginTop: '16px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
          Need an account?{' '}
          <Link to="/register" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>
            Register
          </Link>
        </footer>
      </div>
    </div>
  );
}
