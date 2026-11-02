document.querySelectorAll('#research [data-math]').forEach((element) => {
  if (!window.katex) return;
  const source = element.textContent.trim();
  try {
    window.katex.render(source, element, {
      displayMode: element.dataset.math === 'display',
      output: 'htmlAndMathml',
      throwOnError: true,
      strict: 'error',
      trust: false,
    });
    element.dataset.mathRendered = 'true';
  } catch (error) {
    element.textContent = source;
    console.error('Could not render research equation:', error);
  }
});
