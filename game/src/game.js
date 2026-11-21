import { LIMITS, POINTS } from './config.js';
import { scenes } from './scenes.js';
import { sound, toggleMute } from './audio.js';

export function createGame() {
  return { mode: 'title', scene: 0, found: new Set(), score: 0, sceneStartScore: 0, streak: 0, hints: 3, remaining: LIMITS[0], effects: [], clock: 0, frozen: false, bonus: 0, stars: 0, buttons: [], pointer: null, lastTick: 120 };
}
export function startScene(state, index, retry = false) {
  if (retry) state.score = state.sceneStartScore;
  else state.sceneStartScore = state.score;
  Object.assign(state, { mode: 'play', scene: index, found: new Set(), streak: 0, hints: 3, remaining: LIMITS[index], effects: [], bonus: 0, frozen: false, lastTick: LIMITS[index] });
}
export function action(state, name) {
  if (name === 'sound') return toggleMute();
  if (name === 'play' || name === 'restartGame') { state.score = 0; startScene(state, 0); }
  if (name === 'restart' && state.mode !== 'title' && state.mode !== 'victory') startScene(state, state.scene, true);
  if (name === 'pause') {
    if (state.mode === 'play') state.mode = 'paused';
    else if (state.mode === 'paused') state.mode = 'play';
  }
  if (name === 'next' && state.mode === 'clear') {
    if (state.scene < 2) startScene(state, state.scene + 1);
    else { state.mode = 'victory'; state.stars = state.score >= 2600 ? 3 : state.score >= 1900 ? 2 : 1; sound('victory'); }
  }
  if (name === 'hint' && state.mode === 'play' && state.hints > 0) {
    const target = scenes[state.scene].differences.find(difference => !state.found.has(difference.id));
    if (!target) return;
    state.hints--;
    state.score = Math.max(0, state.score - POINTS.hint);
    state.effects.push({ type: 'hint', x: target.x, y: target.y, born: state.clock, duration: 1.2, radius: target.r });
    sound('hint');
  }
}
export function clickScene(state, point) {
  if (state.mode !== 'play') return;
  const target = scenes[state.scene].differences.find(difference => Math.hypot(point.x - difference.x, point.y - difference.y) <= difference.r);
  if (target && state.found.has(target.id)) return;
  if (target) {
    state.found.add(target.id);
    const earned = POINTS.find + Math.min(state.streak * POINTS.streak, POINTS.maxStreak);
    state.score += earned;
    state.streak++;
    state.effects.push({ type: 'find', x: target.x, y: target.y, earned, streak: state.streak, born: state.clock, duration: 0.9 });
    sound('find');
    if (state.found.size === scenes[state.scene].differences.length) {
      state.bonus = Math.floor(state.remaining) * POINTS.second;
      state.score += state.bonus;
      state.mode = 'clear';
      sound('clear');
    }
  } else {
    state.streak = 0;
    state.remaining = Math.max(0, state.remaining - POINTS.missSeconds);
    state.effects.push({ type: 'miss', ...point, born: state.clock, duration: 0.6 });
    sound('miss');
    if (state.remaining === 0) state.mode = 'timeout';
  }
}
export function update(state, delta) {
  if (state.frozen || state.mode === 'paused') return;
  state.clock += delta;
  state.effects = state.effects.filter(effect => state.clock - effect.born < effect.duration);
  if (state.mode !== 'play') return;
  state.remaining = Math.max(0, state.remaining - delta);
  const seconds = Math.ceil(state.remaining);
  if (seconds !== state.lastTick && seconds > 0 && seconds < 6) sound('tick');
  state.lastTick = seconds;
  if (state.remaining === 0) state.mode = 'timeout';
}
