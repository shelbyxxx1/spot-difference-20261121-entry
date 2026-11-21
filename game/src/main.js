import { createGame, update } from './game.js';
import { wireInput } from './input.js';
import { render } from './render.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = true;
const state = createGame();
applyShot(state, location.search);
wireInput(canvas, state);
render(context, state);
let previous = performance.now();
function frame(now) {
  update(state, Math.min((now - previous) / 1000, 0.1));
  previous = now;
  render(context, state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
