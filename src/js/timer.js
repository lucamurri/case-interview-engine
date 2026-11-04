/**
 * timer.js — the case timer.
 *
 * Shows elapsed time against the case's target (e.g. "4:05 / 20:00").
 * For screen-reader users it announces start, pause, each full minute and
 * when the target time is reached — not every second, which would be noisy.
 */
import { formatDuration } from './labels.js';

export class Timer {
  /**
   * @param {object} opts
   * @param {HTMLElement} opts.root  container with [data-time], [data-toggle], [data-reset], [data-announce]
   * @param {number} opts.targetMinutes
   */
  constructor({ root, targetMinutes }) {
    this.root = root;
    this.target = targetMinutes * 60;
    this.display = root.querySelector('[data-time]');
    this.toggleBtn = root.querySelector('[data-toggle]');
    this.resetBtn = root.querySelector('[data-reset]');
    this.live = root.querySelector('[data-announce]');
    this.elapsedBefore = 0; // seconds accumulated before the current run
    this.startedAt = null; // timestamp when the current run started
    this.lastMinute = 0;
    this.tick = null;

    this.toggleBtn.addEventListener('click', () => (this.running ? this.pause() : this.start()));
    this.resetBtn.addEventListener('click', () => this.reset());
    this.render();
  }

  get running() {
    return this.startedAt !== null;
  }

  /** Total elapsed seconds. */
  get seconds() {
    const current = this.running ? (Date.now() - this.startedAt) / 1000 : 0;
    return this.elapsedBefore + current;
  }

  start() {
    if (this.running) return;
    this.startedAt = Date.now();
    this.tick = setInterval(() => this.render(), 250);
    this.announce('Timer started');
    this.render();
  }

  pause() {
    if (!this.running) return;
    this.elapsedBefore = this.seconds;
    this.startedAt = null;
    clearInterval(this.tick);
    this.announce(`Timer paused at ${this.spoken(this.seconds)}`);
    this.render();
  }

  reset() {
    const wasRunning = this.running;
    clearInterval(this.tick);
    this.startedAt = null;
    this.elapsedBefore = 0;
    this.lastMinute = 0;
    this.announce('Timer reset');
    if (wasRunning) this.start();
    else this.render();
  }

  announce(text) {
    // Clearing first makes screen readers repeat identical messages.
    this.live.textContent = '';
    setTimeout(() => (this.live.textContent = text), 50);
  }

  spoken(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m} minute${m === 1 ? '' : 's'} ${s} second${s === 1 ? '' : 's'}`;
  }

  render() {
    const sec = this.seconds;
    this.display.textContent = `${formatDuration(sec)} / ${formatDuration(this.target)}`;
    this.root.classList.toggle('is-over', sec >= this.target);
    this.root.classList.toggle('is-running', this.running);
    this.toggleBtn.textContent = this.running ? 'Pause' : sec > 0 ? 'Resume' : 'Start';
    this.toggleBtn.setAttribute('aria-label', `${this.toggleBtn.textContent} timer`);

    const minute = Math.floor(sec / 60);
    if (this.running && minute > this.lastMinute) {
      this.lastMinute = minute;
      this.announce(minute * 60 === this.target ? `Target time of ${minute} minutes reached` : `${minute} minute${minute === 1 ? '' : 's'} elapsed`);
    }
  }
}
