const WHATSAPP_NUMBER = '5581998583250';

// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Revelação ao rolar
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Carousel de evolução
const track = document.getElementById('carousel-track');
const dotsWrap = document.getElementById('carousel-dots');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

const images = Array.from({ length: 10 }, (_, i) => `assets/aluno-${String(i + 1).padStart(2, '0')}.jpeg`);
images.forEach((src, idx) => {
  const slide = document.createElement('article');
  slide.className = 'slide';
  slide.innerHTML = `<img src="${src}" alt="Evolução do aluno ${idx + 1}" loading="lazy" />`;
  track.appendChild(slide);
});

let index = 0;
let visible = 3;
let maxIndex = 0;

function setVisible() {
  if (window.innerWidth <= 760) visible = 1;
  else if (window.innerWidth <= 991) visible = 2;
  else visible = 3;

  maxIndex = Math.max(0, images.length - visible);
  if (index > maxIndex) index = maxIndex;
  renderDots();
  updateCarousel();
}

function updateCarousel() {
  const slideWidth = track.querySelector('.slide')?.getBoundingClientRect().width || 0;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  track.style.transform = `translateX(-${index * (slideWidth + gap)}px)`;
  [...dotsWrap.children].forEach((dot, i) => {
    const isActive = i === index;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function renderDots() {
  dotsWrap.innerHTML = '';
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('button');
    dot.className = `dot ${i === index ? 'active' : ''}`;
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ir para foto ${i + 1}`);
    dot.setAttribute('aria-current', i === index ? 'true' : 'false');
    dot.addEventListener('click', () => { index = i; updateCarousel(); resetAutoplay(); });
    dotsWrap.appendChild(dot);
  }
}

function nextSlide() { index = index >= maxIndex ? 0 : index + 1; updateCarousel(); }
function prevSlide() { index = index <= 0 ? maxIndex : index - 1; updateCarousel(); }

nextBtn?.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
prevBtn?.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
window.addEventListener('resize', setVisible);

let autoPlay = setInterval(nextSlide, 3500);
function resetAutoplay() { clearInterval(autoPlay); autoPlay = setInterval(nextSlide, 3500); }
setVisible();

// Botões dos serviços
function openServiceWhatsApp(serviceName) {
  const text = `Olá, Janaína! Tenho interesse no serviço ${serviceName} e quero mais informações.`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

document.querySelectorAll('.service-btn').forEach((btn) => {
  btn.addEventListener('click', () => openServiceWhatsApp(btn.dataset.service));
});

// Formulário de agendamento
const scheduleForm = document.getElementById('schedule-form');
scheduleForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(scheduleForm);
  const nome = (formData.get('nome') || '').toString().trim();
  const whatsapp = (formData.get('whatsapp') || '').toString().trim();
  const objetivo = (formData.get('objetivo') || '').toString().trim() || '-';
  const modalidade = (formData.get('modalidade') || '').toString().trim() || '-';
  const horario = (formData.get('horario') || '').toString().trim() || '-';
  const observacoes = (formData.get('observacoes') || '').toString().trim() || '-';

  if (!nome || !whatsapp) {
    alert('Por favor, preencha nome e WhatsApp para continuar.');
    return;
  }

  const message = `Olá, Janaína! Quero agendar uma Avaliação Física.\n\nNome: ${nome}\nWhatsApp: ${whatsapp}\nObjetivo: ${objetivo}\nModalidade desejada: ${modalidade}\nMelhor horário para contato: ${horario}\nObservações: ${observacoes}\n\nPor favor, me informe os próximos passos.`;

  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(link, '_blank');
});

// Ano atual no footer
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
