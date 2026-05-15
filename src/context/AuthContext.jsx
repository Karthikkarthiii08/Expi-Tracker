import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ft_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('ft_users') || '[]');
    if (users.find(u => u.email === email)) return { error: 'Email already registered' };
    const newUser = { id: Date.now(), name, email, password, avatar: name[0].toUpperCase() };
    users.push(newUser);
    localStorage.setItem('ft_users', JSON.stringify(users));
    // Do NOT auto-login — user must sign in manually
    return { success: true };
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('ft_users') || '[]');
    // Check email exists first
    const emailExists = users.find(u => u.email === email);
    if (!emailExists) return { error: 'No account found with this email. Please sign up first.' };
    // Then check password
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { error: 'Incorrect password. Please try again.' };
    const { password: _, ...safeUser } = found;
    localStorage.setItem('ft_user', JSON.stringify(safeUser));
    setUser(safeUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('ft_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
