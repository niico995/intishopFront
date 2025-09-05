// src/lib/api-global.js
import { api as namedApi } from "./api";
if (typeof window !== "undefined") window.api = namedApi;
export const api = namedApi;
