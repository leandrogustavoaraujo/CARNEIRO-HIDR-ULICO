const dateElement = document.querySelector('#offer-date');
if (dateElement) dateElement.textContent = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());
const yearElement = document.querySelector('#year');
if (yearElement) yearElement.textContent = new Date().getFullYear();
document.querySelectorAll('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item').forEach((other) => {
      other.classList.remove('is-open');
      other.querySelector('button').setAttribute('aria-expanded', 'false');
      other.querySelector('.faq-sign').textContent = '+';
    });
    if (!isOpen) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      item.querySelector('.faq-sign').textContent = '−';
    }
  });
});

document.querySelectorAll('[data-carousel-target]').forEach((button) => {
  button.addEventListener('click', () => {
    const carousel = document.querySelector(`[data-carousel="${button.dataset.carouselTarget}"]`);
    if (!carousel) return;
    carousel.scrollBy({
      left: carousel.clientWidth * Number(button.dataset.carouselDirection || 1) * 0.82,
      behavior: 'smooth',
    });
  });
});

// Mantém a atribuição da campanha até o checkout e registra apenas a intenção
// quando o visitante escolhe um dos dois planos reais de pagamento.
(() => {
  const checkoutProducts = {
    'https://pay.wiapy.com/JVNVCu_cL8Ar': {
      name: 'Água Sem Energia — Plano Básico',
      value: 9.90
    },
    'https://pay.wiapy.com/-_uk8YovU5V5': {
      name: 'Água Sem Energia — Plano Completo',
      value: 27.90
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
    link.addEventListener('click', () => {
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
