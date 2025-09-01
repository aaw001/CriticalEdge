<script>
async function initNav(selector = 'nav[data-ce-nav]') {
  try {
    const res  = await fetch('/CriticalEdge/assets/data/nav.json', { cache: 'no-store' });
    const items = await res.json();
    const here  = (location.pathname || '').toLowerCase();
    const navEl = document.querySelector(selector);
    if (!navEl) return;

    navEl.innerHTML = items.map(i => {
      const active = here.endsWith(i.href.toLowerCase());
      const cls = active
        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
        : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800';
      return `<a class="inline-flex items-center rounded-xl border px-3 h-9 text-sm ${cls}" href="${i.href}">${i.label}</a>`;
    }).join('');
  } catch (e) {
    console.warn('Nav failed to load:', e);
  }
}
document.addEventListener('DOMContentLoaded', () => initNav());
</script>
