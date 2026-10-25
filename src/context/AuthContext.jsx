import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USERS_KEY = 'user_dashboard_accounts';
const CURRENT_USER_KEY = 'user_dashboard_current_user';
const THEME_KEY = 'user_dashboard_theme';

const INITIAL_DEMO_USER = {
  id: 'usr_01',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  password: 'Password123!',
  role: 'Product Lead',
  department: 'Product & Design',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  status: 'active',
  joinedDate: 'Oct 14, 2025'
};

export function AuthProvider({ children }) {
  // Lazy state initializations per React performance guidelines
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_USER;
    } catch {
      return INITIAL_DEMO_USER;
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  const [toasts, setToasts] = useState([]);

  // Sync theme attribute on documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // storage unavailable
    }
  }, [theme]);

  // Toast notification helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Toggle Theme
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Retrieve all registered accounts
  const getAccounts = useCallback(() => {
    try {
      const stored = localStorage.getItem(DEFAULT_USERS_KEY);
      if (!stored) {
        localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify([INITIAL_DEMO_USER]));
        return [INITIAL_DEMO_USER];
      }
      return JSON.parse(stored);
    } catch {
      return [INITIAL_DEMO_USER];
    }
  }, []);

  // Login action
  const login = useCallback((email, password) => {
    const accounts = getAccounts();
    const cleanEmail = email.trim().toLowerCase();
    const found = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

    if (!found) {
      throw new Error('No account found with this email address.');
    }

    if (found.password !== password) {
      throw new Error('Incorrect password. Please verify your credentials.');
    }

    const sessionUser = { ...found };
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    addToast(`Welcome back, ${sessionUser.name}!`, 'success');
    return sessionUser;
  }, [getAccounts, addToast]);

  // Register action
  const register = useCallback((name, email, password, role = 'Member') => {
    const accounts = getAccounts();
    const cleanEmail = email.trim().toLowerCase();
    const existing = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      role,
      department: 'Engineering & Growth',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      status: 'active',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updatedAccounts = [...accounts, newUser];
    localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(updatedAccounts));

    const sessionUser = { ...newUser };
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    addToast('Account created successfully!', 'success');
    return sessionUser;
  }, [getAccounts, addToast]);

  // Logout action
  const logout = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch {
      // storage unavailable
    }
    addToast('You have signed out.', 'info');
  }, [addToast]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        theme,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        demoCredentials: {
          email: INITIAL_DEMO_USER.email,
          password: INITIAL_DEMO_USER.password
        }
      }}
    >
      {children}
      {/* Toast container with accessible polite aria-live */}
      <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast" role="status">
            <span>{t.message}</span>
            <button
              type="button"
              className="btn-ghost"
              style={{ padding: '2px 6px', fontSize: '12px' }}
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
