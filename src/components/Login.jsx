import { useState, useTransition, useId } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  LayoutDashboard,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, demoCredentials, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();

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
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    startTransition(() => {
      try {
        login(email, password);
        navigate(from, { replace: true });
      } catch (err) {
        setErrorMessage(err.message || 'Authentication failed. Please verify your details.');
      }
    });
  };

  return (
    <div className="auth-page-container">
      {/* Ambient background glow elements */}
      <div className="auth-ambient-orb-1" aria-hidden="true" />
      <div className="auth-ambient-orb-2" aria-hidden="true" />

      {/* Top right theme toggle */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 20 }}>
        <button
          type="button"
          onClick={toggleTheme}
          className="btn-secondary"
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 0.85rem' }}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={16} aria-hidden="true" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon size={16} aria-hidden="true" />
              <span>Dark</span>
            </>
          )}
        </button>
      </div>

      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo" aria-hidden="true">
            <LayoutDashboard size={28} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to access your user dashboard and metrics</p>
        </header>

        {errorMessage && (
          <div
            className="form-error"
            role="alert"
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--color-danger-bg)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            <AlertCircle size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email input field */}
          <div className="form-group">
            <label htmlFor={emailId} className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <span className="input-icon-left" aria-hidden="true">
                <Mail size={18} />
              </span>
              <input
                id={emailId}
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com…"
                autoComplete="email"
                spellCheck={false}
                required
                className={`input-control ${errorMessage && !email ? 'error' : ''}`}
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor={passwordId} className="form-label">
                Password
              </label>
              <button
                type="button"
                className="btn-ghost"
                style={{ fontSize: '0.8rem', padding: '0 0.25rem' }}
                onClick={() => alert('Demo account reset: Use alex.morgan@example.com / Password123!')}
              >
                Forgot password?
              </button>
            </div>
            <div className="input-wrapper">
              <span className="input-icon-left" aria-hidden="true">
                <Lock size={18} />
              </span>
              <input
                id={passwordId}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••…"
                autoComplete="current-password"
                required
                className={`input-control ${errorMessage && !password ? 'error' : ''}`}
                style={{ paddingRight: '2.8rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="input-action-btn"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Remember me option */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              id={rememberId}
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
            <label htmlFor={rememberId} style={{ fontSize: '0.86rem', color: 'var(--color-foreground-muted)', cursor: 'pointer', userSelect: 'none' }}>
              Keep me signed in for 30 days
            </label>
          </div>

          {/* Submit button */}
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? (
              <>
                <div className="spinner" aria-hidden="true" />
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>

          {/* Demo auto-fill banner */}
          <div className="quick-demo-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} aria-hidden="true" style={{ color: 'var(--color-primary)' }} />
              <span className="quick-demo-text">Quick testing credentials</span>
            </div>
            <button type="button" onClick={handleFillDemo} className="quick-demo-btn">
              Auto Fill
            </button>
          </div>
        </form>

        <footer style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-foreground-muted)' }}>
          Don’t have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create an account
          </Link>
        </footer>
      </div>
    </div>
  );
}
