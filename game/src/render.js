import { WIDTH, HEIGHT, PANELS, LIMITS, COLORS } from './config.js';
import { scenes } from './scenes.js';
import { paintScene } from './paint.js';
import { isMuted } from './audio.js';

const cache = new Map();
const font = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
function text(ctx, message, x, y, size = 14, color = COLORS.cream, weight = 500, align = 'left') {
  ctx.font = `${weight} ${size}px ${font}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(message, x, y);
}
function round(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath(); ctx.roundRect(x, y, width, height, radius);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}
function circle(ctx, x, y, radius, color, width = 0) {
  ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
  if (width) { ctx.lineWidth = width; ctx.strokeStyle = color; ctx.stroke(); }
  else { ctx.fillStyle = color; ctx.fill(); }
}
function button(ctx, state, label, action, x, y, width, height = 42, primary = false, disabled = false) {
  const pointer = state.pointer;
  const hover = pointer && pointer.x >= x && pointer.x <= x + width && pointer.y >= y && pointer.y <= y + height;
  round(ctx, x, y, width, height, height < 30 ? 5 : 9, disabled ? '#272c41' : primary ? hover ? '#ffdeb0' : COLORS.gold : hover ? '#42455d' : '#2c3149', primary ? '#ffe2a9' : '#55566d');
  text(ctx, label, x + width / 2, y + height / 2 + (height < 30 ? 4 : 5), height < 30 ? 10 : 13, disabled ? '#737b92' : primary ? COLORS.ink : COLORS.cream, 750, 'center');
  if (!disabled) state.buttons.push({ x, y, w: width, h: height, action });
}
function art(sceneIndex, right) {
  const key = `${sceneIndex}:${right}`;
  if (!cache.has(key)) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 600;
    paintScene(canvas.getContext('2d'), scenes[sceneIndex], right ? scenes[sceneIndex].differences.map(difference => difference.id) : []);
    cache.set(key, canvas);
  }
  return cache.get(key);
}
function emblem(ctx, x, y, scale = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  circle(ctx, 0, -2, 10, COLORS.gold);
  ctx.fillStyle = COLORS.ink; ctx.fillRect(-13, 2, 26, 2); ctx.fillRect(-13, 7, 26, 2);
  ctx.strokeStyle = COLORS.gold; ctx.lineWidth = 1.5;
  for (let index = 0; index < 5; index++) {
    const angle = Math.PI + index * Math.PI / 4;
    ctx.beginPath(); ctx.moveTo(Math.cos(angle) * 14, -2 + Math.sin(angle) * 14); ctx.lineTo(Math.cos(angle) * 18, -2 + Math.sin(angle) * 18); ctx.stroke();
  }
  ctx.restore();
}
function hud(ctx, state) {
  const scene = scenes[state.scene]; const total = scene.differences.length; const count = state.found.size;
  emblem(ctx, 42, 28, 0.8);
  text(ctx, 'SENJA SPLIT', 64, 29, 21, COLORS.cream, 850);
  text(ctx, 'A TOWN. TWO PICTURES. A CLOSER LOOK.', 65, 46, 8, COLORS.muted, 650);
  text(ctx, `0${state.scene + 1} / 03`, 344, 33, 12, COLORS.gold, 700);
  text(ctx, scene.name, 640, 25, 20, COLORS.cream, 700, 'center');
  text(ctx, `FOUND ${count} OF ${total} — ${total - count} LEFT`, 640, 45, 10, COLORS.gold, 750, 'center');
  scene.differences.forEach((difference, index) => {
    circle(ctx, 817 + index * 15, 29, 4, state.found.has(difference.id) ? COLORS.teal : '#44465e');
  });
  button(ctx, state, 'Ⅱ', 'pause', 1001, 16, 30, 27);
  text(ctx, `${Math.ceil(state.remaining)}s`, 1080, 35, 18, state.remaining < 15 ? '#ff8e88' : COLORS.gold, 650, 'center');
  text(ctx, 'SCORE', 1133, 29, 9, COLORS.muted, 650);
  text(ctx, String(state.score).padStart(4, '0'), 1251, 36, 25, COLORS.cream, 750, 'right');
  round(ctx, 28, 56, 1224, 4, 2, '#35374c');
  const urgent = state.remaining < 15;
  const alpha = urgent ? 0.65 + Math.sin(state.clock * 8) * 0.3 : 1;
  ctx.globalAlpha = alpha;
  round(ctx, 28, 56, Math.max(1, 1224 * state.remaining / LIMITS[state.scene]), 4, 2, urgent ? '#ff747e' : COLORS.teal);
  ctx.globalAlpha = 1;
}
function marker(ctx, difference, number) {
  const radius = Math.min(27, difference.r * 0.76);
  circle(ctx, difference.x, difference.y, radius + 1, '#28273bc9', 6);
  circle(ctx, difference.x, difference.y, radius, COLORS.gold, 3);
  circle(ctx, difference.x + radius * 0.74, difference.y - radius * 0.74, 8, COLORS.gold);
  text(ctx, String(number), difference.x + radius * 0.74, difference.y - radius * 0.74 + 3, 9, COLORS.ink, 800, 'center');
}
function effects(ctx, state, panelIndex) {
  for (const effect of state.effects) {
    const age = state.clock - effect.born; const progress = age / effect.duration;
    ctx.save(); ctx.globalAlpha = 1 - progress;
    if (effect.type === 'find') {
      circle(ctx, effect.x, effect.y, 20 + progress * 43, COLORS.gold, 3 - progress * 2);
      const labelY = Math.max(30, effect.y - 40 - progress * 28);
      text(ctx, `+${effect.earned}`, effect.x, labelY, 20, COLORS.cream, 850, 'center');
      if (effect.streak > 1) text(ctx, `${effect.streak} IN A ROW`, effect.x, labelY + 14, 8, COLORS.gold, 800, 'center');
      for (let index = 0; index < 12; index++) {
        const angle = index * Math.PI / 6;
        const radius = 23 + progress * (35 + index % 3 * 8);
        const x = effect.x + Math.cos(angle) * radius; const y = effect.y + Math.sin(angle) * radius + progress * progress * 20;
        circle(ctx, x, y, 2.5 * (1 - progress) + 0.5, index % 2 ? COLORS.gold : COLORS.cream);
      }
    }
    if (effect.type === 'hint') {
      const radius = effect.radius + Math.sin(progress * Math.PI * 5) * 5;
      circle(ctx, effect.x, effect.y, radius, COLORS.cream, 3);
      circle(ctx, effect.x, effect.y, radius + 7, '#ffdc975c', 2);
    }
    if (effect.type === 'miss' && effect.panel === panelIndex) {
      ctx.strokeStyle = '#ff6e82'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(effect.x - 9, effect.y - 9); ctx.lineTo(effect.x + 9, effect.y + 9); ctx.moveTo(effect.x + 9, effect.y - 9); ctx.lineTo(effect.x - 9, effect.y + 9); ctx.stroke();
      text(ctx, '−3s', effect.x, effect.y - 18 - progress * 12, 15, '#ffc0bb', 800, 'center');
    }
    ctx.restore();
  }
}
function panels(ctx, state) {
  const miss = state.effects.find(effect => effect.type === 'miss' && state.clock - effect.born < 0.25);
  PANELS.forEach((panel, index) => {
    ctx.save();
    const shake = miss ? Math.sin((state.clock - miss.born) * 100) * 3 : 0;
    ctx.translate(panel.x + shake, panel.y);
    round(ctx, -2, -2, 604, 604, 3, '#4c4560');
    ctx.drawImage(art(state.scene, Boolean(index)), 0, 0);
    let number = 0;
    for (const id of state.found) {
      const difference = scenes[state.scene].differences.find(candidate => candidate.id === id);
      if (difference) marker(ctx, difference, ++number);
    }
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 600, 600); ctx.clip(); effects(ctx, state, index); ctx.restore();
    ctx.restore();
    text(ctx, index ? 'SPOT THE CHANGES' : 'ORIGINAL', panel.x + 300, 684, 9, index ? COLORS.gold : COLORS.muted, 750, 'center');
  });
  circle(ctx, 640, 369, 6, COLORS.gold);
  text(ctx, '×', 640, 373, 11, COLORS.ink, 700, 'center');
}
function footer(ctx, state) {
  button(ctx, state, `HINT · ${state.hints} LEFT  [H]`, 'hint', 28, 693, 139, 23, false, !state.hints);
  button(ctx, state, 'RESTART  [R]', 'restart', 177, 693, 107, 23);
  button(ctx, state, `SOUND ${isMuted() ? 'OFF' : 'ON'}  [M]`, 'sound', 294, 693, 122, 23);
  const hintHover = state.pointer && state.pointer.x >= 28 && state.pointer.x <= 167 && state.pointer.y >= 693;
  text(ctx, hintHover ? 'A little nudge: −150 points · look for the soft pulse in both pictures' : 'Click a difference in either picture — a wrong click costs 3 seconds', 449, 709, 11, hintHover ? COLORS.gold : COLORS.muted);
  text(ctx, 'PAUSE  [P / ESC]', 1252, 709, 9, COLORS.muted, 650, 'right');
}
function star(ctx, x, y, radius, color) {
  ctx.beginPath();
  for (let index = 0; index < 10; index++) {
    const angle = -Math.PI / 2 + index * Math.PI / 5;
    const distance = index % 2 ? radius * 0.45 : radius;
    const px = x + Math.cos(angle) * distance; const py = y + Math.sin(angle) * distance;
    if (index) ctx.lineTo(px, py); else ctx.moveTo(px, py);
  }
  ctx.closePath(); ctx.fillStyle = color; ctx.fill();
}
function veil(ctx, state, width = 720, height = 420) {
  ctx.fillStyle = '#111629c9'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  const x = (WIDTH - width) / 2; const y = (HEIGHT - height) / 2;
  round(ctx, x, y, width, height, 18, '#20253a', '#797083');
  round(ctx, x + 8, y + 8, width - 16, height - 16, 12, null, '#3f4157');
  state.buttons = [];
}
function title(ctx, state) {
  veil(ctx, state, 768, 540);
  emblem(ctx, 640, 151, 1.65);
  text(ctx, 'A LITTLE OBSERVATION. A LITTLE ESCAPE.', 640, 203, 10, COLORS.gold, 750, 'center');
  text(ctx, 'SENJA SPLIT', 640, 267, 62, COLORS.cream, 850, 'center');
  text(ctx, 'S P O T  T H E  D I F F E R E N C E', 640, 300, 13, COLORS.coral, 700, 'center');
  text(ctx, 'Two pictures. 18 hidden differences. Click what changes.', 640, 345, 17, '#c6c5cf', 450, 'center');
  button(ctx, state, 'PLAY  →', 'play', 540, 377, 200, 52, true);
  scenes.forEach((scene, index) => {
    const x = 397 + index * 243;
    circle(ctx, x, 482, 16, '#34384f');
    text(ctx, `0${index + 1}`, x, 486, 10, COLORS.gold, 800, 'center');
    text(ctx, scene.name, x, 520, 14, COLORS.cream, 650, 'center');
    text(ctx, `${scene.differences.length} DIFFERENCES`, x, 542, 9, COLORS.muted, 700, 'center');
  });
  text(ctx, 'H  HINT     ·     P  PAUSE     ·     M  SOUND', 640, 590, 10, COLORS.muted, 600, 'center');
}
function victory(ctx, state) {
  veil(ctx, state, 740, 546);
  text(ctx, 'FROM DUSK TO DAWN', 640, 146, 11, COLORS.coral, 750, 'center');
  for (let index = 0; index < 3; index++) star(ctx, 560 + index * 80, index === 1 ? 208 : 221, index === 1 ? 35 : 27, index < state.stars ? COLORS.gold : '#45465b');
  text(ctx, 'Beautifully spotted.', 640, 302, 44, COLORS.cream, 800, 'center');
  text(ctx, 'ALL 18 DIFFERENCES FOUND', 640, 341, 15, COLORS.teal, 750, 'center');
  text(ctx, 'FINAL SCORE', 640, 390, 10, COLORS.muted, 700, 'center');
  text(ctx, state.score.toLocaleString('en-US'), 640, 450, 56, COLORS.gold, 800, 'center');
  text(ctx, 'You saw the little things. That’s where the magic lives.', 640, 484, 14, '#c6c5cf', 450, 'center');
  button(ctx, state, 'PLAY AGAIN  ↻', 'restartGame', 535, 517, 210, 48, true);
  text(ctx, 'S E N J A  S P L I T   /   T H A N K  Y O U  F O R  L O O K I N G', 640, 599, 9, COLORS.muted, 600, 'center');
}
function overlay(ctx, state) {
  if (state.mode === 'title') return title(ctx, state);
  if (state.mode === 'victory') return victory(ctx, state);
  if (state.mode === 'play') return;
  veil(ctx, state);
  if (state.mode === 'clear') {
    emblem(ctx, 640, 215, 1.4);
    text(ctx, `SCENE 0${state.scene + 1} COMPLETE`, 640, 265, 11, COLORS.teal, 750, 'center');
    text(ctx, 'A keen eye, a quiet moment.', 640, 319, 34, COLORS.cream, 750, 'center');
    text(ctx, scenes[state.scene].name, 640, 354, 17, COLORS.muted, 500, 'center');
    text(ctx, `${Math.floor(state.remaining)} SECONDS × 2   ·   TIME BONUS +${state.bonus}`, 640, 403, 14, COLORS.gold, 700, 'center');
    text(ctx, `SCORE  ${state.score}`, 640, 435, 13, COLORS.cream, 650, 'center');
    button(ctx, state, state.scene === 2 ? 'NEXT · THE FINALE  →' : 'NEXT SCENE  →', 'next', 520, 471, 240, 48, true);
  } else if (state.mode === 'timeout') {
    text(ctx, 'TIME’S UP', 640, 270, 46, COLORS.coral, 800, 'center');
    text(ctx, 'The town still has a few secrets.', 640, 315, 18, COLORS.cream, 500, 'center');
    text(ctx, `${state.found.size} OF ${scenes[state.scene].differences.length} DIFFERENCES FOUND`, 640, 364, 13, COLORS.gold, 700, 'center');
    text(ctx, 'Retry restores your score from the start of this scene.', 640, 401, 12, COLORS.muted, 450, 'center');
    button(ctx, state, 'RETRY SCENE', 'restart', 420, 453, 210, 48, true);
    button(ctx, state, 'RESTART GAME', 'restartGame', 650, 453, 210, 48);
  } else {
    text(ctx, 'TAKE A BREATH', 640, 261, 11, COLORS.gold, 750, 'center');
    text(ctx, 'PAUSED', 640, 329, 54, COLORS.cream, 800, 'center');
    text(ctx, 'Even the sunset can wait.', 640, 374, 18, COLORS.muted, 450, 'center');
    button(ctx, state, 'RESUME  →', 'pause', 530, 422, 220, 48, true);
    text(ctx, 'P OR ESC TO RETURN', 640, 504, 10, COLORS.muted, 650, 'center');
  }
}
export function render(ctx, state) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT); ctx.fillStyle = COLORS.ink; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  state.buttons = [];
  hud(ctx, state); panels(ctx, state); footer(ctx, state); overlay(ctx, state);
}
