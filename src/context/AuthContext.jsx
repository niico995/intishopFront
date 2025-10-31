// import { createContext, useContext, useState, useEffect } from 'react';
// import {jwtDecode} from 'jwt-decode';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [usuario, setUsuario] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUsuario(decoded);
//       } catch (err) {
//         console.error('Token inválido', err);
//         localStorage.removeItem('token');
//       }
//     }
//   }, []);

//   const login = (token) => {
//     localStorage.setItem('token', token);
//     setUsuario(jwtDecode(token));
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUsuario(null);
//   };

//   return (
//     <AuthContext.Provider value={{ usuario, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  const decodeOrNull = (raw) => {
    try {
      if (!raw) return null;
      const p = jwtDecode(raw);
      if (p?.exp && Date.now() >= p.exp * 1000) return null; // expirado
      return p;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // lee primero 'access' (el que usan tus interceptors), sino 'token' legacy
    const access = localStorage.getItem('access') || localStorage.getItem('token');
    const decoded = decodeOrNull(access);
    if (decoded) setUsuario(decoded);
    else {
      // limpia restos inválidos para evitar loops raros
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('token');
      setUsuario(null);
    }

    // sincroniza entre pestañas
    const onStorage = (e) => {
      if (!e.key) return;
      if (['access','refresh','token'].includes(e.key)) {
        const next = localStorage.getItem('access') || localStorage.getItem('token');
        setUsuario(decodeOrNull(next));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // ✅ acepta string (token) o { access, refresh }
  const login = (payload) => {
    if (typeof payload === 'string') {
      localStorage.setItem('access', payload);
      // compat si alguna parte vieja lee 'token'
      localStorage.setItem('token', payload);
      setUsuario(decodeOrNull(payload));
      return;
    }
    const { access, refresh } = payload || {};
    if (access) {
      localStorage.setItem('access', access);
      localStorage.setItem('token', access); // compat con código que usa "token"
    }
    if (refresh) localStorage.setItem('refresh', refresh);
    setUsuario(decodeOrNull(access));
  };

  const logout = () => {
    // 🔴 BORRA TODO lo que pueda mantenerte logueado
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('token'); // legacy
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
