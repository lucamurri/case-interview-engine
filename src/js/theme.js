/**
 * theme.js — the light/dark mode toggle in the header.
 *
 * With no saved choice the site follows the device setting. Clicking the
 * toggle saves an explicit "light" or "dark" choice in localStorage.
 */
const KEY = 'cie.theme';
const root = document.documentElement;
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

const current = () => root.dataset.theme || (systemDark.matches ? 'dark' : 'light');

function updateButtons() {
  const next = current() === 'dark' ? 'light' : 'dark';
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-label', `Switch to ${next} mode`);
    btn.dataset.showing = current();
  });
}

document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage may be blocked (private mode); the toggle still works for this visit */
    }
    updateButtons();
  });
});

systemDark.addEventListener('change', updateButtons);
updateButtons();
