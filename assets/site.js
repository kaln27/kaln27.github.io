const figureDialog = document.querySelector('.figure-dialog');
let figureTrigger;

if (figureDialog) {
  const image = figureDialog.querySelector('.large-figure');
  const title = figureDialog.querySelector('#figure-title');
  const originalLink = figureDialog.querySelector('.figure-download');
  const description = figureDialog.querySelector('.figure-description');
  const content = figureDialog.querySelector('.figure-content');
  document.querySelectorAll('[data-figure]').forEach((button) => {
    button.addEventListener('click', () => {
      figureTrigger = button;
      const thumbnail = button.querySelector('img');
      const isTable = button.hasAttribute('data-paper-table');
      const summaryId = button.getAttribute('aria-describedby');
      const summary = isTable && summaryId ? document.getElementById(summaryId)?.textContent : '';
      figureDialog.classList.toggle('figure-dialog--table', isTable);
      if (description) {
        description.textContent = summary || '';
        description.hidden = !summary;
        if (summary) figureDialog.setAttribute('aria-describedby', description.id);
        else figureDialog.removeAttribute('aria-describedby');
      }
      if (content) {
        if (isTable) {
          content.setAttribute('tabindex', '0');
          content.setAttribute('role', 'region');
          content.setAttribute('aria-label', '可横向滚动的论文表格');
        } else {
          content.removeAttribute('tabindex');
          content.removeAttribute('role');
          content.removeAttribute('aria-label');
        }
      }
      image.alt = thumbnail?.alt ?? `${button.dataset.title}（论文原表）`;
      for (const dimension of ['width', 'height']) {
        if (thumbnail?.hasAttribute(dimension)) image.setAttribute(dimension, thumbnail.getAttribute(dimension));
        else image.removeAttribute(dimension);
      }
      image.src = button.dataset.figure;
      title.textContent = button.dataset.title;
      if (originalLink) {
        originalLink.href = button.dataset.original || button.dataset.figure;
        originalLink.textContent = isTable ? '打开论文原表 ↗' : document.documentElement.lang.startsWith('zh') ? '打开原图 ↗' : 'Open original figure ↗';
      }
      figureDialog.showModal();
      if (content) content.scrollLeft = 0;
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

const citations = {
  aware: `@misc{liao2026aware,
  title = {AWARe: Mitigating Catastrophic Forgetting via Activation-Weighted Adaptive REtention},
  author = {Juncheng Liao and Jinfan Lv and Guoming Wang and Jupeng Zheng and Ling Xiao and Siliang Tang},
  year = {2026},
  eprint = {2608.11758},
  archivePrefix = {arXiv},
  primaryClass = {cs.CL},
  doi = {10.48550/arXiv.2608.11758},
  url = {https://arxiv.org/abs/2608.11758},
}`
};

function copyWithSelection(text) {
  const previousFocus = document.activeElement;
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
  document.body.append(field);
  field.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } finally {
    field.remove();
    previousFocus?.focus({ preventScroll: true });
  }
  if (!copied) throw new Error('Clipboard copy unavailable');
}

document.querySelectorAll('[data-copy-citation]').forEach((button) => {
  const label = button.querySelector('[data-copy-label]');
  const originalLabel = label.textContent;
  const isChinese = document.documentElement.lang.startsWith('zh');
  const status = document.createElement('span');
  status.className = 'copy-status';
  status.setAttribute('role', 'status');
  button.after(status);
  let resetTimer;

  button.addEventListener('click', async () => {
    const citation = citations[button.dataset.copyCitation];
    if (!citation || button.disabled) return;
    clearTimeout(resetTimer);
    status.textContent = '';
    button.disabled = true;
    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(citation);
        } catch {
          copyWithSelection(citation);
        }
      } else {
        copyWithSelection(citation);
      }
      label.textContent = isChinese ? '已复制' : 'Copied';
      status.textContent = isChinese ? 'BibTeX 已复制到剪贴板。' : 'BibTeX copied to clipboard.';
      button.dataset.copyState = 'copied';
      resetTimer = setTimeout(() => {
        label.textContent = originalLabel;
        delete button.dataset.copyState;
      }, 2500);
    } catch {
      label.textContent = isChinese ? '重试复制' : 'Try again';
      status.textContent = isChinese ? '复制失败，请重试。' : 'Could not copy. Please try again.';
    } finally {
      button.disabled = false;
    }
  });
});
