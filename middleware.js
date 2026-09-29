import { geolocation, next } from '@vercel/functions';

const DESKTOP_BR_DESTINATION = 'https://apostila-guia-off-grid.lovable.app/';

export const config = {
  matcher: ['/', '/index.html'],
};

export default function middleware(request) {
  const country = geolocation(request).country;
  const userAgent = request.headers.get('user-agent') || '';
  const mobileHint = request.headers.get('sec-ch-ua-mobile');
  const isPhoneOrTablet = mobileHint === '?1'
    || /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

  if (country === 'BR' && !isPhoneOrTablet) {
    const destination = new URL(DESKTOP_BR_DESTINATION);
    destination.search = new URL(request.url).search;
    return new Response(null, {
      status: 307,
      headers: {
        Location: destination.toString(),
        'Cache-Control': 'private, no-store',
      },
    });
  }

  return next();
}
