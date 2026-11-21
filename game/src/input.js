import { PANELS, SIZE } from './config.js';
import { action, clickScene } from './game.js';
import { unlock } from './audio.js';

export function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
}
export function wireInput(canvas, state) {
  canvas.addEventListener('pointermove', event => {
    state.pointer = canvasPoint(canvas, event);
    const overButton = state.buttons.some(button => contains(button, state.pointer));
    canvas.style.cursor = overButton ? 'pointer' : state.mode === 'play' ? 'crosshair' : 'default';
  });
  canvas.addEventListener('pointerleave', () => { state.pointer = null; });
  canvas.addEventListener('pointerdown', event => {
    unlock();
    const point = canvasPoint(canvas, event);
    const button = state.buttons.find(candidate => contains(candidate, point));
    if (button) { action(state, button.action); return; }
    if (state.mode !== 'play') return;
    for (let index = 0; index < PANELS.length; index++) {
      const panel = PANELS[index];
      if (point.x >= panel.x && point.x <= panel.x + SIZE && point.y >= panel.y && point.y <= panel.y + SIZE) {
        clickScene(state, { x: point.x - panel.x, y: point.y - panel.y, panel: index });
        return;
      }
    }
  });
  window.addEventListener('keydown', event => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    const commands = { h: 'hint', r: 'restart', m: 'sound', p: 'pause', escape: 'pause' };
    if (commands[key]) { event.preventDefault(); unlock(); action(state, commands[key]); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.mode === 'play' && !state.frozen) action(state, 'pause');
  });
}
function contains(button, point) {
  return point.x >= button.x && point.x <= button.x + button.w && point.y >= button.y && point.y <= button.y + button.h;
}
