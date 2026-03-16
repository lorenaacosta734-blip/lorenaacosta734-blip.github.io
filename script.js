/* ========================================
   NEWSPAPER INTERACTIVE — script.js
   Charts, scroll animations, ticker
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCharts();
  initSmoothScroll();
  setCurrentDate();
});

/* --- Set Current Date in Masthead --- */
function setCurrentDate() {
  const dateEl = document.getElementById('current-date');
  if (!dateEl) return;
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString('es-CO', options);
}

/* --- Scroll Fade-In Animations --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* --- Smooth Scroll for Nav Links --- */
function initSmoothScroll() {
  document.querySelectorAll('.section-nav-bar a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

/* --- Chart Drawing (Canvas API) --- */
function initCharts() {
  drawBCorpGrowthChart();
  drawComparisonChart();
}

/* Chart 1: Growth of B Corp / BIC Companies in Colombia */
function drawBCorpGrowthChart() {
  const canvas = document.getElementById('chart-bcorp');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.parentElement.getBoundingClientRect();
  const W = rect.width;
  const H = 320;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(dpr, dpr);

  // Data: BIC companies registered in Colombia by year
  const data = [
    { year: '2018', value: 120 },
    { year: '2019', value: 210 },
    { year: '2020', value: 380 },
    { year: '2021', value: 590 },
    { year: '2022', value: 820 },
    { year: '2023', value: 1100 },
    { year: '2024', value: 1450 },
    { year: '2025', value: 1780 },
  ];

  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;
  const maxVal = 2000;

  // Grid lines
  ctx.strokeStyle = '#d4cfc5';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(W - padding.right, y);
    ctx.stroke();

    ctx.fillStyle = '#8b8b8b';
    ctx.font = '11px "EB Garamond", Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal - (maxVal / 4) * i).toLocaleString(), padding.left - 10, y + 4);
  }

  // Bars
  const barWidth = chartW / data.length * 0.6;
  const gap = chartW / data.length;

  data.forEach((d, i) => {
    const x = padding.left + gap * i + (gap - barWidth) / 2;
    const barH = (d.value / maxVal) * chartH;
    const y = padding.top + chartH - barH;

    // Gradient bar
    const grad = ctx.createLinearGradient(x, y, x, padding.top + chartH);
    grad.addColorStop(0, '#2c2c2c');
    grad.addColorStop(1, '#5a5a5a');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barWidth, barH);

    // Bar value
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 12px "EB Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.value.toLocaleString(), x + barWidth / 2, y - 8);

    // Year label
    ctx.fillStyle = '#6b6b6b';
    ctx.font = '12px "EB Garamond", Georgia, serif';
    ctx.fillText(d.year, x + barWidth / 2, padding.top + chartH + 22);
  });

  // Axis lines
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + chartH);
  ctx.lineTo(W - padding.right, padding.top + chartH);
  ctx.stroke();
}

/* Chart 2: Purpose-driven vs Traditional companies comparison */
function drawComparisonChart() {
  const canvas = document.getElementById('chart-comparison');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.parentElement.getBoundingClientRect();
  const W = rect.width;
  const H = 370;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(dpr, dpr);

  const categories = [
    { label: 'Retención\nde Talento', purpose: 82, traditional: 54 },
    { label: 'Crecimiento\nAnual (%)', purpose: 14, traditional: 9 },
    { label: 'NPS\n(Satisfacción)', purpose: 72, traditional: 45 },
    { label: 'Inversión\nSocial (% Rev)', purpose: 8, traditional: 2 },
  ];

  const padding = { top: 20, right: 30, bottom: 70, left: 50 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;
  const maxVal = 100;

  // Grid lines
  ctx.strokeStyle = '#d4cfc5';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartH / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(W - padding.right, y);
    ctx.stroke();

    ctx.fillStyle = '#8b8b8b';
    ctx.font = '11px "EB Garamond", Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal - (maxVal / 5) * i), padding.left - 10, y + 4);
  }

  const groupWidth = chartW / categories.length;
  const barWidth = groupWidth * 0.28;

  categories.forEach((cat, i) => {
    const groupX = padding.left + groupWidth * i;
    const barGap = 6;

    // Purpose bar
    const pH = (cat.purpose / maxVal) * chartH;
    const px = groupX + (groupWidth - barWidth * 2 - barGap) / 2;
    const py = padding.top + chartH - pH;

    const gradP = ctx.createLinearGradient(px, py, px, padding.top + chartH);
    gradP.addColorStop(0, '#1a1a1a');
    gradP.addColorStop(1, '#3a3a3a');
    ctx.fillStyle = gradP;
    ctx.fillRect(px, py, barWidth, pH);

    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 11px "EB Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(cat.purpose, px + barWidth / 2, py - 6);

    // Traditional bar
    const tH = (cat.traditional / maxVal) * chartH;
    const tx = px + barWidth + barGap;
    const ty = padding.top + chartH - tH;

    const gradT = ctx.createLinearGradient(tx, ty, tx, padding.top + chartH);
    gradT.addColorStop(0, '#a09888');
    gradT.addColorStop(1, '#c4b9a4');
    ctx.fillStyle = gradT;
    ctx.fillRect(tx, ty, barWidth, tH);

    ctx.fillStyle = '#6b6b6b';
    ctx.font = 'bold 11px "EB Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(cat.traditional, tx + barWidth / 2, ty - 6);

    // Category label (multi-line)
    const lines = cat.label.split('\n');
    ctx.fillStyle = '#4a4a4a';
    ctx.font = '12px "EB Garamond", Georgia, serif';
    const labelX = groupX + groupWidth / 2;
    lines.forEach((line, li) => {
      ctx.fillText(line, labelX, padding.top + chartH + 20 + li * 16);
    });
  });

  // Axis
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + chartH);
  ctx.lineTo(W - padding.right, padding.top + chartH);
  ctx.stroke();

  // Legend
  const legendY = H - 12;
  const legendX = W / 2 - 120;

  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(legendX, legendY - 10, 14, 14);
  ctx.fillStyle = '#4a4a4a';
  ctx.font = '12px "EB Garamond", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('Con Propósito', legendX + 20, legendY + 2);

  ctx.fillStyle = '#c4b9a4';
  ctx.fillRect(legendX + 140, legendY - 10, 14, 14);
  ctx.fillStyle = '#4a4a4a';
  ctx.fillText('Tradicionales', legendX + 160, legendY + 2);
}

/* --- Redraw charts on resize --- */
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initCharts();
  }, 250);
});
