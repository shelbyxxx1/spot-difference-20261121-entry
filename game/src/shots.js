import { startScene } from './game.js';
export function applyShot(state, search) {
  const params = new URLSearchParams(search);
  if (params.get('seed') !== '1') return;
  const shot = params.get('shot');
  const presets = { cover: [0, [3, 5], 225, 83, 3], market: [1, [1], 725, 47, 2], rooftops: [2, [1, 3, 4], 1450, 31, 1] };
  if (presets[shot]) {
    const [scene, found, score, remaining, hints] = presets[shot];
    startScene(state, scene);
    Object.assign(state, { found: new Set(found), score, remaining, hints, frozen: true });
  } else if (shot === 'win') {
    startScene(state, 2);
    Object.assign(state, { mode: 'victory', found: new Set([1, 2, 3, 4, 5, 6, 7]), score: 2450, stars: 3, frozen: true });
  }
}
