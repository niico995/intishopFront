// import { Navigate, useLocation } from "react-router-dom";

// function decodeJWT(rawToken) {
//   try {
//     if (!rawToken) return null;

//     // Limpia "Bearer ..." y comillas accidentales
//     let token = String(rawToken).trim().replace(/^Bearer\s+/i, "");
//     token = token.replace(/^"|"$/g, "");

//     const parts = token.split(".");
//     if (parts.length < 2) return null;

//     // JWT usa base64url: convertir a base64 estándar + padding
//     const base64url = parts[1];
//     const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
//     const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

//     const json = atob(padded);
//     return JSON.parse(json);
//   } catch {
//     return null;
//   }
// }

// export default function AdminGuard({ children }) {
//   const location = useLocation();

//   const raw = localStorage.getItem("access") || localStorage.getItem("token");
//   if (!raw) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   const payload = decodeJWT(raw);
//   if (!payload) {
//     localStorage.removeItem("access");
//     localStorage.removeItem("token");
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   const expired =
//     typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
//   if (expired) {
//     localStorage.removeItem("access");
//     localStorage.removeItem("token");
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   const isAdmin =
//     payload.role === "admin" || payload.is_staff === true || payload.is_superuser === true;

//   if (!isAdmin) return <Navigate to="/" replace />;

//   return children;
// }


import { Navigate, useLocation } from "react-router-dom";

function decodeJWT(rawToken) {
  try {
    if (!rawToken) return null;

    // Limpia "Bearer ..." y comillas accidentales
    let token = String(rawToken).trim().replace(/^Bearer\s+/i, "");
    token = token.replace(/^"|"$/g, "");

    const parts = token.split(".");
    if (parts.length < 2) return null;

    // JWT usa base64url: convertir a base64 estándar + padding
    const base64url = parts[1];
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function AdminGuard({ children }) {
  const location = useLocation();

  const raw = localStorage.getItem("access") || localStorage.getItem("token");
  if (!raw) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const payload = decodeJWT(raw);
  if (!payload) {
    localStorage.removeItem("access");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const expired =
    typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  if (expired) {
    localStorage.removeItem("access");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const isAdmin =
    payload.role === "admin" || payload.is_staff === true || payload.is_superuser === true;

  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
