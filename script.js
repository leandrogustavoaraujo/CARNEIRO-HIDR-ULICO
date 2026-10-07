const dateNode = document.getElementById('offer-date');
if (dateNode) {
  const today = new Date();
  dateNode.textContent = new Intl.DateTimeFormat('pt-BR', {day:'2-digit',month:'2-digit',year:'numeric'}).format(today);
  dateNode.dateTime = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
}

// O segundo conjunto reproduz o primeiro sem duplicar identificadores de imagem.
const track = document.getElementById('learning-track');
if (track) {
  [...track.children].forEach(card => {
    const copy = card.cloneNode(true);
    copy.removeAttribute('id');
    copy.removeAttribute('data-image-slot');
    copy.setAttribute('aria-hidden', 'true');
    track.appendChild(copy);
  });
}

document.querySelectorAll('.faq-item button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const wasOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item').forEach(other => {
      other.classList.remove('is-open');
      other.querySelector('button').setAttribute('aria-expanded','false');
      other.querySelector('.faq-sign').textContent = '+';
    });
    if (!wasOpen) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded','true');
      item.querySelector('.faq-sign').textContent = '−';
    }
  });
});

// Preserva a origem da campanha até o pagamento e registra a intenção de compra.
(() => {
  const checkoutProducts = {
    'https://pay.wiapy.com/b9iSslfLwCda': {
      name: 'Sítio OFF GRID — Plano Completo Promocional',
      value: 19.90
    },
    'https://pay.wiapy.com/5S1r_y6eb2mL': {
      name: 'Sítio OFF GRID — Apostila',
      value: 29.90
    },
    'https://pay.wiapy.com/y5HEBDNZnlfJ': {
      name: 'Sítio OFF GRID — Plano Completo',
      value: 59.90
    }
  };
  const acceptedParameters = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'src', 'sck', 'fbclid', 'gclid'
  ];
  const landingParameters = new URLSearchParams(window.location.search);

  function checkoutUrlWithTracking(baseUrl) {
    const checkoutUrl = new URL(baseUrl);
    acceptedParameters.forEach((parameter) => {
      const value = landingParameters.get(parameter);
      if (value) checkoutUrl.searchParams.set(parameter, value);
    });
    return checkoutUrl.toString();
  }

  document.querySelectorAll('a[href*="pay.wiapy.com"]').forEach((link) => {
    const destination = new URL(link.href);
    const baseUrl = `${destination.origin}${destination.pathname}`;
    const product = checkoutProducts[baseUrl];
    if (!product) return;

    link.href = checkoutUrlWithTracking(baseUrl);
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented) return;
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', {
          content_name: product.name,
          value: product.value,
          currency: 'BRL'
        });
      }
    });
  });
})();

