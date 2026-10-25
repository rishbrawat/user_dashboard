import { useState, useTransition, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  AlertCircle,
  LayoutDashboard,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Product Specialist');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const roleId = useId();
  const termsId = useId();

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const strengthScore = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthDetails = {
    0: { label: 'Empty', color: 'var(--color-border)', width: '0%' },
    1: { label: 'Weak', color: 'var(--color-danger)', width: '25%' },
    2: { label: 'Fair', color: 'var(--color-warning)', width: '50%' },
    3: { label: 'Good', color: 'var(--color-secondary)', width: '75%' },
    4: { label: 'Strong', color: 'var(--color-success)', width: '100%' }
  }[strengthScore];

  const handleFillSample = () => {
    const randomId = Math.floor(Math.random() * 900) + 100;
    setName(`Sarah Connor`);
    setEmail(`sarah.connor${randomId}@example.com`);
    setPassword(`SecurePass${randomId}!`);
    setConfirmPassword(`SecurePass${randomId}!`);
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('The entered passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must accept the Terms of Service to continue.');
      return;
    }

    startTransition(() => {
      try {
        register(name, email, password, role);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setErrorMessage(err.message || 'Registration failed.');
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

      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <header className="auth-header">
          <div className="auth-logo" aria-hidden="true">
            <LayoutDashboard size={28} />
          </div>
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Join user_dashboard to track and analyze team analytics</p>
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
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor={nameId} className="form-label">
              Full Name
            </label>
            <div className="input-wrapper">
              <span className="input-icon-left" aria-hidden="true">
                <User size={18} />
              </span>
              <input
                id={nameId}
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe…"
                autoComplete="name"
                required
                className="input-control"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label htmlFor={emailId} className="form-label">
              Work Email
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
                placeholder="jane.doe@company.com…"
                autoComplete="email"
                spellCheck={false}
                required
                className="input-control"
              />
            </div>
          </div>

          {/* Role selector */}
          <div className="form-group">
            <label htmlFor={roleId} className="form-label">
              Role / Department
            </label>
            <select
              id={roleId}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '0.85rem' }}
            >
              <option value="Product Specialist">Product Specialist</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Operations Lead">Operations Lead</option>
            </select>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor={passwordId} className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon-left" aria-hidden="true">
                <Lock size={18} />
              </span>
              <input
                id={passwordId}
                name="new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters…"
                autoComplete="new-password"
                required
                className="input-control"
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

            {/* Password strength meter */}
            {password.length > 0 && (
              <div className="strength-meter" aria-live="polite">
                <div className="strength-bar-track">
                  <div
                    className="strength-bar-fill"
                    style={{
                      width: strengthDetails.width,
                      backgroundColor: strengthDetails.color
                    }}
                  />
                </div>
                <div className="strength-label">
                  <span style={{ color: 'var(--color-foreground-muted)' }}>Security strength</span>
                  <span style={{ color: strengthDetails.color }}>{strengthDetails.label}</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor={confirmPasswordId} className="form-label">
              Confirm Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon-left" aria-hidden="true">
                <ShieldCheck size={18} />
              </span>
              <input
                id={confirmPasswordId}
                name="confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type your password…"
                autoComplete="new-password"
                required
                className="input-control"
              />
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              id={termsId}
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
            <label htmlFor={termsId} style={{ fontSize: '0.85rem', color: 'var(--color-foreground-muted)', cursor: 'pointer', userSelect: 'none' }}>
              I agree to the <span style={{ color: 'var(--color-primary)' }}>Terms of Service</span> and <span style={{ color: 'var(--color-primary)' }}>Privacy Policy</span>
            </label>
          </div>

          {/* Submit button */}
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? (
              <>
                <div className="spinner" aria-hidden="true" />
                <span>Creating account…</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>

          {/* Auto Fill Sample Button */}
          <div className="quick-demo-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} aria-hidden="true" style={{ color: 'var(--color-primary)' }} />
              <span className="quick-demo-text">Prefill test registration data</span>
            </div>
            <button type="button" onClick={handleFillSample} className="quick-demo-btn">
              Auto Fill
            </button>
          </div>
        </form>

        <footer style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-foreground-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign in
          </Link>
        </footer>
      </div>
    </div>
  );
}
