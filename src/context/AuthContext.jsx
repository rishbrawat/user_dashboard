import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USERS_KEY = 'user_dashboard_accounts';
const CURRENT_USER_KEY = 'user_dashboard_current_user';

const INITIAL_DEMO_USER = {
  id: 'usr_01',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  password: 'Password123!',
  role: 'Product Lead',
  status: 'active',
  joinedDate: '2025-10-14'
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_USER;
    } catch {
      return INITIAL_DEMO_USER;
    }
  });

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

  const login = useCallback((email, password) => {
    const accounts = getAccounts();
    const cleanEmail = email.trim().toLowerCase();
    const found = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

    if (!found) {
      throw new Error('Account not found with this email.');
    }

    if (found.password !== password) {
      throw new Error('Incorrect password provided.');
    }

    const sessionUser = { ...found };
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  }, [getAccounts]);

  const register = useCallback((name, email, password, role = 'Member') => {
    const accounts = getAccounts();
    const cleanEmail = email.trim().toLowerCase();
    const existing = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

    if (existing) {
      throw new Error('Email address already registered.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      role,
      status: 'active',
      joinedDate: new Date().toISOString().slice(0, 10)
    };

    const updatedAccounts = [...accounts, newUser];
    localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(updatedAccounts));

    const sessionUser = { ...newUser };
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  }, [getAccounts]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch {
      // storage unavailable
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        demoCredentials: {
          email: INITIAL_DEMO_USER.email,
          password: INITIAL_DEMO_USER.password
        }
      }}
    >
      {children}
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
