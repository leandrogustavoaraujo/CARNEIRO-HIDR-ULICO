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

document.querySelectorAll('.purchase-button').forEach(button => {
  button.addEventListener('click', () => {
    const message = document.getElementById('checkout-message');
    message.textContent = 'O checkout deste novo produto ainda não foi configurado. Insira o link correto antes de publicar a página.';
    message.hidden = false;
    message.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
});
