import Sendsay from './index';

const features = [];

if (!('Promise' in window)) {
  features.push('Promise');
}

if (!('fetch' in window)) {
  features.push('fetch');
}

if (features.length) {
  const script = document.createElement('script');

  script.src = `https://cdn.polyfill.io/v2/polyfill.min.js?features=${features.join(',')}`;

  document.head.appendChild(script);
}

window.Sendsay = Sendsay;