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
