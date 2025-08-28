// src/utils/notify.js
import Swal from "sweetalert2";

export const toast = (title, icon = "success") =>
  Swal.fire({
    toast: true,
    position: "top-end",
    timer: 1800,
    showConfirmButton: false,
    icon,
    title,
  });

export const alert = (title, text = "", icon = "info") =>
  Swal.fire({ title, text, icon, confirmButtonText: "OK" });
