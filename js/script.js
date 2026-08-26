// ── Hamburger menü
const hb = document.getElementById('hamburger');
const mn = document.getElementById('mobile-nav');
if (hb && mn) {
  hb.addEventListener('click', () => {
    const open = mn.classList.toggle('open');
    hb.setAttribute('aria-expanded', String(open));
  });
  mn.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mn.classList.remove('open');
    hb.setAttribute('aria-expanded', 'false');
  }));
}

// ── Scroll fade-up animasyonu
const scrollObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('.fade-up').forEach(el => scrollObs.observe(el));

// ── Hero jalousie illüstrasyonu
(function buildJalousie() {
  const frame = document.getElementById('jaloFrame');
  if (!frame) return;
  const angles = [-20,-14,-8,-2,4,10,16,12,6,0,-6,-12,-18];
  for (let i = 0; i < 13; i++) {
    const s = document.createElement('div');
    s.className = 'slat';
    s.style.top = (i / 12 * 100) + '%';
    s.style.transform = 'rotate(' + angles[i] + 'deg)';
    s.style.opacity = (0.3 + (i % 4) * 0.18).toFixed(2);
    frame.appendChild(s);
  }
})();

// ── Galeri
function renderGallery(category) {
  const container = document.getElementById('gallery-' + category);
  if (!container) return;

  const images = (typeof GALLERY !== 'undefined' && Array.isArray(GALLERY[category]))
    ? GALLERY[category].filter(Boolean)
    : [];

  if (images.length === 0) {
    container.innerHTML =
      '<div class="gallery-placeholder">' +
        '<p>' +
          '<code>img/' + category + '/</code> klasörüne fotoğraflarınızı koyun,<br>' +
          'ardından <code>gallery-config.js</code> dosyasındaki <strong>' + category + '</strong> dizisine dosya yolunu ekleyin.<br>' +
          'Örnek: <code>\'img/' + category + '/foto1.jpg\'</code>' +
        '</p>' +
      '</div>';
    return;
  }

  container.innerHTML = images.map((src, i) =>
    '<div class="gallery-item" data-src="' + src + '" data-idx="' + i + '">' +
      '<img src="' + src + '" alt="Perde resmi ' + (i + 1) + '" loading="lazy">' +
    '</div>'
  ).join('');

  container.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(images, parseInt(item.dataset.idx)));
  });
}

// ── Galeri otomatik başlatma (data-gallery niteliği olan tüm konteynerler)
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.gallery-grid[data-gallery]').forEach(function (el) {
    renderGallery(el.dataset.gallery);
  });
});

// ── Lightbox
var lbImages = [];
var lbIndex  = 0;

function openLightbox(images, idx) {
  lbImages = images;
  lbIndex  = idx;
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  updateLbImg();
  lb.classList.add('open');
}

function updateLbImg() {
  const img = document.getElementById('lb-img');
  if (img) img.src = lbImages[lbIndex];
}

document.addEventListener('DOMContentLoaded', function () {
  const lb     = document.getElementById('lightbox');
  const lbImg  = document.getElementById('lb-img');
  if (!lb) return;

  document.getElementById('lb-close').addEventListener('click', () => lb.classList.remove('open'));
  lb.addEventListener('click', e => { if (e.target === lb || e.target === lbImg) lb.classList.remove('open'); });

  document.getElementById('lb-prev').addEventListener('click', e => {
    e.stopPropagation();
    lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
    updateLbImg();
  });
  document.getElementById('lb-next').addEventListener('click', e => {
    e.stopPropagation();
    lbIndex = (lbIndex + 1) % lbImages.length;
    updateLbImg();
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      lb.classList.remove('open');
    if (e.key === 'ArrowLeft')  { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; updateLbImg(); }
    if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbImages.length; updateLbImg(); }
  });
});
