const portraitButton = document.querySelector('[data-portrait-toggle]');

if (portraitButton) {
  const image = portraitButton.querySelector('img');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.className = 'portrait-particles';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.hidden = true;
  portraitButton.append(canvas);
  const context = canvas.getContext('2d');
  const padding = 40;
  const duration = 1250;
  let displayedPortrait = false;
  let requestedPortrait = false;
  let animation;
  let frame;
  let preparing = false;

  const assets = [
    { src: image.getAttribute('src'), alt: image.alt, position: 0.5 },
    { src: portraitButton.dataset.portraitSrc, alt: 'Portrait of Juncheng Liao', position: 0.12 }
  ].map((asset) => {
    const bitmap = new Image();
    bitmap.decoding = 'async';
    bitmap.src = asset.src;
    const ready = bitmap.decode();
    // Preload both local images without making a failed request an unhandled rejection.
    ready.catch(() => {});
    return { ...asset, bitmap, ready };
  });

  const clamp = (value) => Math.max(0, Math.min(1, value));
  const smooth = (value) => value * value * (3 - 2 * value);

  function updateControl() {
    portraitButton.setAttribute('aria-pressed', String(requestedPortrait));
    portraitButton.title = requestedPortrait ? 'Switch back to my cat avatar' : 'Switch to my photo';
  }

  function finish(showPortrait) {
    cancelAnimationFrame(frame);
    animation = undefined;
    displayedPortrait = showPortrait;
    const asset = assets[Number(showPortrait)];
    image.src = asset.src;
    image.alt = asset.alt;
    canvas.hidden = true;
    context?.clearRect(0, 0, canvas.width, canvas.height);
    delete portraitButton.dataset.transitioning;
    portraitButton.removeAttribute('aria-busy');
  }

  function rasterize(asset, width, height) {
    const surface = document.createElement('canvas');
    surface.width = width;
    surface.height = height;
    const painter = surface.getContext('2d', { willReadFrequently: true });
    const scale = Math.max(width / asset.bitmap.naturalWidth, height / asset.bitmap.naturalHeight);
    const drawnWidth = asset.bitmap.naturalWidth * scale;
    const drawnHeight = asset.bitmap.naturalHeight * scale;
    painter.beginPath();
    painter.moveTo(8, 0);
    painter.arcTo(width, 0, width, height, 8);
    painter.arcTo(width, height, 0, height, 8);
    painter.arcTo(0, height, 0, 0, 8);
    painter.arcTo(0, 0, width, 0, 8);
    painter.closePath();
    painter.clip();
    // Match object-fit: cover and the two CSS object-position values.
    painter.drawImage(asset.bitmap, -(drawnWidth - width) / 2,
      -(drawnHeight - height) * asset.position, drawnWidth, drawnHeight);
    return { surface, pixels: painter.getImageData(0, 0, width, height).data };
  }

  function start() {
    const bounds = image.getBoundingClientRect();
    const width = Math.round(bounds.width);
    const height = Math.round(bounds.height);
    if (!width || !height) {
      finish(requestedPortrait);
      return;
    }
    const from = rasterize(assets[Number(displayedPortrait)], width, height);
    const to = rasterize(assets[Number(requestedPortrait)], width, height);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round((width + padding * 2) * ratio);
    canvas.height = Math.round((height + padding * 2) * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const particles = [];
    const gap = 4;
    for (let y = gap / 2; y < height; y += gap) {
      for (let x = gap / 2; x < width; x += gap) {
        const offset = (Math.floor(y) * width + Math.floor(x)) * 4;
        if (!from.pixels[offset + 3] && !to.pixels[offset + 3]) continue;
        const angle = Math.atan2(y - height / 2, x - width / 2) + (Math.random() - 0.5) * 1.2;
        const distance = 13 + Math.random() * 23;
        particles.push({
          x, y, offset,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          curl: (Math.random() - 0.5) * 12,
          delay: Math.random() * 0.14
        });
      }
    }
    animation = {
      from, to, particles, gap, width, height,
      fromPortrait: displayedPortrait, toPortrait: requestedPortrait,
      progress: 0, direction: 1, previousTime: performance.now()
    };
    portraitButton.dataset.transitioning = 'true';
    portraitButton.setAttribute('aria-busy', 'true');
    canvas.hidden = false;
    draw();
    frame = requestAnimationFrame(tick);
  }

  function draw() {
    const { from, to, particles, gap, width, height, progress } = animation;
    context.clearRect(0, 0, width + padding * 2, height + padding * 2);
    context.globalAlpha = 1 - smooth(clamp(progress / 0.18));
    context.drawImage(from.surface, padding, padding, width, height);
    context.globalAlpha = smooth(clamp((progress - 0.82) / 0.18));
    context.drawImage(to.surface, padding, padding, width, height);
    const opacity = Math.min(1, progress / 0.1, (1 - progress) / 0.1);
    for (const particle of particles) {
      const local = clamp((progress - particle.delay) / (1 - 2 * particle.delay));
      const blend = smooth(local);
      const scatter = Math.sin(Math.PI * local);
      const offset = particle.offset;
      const red = Math.round(from.pixels[offset] * (1 - blend) + to.pixels[offset] * blend);
      const green = Math.round(from.pixels[offset + 1] * (1 - blend) + to.pixels[offset + 1] * blend);
      const blue = Math.round(from.pixels[offset + 2] * (1 - blend) + to.pixels[offset + 2] * blend);
      const alpha = (from.pixels[offset + 3] * (1 - blend) + to.pixels[offset + 3] * blend) / 255;
      const size = gap * (1.08 - scatter * 0.63);
      const curl = particle.curl * Math.sin(Math.PI * 2 * local);
      const x = padding + particle.x + particle.dx * scatter + curl;
      const y = padding + particle.y + particle.dy * scatter - curl;
      context.globalAlpha = opacity * alpha;
      context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      context.fillRect(x - size / 2, y - size / 2, size, size);
    }
    context.globalAlpha = 1;
  }

  function tick(now) {
    if (!animation) return;
    // A short frame delay should not cause an abrupt jump across the entire effect.
    const elapsed = Math.min(now - animation.previousTime, 64);
    animation.previousTime = now;
    animation.progress = clamp(animation.progress + elapsed / duration * animation.direction);
    if (animation.progress === 0 && animation.direction < 0) {
      finish(animation.fromPortrait);
    } else if (animation.progress === 1) {
      finish(animation.toPortrait);
    } else {
      draw();
      frame = requestAnimationFrame(tick);
    }
  }

  portraitButton.addEventListener('click', async () => {
    requestedPortrait = !requestedPortrait;
    updateControl();
    if (!context || motionPreference.matches) {
      finish(requestedPortrait);
      return;
    }
    if (animation) {
      animation.direction = requestedPortrait === animation.fromPortrait ? -1 : 1;
      return;
    }
    if (preparing) return;
    preparing = true;
    try {
      await Promise.all(assets.map((asset) => asset.ready));
      if (requestedPortrait === displayedPortrait) return;
      if (document.hidden || motionPreference.matches) finish(requestedPortrait);
      else start();
    } catch {
      // Image display still works if pixel access or Canvas is unavailable.
      const target = assets[Number(requestedPortrait)].bitmap;
      if (target.complete && target.naturalWidth) finish(requestedPortrait);
      else {
        requestedPortrait = displayedPortrait;
        updateControl();
        finish(displayedPortrait);
      }
    } finally {
      preparing = false;
    }
  });

  window.addEventListener('resize', () => {
    if (animation) finish(requestedPortrait);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && animation) finish(requestedPortrait);
  });
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches && animation) finish(requestedPortrait);
  });
}
