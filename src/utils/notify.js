// src/utils/notify.js
let container = document.getElementById('toast-container');
if (!container) {
  container = document.createElement('div');
  container.id = 'toast-container';
  container.style.position = 'fixed';
  container.style.top = '12px';
  container.style.right = '12px';
  container.style.zIndex = '9999';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '8px';
  document.body.appendChild(container);
}

export function toast(message, type = 'info', ms = 2000) {
  const el = document.createElement('div');
  el.textContent = message;
  el.style.padding = '10px 14px';
  el.style.borderRadius = '8px';
  el.style.boxShadow = '0 2px 10px rgba(0,0,0,.15)';
  el.style.color = '#fff';
  el.style.fontSize = '14px';
  el.style.background = type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#111827';
  container.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .25s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 250);
  }, ms);
}

export function alert(title = 'Aviso', message = '', type = 'info') {
  toast(`${title}: ${message}`, type, 2500);
}
