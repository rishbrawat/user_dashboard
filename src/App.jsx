import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function NotFound() {
  return (
    <div className="auth-page-container" style={{ textAlign: 'center' }}>
      <div className="auth-card" style={{ maxWidth: '420px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Page Not Found</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--color-foreground-muted)' }}>
          The requested path does not exist on this portal.
        </p>
        <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
