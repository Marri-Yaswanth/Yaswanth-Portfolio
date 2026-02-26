import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface AdminCredentials {
  username: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => boolean;
  logout: () => void;
  /** Generate a 6-digit OTP for a given identifier (email / phone / username).
   *  Returns `true` if the identifier matches an admin account. */
  requestOtp: (identifier: string) => boolean;
  /** Verify the OTP that was generated. */
  verifyOtp: (code: string) => boolean;
  /** After OTP verified, reset the password. */
  resetPassword: (newPassword: string) => boolean;
  /** Get the last generated OTP (for demo toast). */
  lastOtp: string | null;
}

const STORAGE_KEY = 'admin_credentials';
const AUTH_SESSION_KEY = 'admin_authenticated';
const CREDS_VERSION_KEY = 'admin_credentials_version';
const CREDS_VERSION = 2; // bump this whenever you change DEFAULT_CREDENTIALS

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'yashu_2408',
  email: 'marriyaswanth42.com',
  phone: '9866474481',
  password: 'Yashu@2004',
};

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  /* ---------- credentials (persisted in localStorage) ---------- */
  const getCredentials = useCallback((): AdminCredentials => {
    try {
      // If credentials version changed, reset to new defaults
      const ver = Number(localStorage.getItem(CREDS_VERSION_KEY) || '0');
      if (ver < CREDS_VERSION) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
        localStorage.setItem(CREDS_VERSION_KEY, String(CREDS_VERSION));
        return DEFAULT_CREDENTIALS;
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
    localStorage.setItem(CREDS_VERSION_KEY, String(CREDS_VERSION));
    return DEFAULT_CREDENTIALS;
  }, []);

  const saveCredentials = (creds: AdminCredentials) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
  };

  /* ---------- session state ---------- */
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
  });

  useEffect(() => {
    sessionStorage.setItem(AUTH_SESSION_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  /* ---------- OTP state ---------- */
  const [lastOtp, setLastOtp] = useState<string | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);
  // track which identifier was matched so resetPassword knows who to update
  const [pendingResetId, setPendingResetId] = useState<string | null>(null);

  /* ---------- actions ---------- */
  const login = (identifier: string, password: string): boolean => {
    const creds = getCredentials();
    const id = identifier.trim().toLowerCase();
    const matchesId =
      id === creds.username.toLowerCase() ||
      id === creds.email.toLowerCase() ||
      id === creds.phone;
    if (matchesId && password === creds.password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  };

  const requestOtp = (identifier: string): boolean => {
    const creds = getCredentials();
    const id = identifier.trim().toLowerCase();
    const matchesId =
      id === creds.username.toLowerCase() ||
      id === creds.email.toLowerCase() ||
      id === creds.phone;
    if (!matchesId) return false;

    // generate a 6-digit code
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setLastOtp(otp);
    setOtpVerified(false);
    setPendingResetId(id);
    return true;
  };

  const verifyOtp = (code: string): boolean => {
    if (lastOtp && code === lastOtp) {
      setOtpVerified(true);
      return true;
    }
    return false;
  };

  const resetPassword = (newPassword: string): boolean => {
    if (!otpVerified || !pendingResetId) return false;
    const creds = getCredentials();
    creds.password = newPassword;
    saveCredentials(creds);
    // clean up
    setLastOtp(null);
    setOtpVerified(false);
    setPendingResetId(null);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, requestOtp, verifyOtp, resetPassword, lastOtp }}
    >
      {children}
    </AuthContext.Provider>
  );
};
