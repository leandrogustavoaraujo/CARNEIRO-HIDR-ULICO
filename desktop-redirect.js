// Reserva para ativar somente depois que a landing estiver pronta.
// Para ativar, adicione <script src="desktop-redirect.js"></script> no <head> de index.html.
(() => {
  const desktopDestination = new URL('https://apostila-guia-off-grid.lovable.app/');
  const userAgent = navigator.userAgent || '';
  const isMobile = navigator.userAgentData?.mobile
    || /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    || (/macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);

  // Telefones e tablets abrem a landing independentemente do país.
  if (isMobile) return;

  // Somente computadores identificados no Brasil são redirecionados.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  fetch('https://ipapi.co/json/', { signal: controller.signal })
    .then((response) => {
      if (!response.ok) throw new Error('Consulta de país indisponível');
      return response.json();
    })
    .then((data) => {
      if (data.country_code !== 'BR' && data.country !== 'BR') return;
      new URLSearchParams(window.location.search).forEach((value, key) => {
        desktopDestination.searchParams.append(key, value);
      });
      window.location.replace(desktopDestination.toString());
    })
    .catch(() => {
      // Se a localização falhar, a landing permanece acessível.
    })
    .finally(() => clearTimeout(timeout));
})();
