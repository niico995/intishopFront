// src/lib/compatApi.js
import axiosInstance from "../api/axiosConfig";

function toJSON(maybe) {
  if (maybe === undefined) return undefined;
  if (typeof maybe === "string") {
    try { return JSON.parse(maybe); } catch { return maybe; }
  }
  return maybe;
}

if (typeof window !== "undefined" && !window.api) {
  window.api = function api(path, opts = {}) {
    const url = path.startsWith("/") ? path : `/${path}`;
    const method = (opts.method || "GET").toUpperCase();
    const headers = opts.headers || {};
    const data = toJSON(opts.body);

    return axiosInstance
      .request({ url, method, headers, data })
      .then((r) => r.data);
  };
}

export {};
