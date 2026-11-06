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
  aware: `@inproceedings{liao-etal-2026-aware,
    title = "{AWAR}e: Mitigating Catastrophic Forgetting via Activation-Weighted Adaptive {RE}tention",
    author = "Liao, Juncheng  and
      Lv, Jinfan  and
      Wang, Guoming  and
      Zheng, Juepeng  and
      Xiao, Ling  and
      Tang, Siliang",
    editor = "Lee, Hung-Yi  and
      Dev, Sunipa  and
      Li, Junyi Jessy  and
      Elliott, Desmond",
    booktitle = "Proceedings of the 2026 Conference on Empirical Methods in Natural Language Processing",
    month = oct,
    year = "2026",
    address = "Budapest, Hungary",
    publisher = "Association for Computational Linguistics",
    url = "https://aclanthology.org/2026.emnlp-main.604/",
    doi = "10.18653/2026.emnlp-main.604",
    pages = "13928--13944",
    ISBN = "979-8-89176-459-0",
    abstract = "Multimodal Large Language Models (MLLMs) exhibit strong generalization and reasoning abilities due to large-scale multimodal pre-training. However, fine-tuning these models on downstream tasks often leads to catastrophic forgetting, where newly learned task-specific knowledge degrades previously acquired capabilities. This issue arises because gradient updates for new tasks overwrite parameters critical to prior knowledge, limiting the practical deployment of MLLMs. To address this challenge, we propose **Activation-Weighted Adaptive REtention (AWARe)**, a fine-tuning method that mitigates catastrophic forgetting by dynamically controlling parameter updates based on activation patterns. AWARe assigns activation-based importance scores to parameters, selectively freezing those essential for preserving prior capabilities while allowing less important parameters to adapt to new tasks. Importantly, AWARe operates without modifying model architectures, ensuring compatibility with existing inference engines. Extensive experiments demonstrate that AWARe effectively preserves upstream capabilities while achieving superior downstream performance compared to existing methods. Code is available at https://github.com/kaln27/AWARe."
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
