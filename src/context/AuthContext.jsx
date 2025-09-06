import React, { createContext, useContext } from "react";

const AuthCtx = createContext({ usuario: null });
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  return (
    <AuthCtx.Provider value={{ usuario: null }}>
      {children}
    </AuthCtx.Provider>
  );
}
