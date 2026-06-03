const STORAGE_KEY = 'nexo_landing_dark_mode';

export function isDarkMode(): boolean {
  return document.documentElement.classList.contains('theme-dark');
}

function setToggleUi(dark: boolean): void {
  const btn = document.getElementById('nexo-theme-toggle');
  const icon = btn?.querySelector('i');
  if (!btn || !icon) return;

  btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
  btn.title = dark ? 'Modo claro' : 'Modo oscuro';
  icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

export function applyTheme(dark: boolean, persist: boolean): void {
  document.documentElement.classList.toggle('theme-dark', dark);
  if (persist) {
    localStorage.setItem(STORAGE_KEY, dark ? '1' : '0');
  }
  setToggleUi(dark);
}

export function initLandingTheme(): void {
  const btn = document.getElementById('nexo-theme-toggle');
  if (!btn) return;

  setToggleUi(isDarkMode());

  btn.addEventListener('click', () => {
    applyTheme(!isDarkMode(), true);
  });
}
