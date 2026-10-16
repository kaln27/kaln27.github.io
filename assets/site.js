const figureDialog = document.querySelector('.figure-dialog');
let figureTrigger;

if (figureDialog) {
  const image = figureDialog.querySelector('.large-figure');
  const title = figureDialog.querySelector('#figure-title');
  document.querySelectorAll('[data-figure]').forEach((button) => {
    button.addEventListener('click', () => {
      figureTrigger = button;
      image.src = button.dataset.figure;
      image.alt = button.querySelector('img').alt;
      title.textContent = button.dataset.title;
      figureDialog.showModal();
    });
  });
  figureDialog.querySelector('[data-close-dialog]').addEventListener('click', () => figureDialog.close());
  figureDialog.addEventListener('click', (event) => {
    const bounds = figureDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      figureDialog.close();
    }
  });
  figureDialog.addEventListener('close', () => figureTrigger?.focus());
}

const navigation = [...document.querySelectorAll('.site-navigation a[href^="#"]')];
if (navigation.length && 'IntersectionObserver' in window) {
  const sections = navigation.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    const current = sections.find((section) => visible.has(section));
    if (!current) return;
    navigation.forEach((link) => {
      if (link.getAttribute('href') === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-5% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}

document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
