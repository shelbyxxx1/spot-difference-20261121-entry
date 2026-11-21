import { mulberry32, range } from './random.js';

const palette = { ink: '#25243d', plum: '#65405a', coral: '#ec8d7f', peach: '#f7b18b', gold: '#ffcf83', teal: '#66b5b0', cream: '#ffe8bd', water: '#3d697d' };
function rect(ctx, x, y, width, height, color) { ctx.fillStyle = color; ctx.fillRect(x, y, width, height); }
function disk(ctx, x, y, radius, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill(); }
function ellipse(ctx, x, y, rx, ry, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
function polygon(ctx, points, color) {
  ctx.fillStyle = color; ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath(); ctx.fill();
}
function line(ctx, points, color, width = 2) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
}
function sky(ctx, top, middle, bottom) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, top); gradient.addColorStop(0.5, middle); gradient.addColorStop(1, bottom);
  rect(ctx, 0, 0, 600, 600, gradient);
}
function sun(ctx, x, y, radius) {
  disk(ctx, x, y, radius + 15, '#ffc68715');
  disk(ctx, x, y, radius + 7, '#ffd38e12');
  disk(ctx, x, y, radius, palette.gold);
}
function gull(ctx, x, y, scale = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.strokeStyle = palette.ink; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.beginPath();
  ctx.moveTo(-13, 2); ctx.quadraticCurveTo(-6, -7, 0, 0); ctx.quadraticCurveTo(6, -7, 13, 2); ctx.stroke(); ctx.restore();
}
function lantern(ctx, x, y, color, small = false) {
  const radius = small ? 7 : 19;
  disk(ctx, x, y, radius * 1.65, `${color}13`);
  ellipse(ctx, x, y, radius * 0.87, radius, color);
  ctx.save(); ctx.globalAlpha = 0.28;
  ellipse(ctx, x, y, radius * 0.43, radius, '#fff4ce'); ctx.restore();
  rect(ctx, x - radius * 0.46, y - radius - 2, radius * 0.92, 4, palette.plum);
  rect(ctx, x - radius * 0.4, y + radius - 1, radius * 0.8, 3, palette.plum);
  if (!small) line(ctx, [[x, y + radius + 2], [x, y + radius + 11]], color, 2);
}
function boat(ctx, x, y, scale, sail) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ellipse(ctx, 3, 43, 48, 5, '#273f563c');
  line(ctx, [[0, -40], [0, 35]], palette.ink, 3);
  polygon(ctx, [[-5, -34], [-5, 21], [-44, 21]], sail);
  polygon(ctx, [[5, -26], [5, 21], [35, 21]], palette.cream);
  line(ctx, [[-37, 16], [-9, 16]], '#ffffff42', 1);
  polygon(ctx, [[-48, 29], [43, 29], [27, 43], [-30, 43]], palette.ink);
  line(ctx, [[-39, 31], [35, 31]], palette.peach, 2);
  ctx.restore();
}
function cat(ctx, x, y, scale = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.strokeStyle = palette.ink; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath();
  ctx.moveTo(10, 18); ctx.bezierCurveTo(34, 25, 39, -2, 24, 4); ctx.stroke();
  ellipse(ctx, 0, 9, 12, 19, palette.ink);
  disk(ctx, -1, -12, 12, palette.ink);
  polygon(ctx, [[-12, -15], [-12, -29], [-1, -21], [8, -28], [10, -13]], palette.ink);
  disk(ctx, -5, -13, 1.5, palette.gold); disk(ctx, 3, -13, 1.5, palette.gold);
  ctx.restore();
}
function stars(ctx, random) {
  for (let index = 0; index < 65; index++) {
    const x = range(random, 12, 588); const y = range(random, 12, 230);
    disk(ctx, x, y, range(random, 0.6, 1.5), index % 4 ? '#fce4bc86' : '#fce4bccc');
  }
}
function crate(ctx, x, y, width, height) {
  rect(ctx, x, y, width, height, '#af725e');
  rect(ctx, x + 4, y + 4, width - 8, height - 8, '#c88c69');
  for (let offset = 10; offset < height; offset += 12) line(ctx, [[x + 5, y + offset], [x + width - 5, y + offset]], '#9a6154', 2);
  line(ctx, [[x + 6, y + 5], [x + width - 6, y + height - 5]], '#e4aa7e', 5);
  line(ctx, [[x + 6, y + height - 5], [x + width - 6, y + 5]], '#e4aa7e', 5);
  for (const side of [8, width - 8]) for (const edge of [8, height - 8]) disk(ctx, x + side, y + edge, 1.4, palette.ink);
}
function harbour(ctx, changed, random) {
  sky(ctx, '#645578', '#e99a91', '#f2ba91');
  sun(ctx, 250, 218, 65);
  line(ctx, [[29, 73], [112, 73]], '#f5b0a180', 8);
  line(ctx, [[60, 85], [153, 85]], '#f5b0a14d', 4);
  line(ctx, [[347, 126], [428, 126]], '#ffd2ae61', 5);
  polygon(ctx, [[0, 263], [55, 223], [106, 243], [174, 212], [238, 265], [320, 237], [389, 259], [455, 227], [600, 275], [600, 326], [0, 326]], '#837088');
  polygon(ctx, [[0, 288], [77, 270], [132, 289], [226, 258], [306, 294], [385, 268], [462, 289], [600, 260], [600, 331], [0, 331]], '#67637e');
  const water = ctx.createLinearGradient(0, 284, 0, 600); water.addColorStop(0, '#718998'); water.addColorStop(1, '#33576d');
  rect(ctx, 0, 290, 600, 310, water);
  for (let index = 0; index < 20; index++) {
    const y = 300 + index * 12; const half = 18 + index * 2.8;
    rect(ctx, 250 - half + range(random, -8, 8), y, half * 2, index % 2 ? 3 : 5, '#f6c19478');
  }
  for (let index = 0; index < 100; index++) {
    const x = range(random, 0, 600); const y = range(random, 306, 600);
    rect(ctx, x, y, range(random, 6, 30), 1.4, index % 3 ? '#b0b7b329' : '#263f592e');
  }
  polygon(ctx, [[428, 304], [454, 274], [483, 282], [512, 266], [550, 283], [576, 275], [600, 306], [600, 325], [435, 324]], '#3c435d');
  polygon(ctx, [[479, 282], [486, 172], [524, 172], [535, 282]], '#f5ceb0');
  polygon(ctx, [[514, 173], [524, 172], [535, 282], [516, 282]], '#bd8b8a');
  rect(ctx, 482, 194, 46, 12, '#c27879'); rect(ctx, 480, 240, 51, 12, '#c27879');
  rect(ctx, 484, 132, 42, 39, palette.ink);
  rect(ctx, 489, 138, 32, 25, changed.has(1) ? '#42435a' : palette.gold);
  if (!changed.has(1)) {
    disk(ctx, 505, 150, 28, '#ffd78b20');
    polygon(ctx, [[489, 143], [431, 124], [431, 170], [489, 158]], '#ffe3a118');
  }
  for (const x of [489, 503, 519]) rect(ctx, x, 135, 3, 31, palette.ink);
  polygon(ctx, [[475, 132], [505, 112], [536, 132]], palette.ink);
  rect(ctx, 477, 169, 57, 5, palette.ink);
  rect(ctx, 499, 263, 13, 20, '#62465c');
  gull(ctx, 220, 85, 0.8); if (!changed.has(2)) gull(ctx, 300, 110); gull(ctx, 360, 72, 0.75);
  boat(ctx, 150, 332, 1.1, changed.has(3) ? palette.teal : '#dc787e');
  boat(ctx, 301, 303, 0.64, '#f2bb9c');
  polygon(ctx, [[322, 242], [371, 211], [431, 239]], palette.ink);
  rect(ctx, 332, 242, 91, 102, '#8d626d');
  rect(ctx, 337, 248, 8, 96, '#b5807e');
  rect(ctx, 369, 277, 27, 67, '#463d57');
  rect(ctx, 347, 262, 14, 22, palette.gold);
  line(ctx, [[354, 263], [354, 283]], '#81616d', 2);
  line(ctx, [[334, 246], [420, 246]], '#d9a18a', 3);
  ctx.strokeStyle = palette.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(296, 166); ctx.quadraticCurveTo(383, 225, 474, 174); ctx.stroke();
  for (const [x, y] of [[314, 183], [351, 200], [390, 205], [430, 196], [461, 183]]) {
    if (x === 390 && changed.has(4)) continue;
    line(ctx, [[x, y - 6], [x, y]], palette.ink, 1.5); lantern(ctx, x, y + 2, palette.gold, true);
  }
  polygon(ctx, [[0, 514], [430, 372], [467, 390], [93, 600], [0, 600]], '#9b6c65');
  polygon(ctx, [[0, 553], [467, 390], [467, 410], [98, 600], [0, 600]], '#55465a');
  for (let index = 0; index < 13; index++) {
    const fraction = index / 13; const y = 514 - fraction * 142;
    line(ctx, [[fraction * 430, y], [93 + fraction * 374, 600 - fraction * 210]], '#d39b7b', 2);
  }
  for (const [x, y, height] of [[28, 537, 76], [216, 466, 61], [373, 408, 45], [455, 381, 40]]) {
    rect(ctx, x - 7, y - height, 14, height + 36, '#443e53');
    ellipse(ctx, x, y - height, 9, 4, '#d6a185');
    line(ctx, [[x - 9, y - height + 12], [x + 9, y - height + 12]], '#e1b08a', 4);
  }
  crate(ctx, 65, 518, 78, 58); crate(ctx, 141, 511, 61, 57); crate(ctx, 84, 491, 67, 45);
  if (!changed.has(5)) cat(ctx, 120, 468, 0.85);
  ellipse(ctx, 337, 488, 26, 11, '#25243d'); ellipse(ctx, 337, 485, 25, 9, '#ae8b78'); ellipse(ctx, 337, 485, 17, 5, '#473e52');
  line(ctx, [[324, 485], [300, 507], [308, 518], [327, 503]], '#c9ab8a', 3);
  polygon(ctx, [[488, 600], [552, 550], [600, 559], [600, 600]], '#303d53');
  for (const x of [534, 552, 572, 590]) line(ctx, [[x, 600], [x - 8, 560 - (x % 17)]], '#34495b', 3);
}
function awning(ctx, x, y, width, color) {
  polygon(ctx, [[x + 13, y], [x + width - 13, y], [x + width, y + 47], [x, y + 47]], '#f2c5a0');
  for (let index = 0; index < 8; index += 2) {
    const step = width / 8;
    polygon(ctx, [[x + 13 + index * (width - 26) / 8, y], [x + 13 + (index + 1) * (width - 26) / 8, y], [x + (index + 1) * step, y + 47], [x + index * step, y + 47]], color);
  }
  for (let index = 0; index < 8; index++) {
    rect(ctx, x + index * width / 8, y + 46, width / 8, 9, index % 2 ? '#f2c5a0' : color);
    ellipse(ctx, x + (index + 0.5) * width / 8, y + 54, width / 16, 7, index % 2 ? '#f2c5a0' : color);
  }
  line(ctx, [[x, y + 46], [x + width, y + 46]], '#393650', 2);
}
function jar(ctx, x, y, color) {
  ctx.fillStyle = '#a7d6cd65'; ctx.beginPath(); ctx.roundRect(x - 11, y - 16, 22, 32, 5); ctx.fill();
  rect(ctx, x - 9, y - 1, 18, 15, color); rect(ctx, x - 12, y - 21, 24, 6, '#d3ae82');
  line(ctx, [[x - 6, y - 10], [x - 6, y + 6]], '#fff0cf80', 2);
  rect(ctx, x - 6, y + 1, 12, 7, '#ffdfb8a0');
}
function market(ctx, changed, random) {
  sky(ctx, '#272f55', '#4b4669', '#a77383'); stars(ctx, random);
  disk(ctx, 520, 90, 43, '#ffdcaa08'); disk(ctx, 520, 90, 34, '#ffdcaa0c');
  disk(ctx, 520, 90, 26, '#ffe1ad');
  if (changed.has(1)) disk(ctx, 532, 82, 24, '#30365a');
  else { disk(ctx, 510, 85, 5, '#e4bd9f66'); disk(ctx, 527, 100, 7, '#e4bd9f55'); }
  polygon(ctx, [[0, 190], [38, 190], [38, 166], [81, 166], [81, 203], [118, 203], [118, 181], [169, 181], [169, 212], [230, 212], [230, 177], [274, 177], [274, 205], [336, 205], [336, 166], [373, 166], [373, 193], [440, 193], [440, 169], [475, 169], [475, 213], [600, 213], [600, 445], [0, 445]], '#353550');
  for (const x of [21, 64, 135, 249, 352, 453, 570]) {
    rect(ctx, x, 228, 9, 17, '#f7bc8b80'); rect(ctx, x + 15, 260, 8, 14, '#f7bc8b4d');
  }
  rect(ctx, 0, 389, 600, 211, '#49425b');
  polygon(ctx, [[258, 401], [333, 401], [492, 600], [76, 600]], '#776073');
  for (let index = 0; index < 45; index++) {
    const x = range(random, 0, 600); const y = range(random, 450, 600);
    line(ctx, [[x, y], [x + range(random, 12, 40), y]], '#c99a881b', 2);
  }
  rect(ctx, 25, 243, 14, 266, '#292d47'); rect(ctx, 270, 244, 12, 266, '#292d47');
  rect(ctx, 42, 292, 220, 155, '#493a51');
  disk(ctx, 180, 323, 21, '#282b43');
  ellipse(ctx, 180, 378, 35, 47, '#282b43');
  if (!changed.has(2)) {
    ellipse(ctx, 180, 302, 30, 6, '#d4a280');
    polygon(ctx, [[162, 299], [166, 282], [192, 282], [198, 299]], '#d4a280');
    rect(ctx, 164, 294, 32, 5, '#9b6970');
  }
  line(ctx, [[157, 365], [131, 390], [110, 388]], '#282b43', 13);
  rect(ctx, 27, 410, 255, 85, '#9e646b');
  rect(ctx, 25, 404, 260, 15, '#ddaa89');
  for (let index = 0; index < 9; index++) rect(ctx, 39 + index * 27, 427, 3, 57, '#7a4e61');
  rect(ctx, 67, 437, 165, 30, '#684658');
  ctx.fillStyle = '#f4c69b'; ctx.font = 'bold 15px system-ui'; ctx.textAlign = 'center'; ctx.fillText('S E N J A  T E A', 150, 458);
  for (const x of [73, 106, 237]) { rect(ctx, x, 384, 18, 19, '#d9ba95'); ellipse(ctx, x + 9, 384, 9, 3, '#493a51'); }
  awning(ctx, 17, 227, 277, '#b76c7e');
  rect(ctx, 367, 254, 207, 152, '#302e48');
  rect(ctx, 374, 262, 8, 204, '#a37878'); rect(ctx, 560, 262, 8, 204, '#a37878');
  awning(ctx, 353, 212, 234, '#558e93');
  rect(ctx, 382, 349, 178, 9, '#d19b7c'); rect(ctx, 382, 302, 178, 7, '#d19b7c');
  for (const [x, y, color] of [[401, 283, '#ce877b'], [439, 283, '#7bb4a3'], [480, 283, '#dab36b'], [530, 283, '#ce877b'], [402, 330, '#dab36b'], [445, 330, '#7bb4a3'], [490, 330, '#ce877b'], [535, 330, '#dab36b']]) {
    if (x === 445 && changed.has(4)) continue;
    jar(ctx, x, y, color);
  }
  rect(ctx, 293, 460, 282, 24, '#b38a77'); rect(ctx, 310, 483, 14, 117, '#292d47'); rect(ctx, 546, 483, 14, 117, '#292d47');
  polygon(ctx, [[297, 459], [559, 459], [567, 526], [533, 518], [511, 529], [488, 521], [464, 530], [438, 519], [413, 526], [388, 520], [361, 529], [337, 517], [304, 524]], '#628e94');
  for (const x of [315, 367, 419, 471, 523]) line(ctx, [[x, 466], [x + 7, 517]], '#9cc1b55c', 3);
  for (const [x, y] of [[362, 445], [391, 445], [420, 445], [449, 445], [377, 421], [406, 420], [435, 421], [392, 397], [421, 397], [406, 375], [330, 445]]) {
    if (x === 330 && changed.has(3)) continue;
    disk(ctx, x, y, 13, '#ed9c54'); disk(ctx, x - 3, y - 4, 4, '#ffc77d');
    line(ctx, [[x, y - 12], [x + 5, y - 15]], '#687e63', 2);
  }
  rect(ctx, 480, 422, 68, 32, '#b78d76'); ellipse(ctx, 514, 422, 34, 8, '#e1b58b');
  for (let index = 0; index < 7; index++) line(ctx, [[485, 428 + index * 3], [543, 428 + index * 3]], '#865e5e', 1);
  ctx.strokeStyle = '#222b45'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 93); ctx.quadraticCurveTo(275, 220, 600, 101); ctx.stroke();
  for (const [x, y] of [[26, 105], [82, 125], [137, 140], [194, 148], [250, 150], [307, 152], [365, 147], [422, 137], [479, 126], [536, 115], [590, 103]]) {
    if (x === 250 && changed.has(5)) continue;
    line(ctx, [[x, y], [x, y + 5]], palette.ink, 1); disk(ctx, x, y + 7, 4, '#ffdb94'); disk(ctx, x, y + 7, 9, '#ffdb9412');
  }
  for (const [x, y] of [[90, 210], [310, 229], [469, 184]]) {
    line(ctx, [[x, y - 64], [x, y - 21]], '#252b46', 2);
    lantern(ctx, x, y, x === 90 && changed.has(6) ? '#ed91b6' : '#f8bb74');
  }
  polygon(ctx, [[0, 178], [26, 155], [81, 155], [106, 178]], '#242b44'); cat(ctx, 54, 134, 0.62);
  ellipse(ctx, 72, 561, 30, 10, '#252b44'); rect(ctx, 47, 531, 50, 30, '#686b70'); ellipse(ctx, 72, 531, 25, 7, '#97957e');
  for (const [x, y] of [[66, 526], [77, 514], [85, 532]]) {
    line(ctx, [[72, 540], [x, y - 22]], '#79a393', 3); ellipse(ctx, x - 5, y - 14, 9, 4, '#79a393'); ellipse(ctx, x + 4, y - 23, 8, 4, '#79a393');
  }
}
function windowLight(ctx, x, y, lit = true) {
  rect(ctx, x - 17, y - 23, 34, 46, '#292c45');
  rect(ctx, x - 13, y - 19, 26, 38, lit ? '#ffd089' : '#44425a');
  line(ctx, [[x, y - 19], [x, y + 19]], '#7b5969', 3);
  line(ctx, [[x - 13, y], [x + 13, y]], '#7b5969', 3);
  rect(ctx, x - 21, y + 22, 42, 5, '#b5887d');
}
function smoke(ctx, x, y) {
  ctx.strokeStyle = '#ffe3c080'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath();
  ctx.moveTo(x, y + 29); ctx.bezierCurveTo(x - 24, y + 10, x + 25, y, x, y - 16); ctx.bezierCurveTo(x - 11, y - 24, x - 3, y - 30, x + 7, y - 33); ctx.stroke();
}
function shirt(ctx, x, y, color) {
  polygon(ctx, [[x - 11, y - 20], [x - 26, y - 9], [x - 19, y + 1], [x - 12, y - 3], [x - 13, y + 25], [x + 13, y + 25], [x + 12, y - 3], [x + 19, y + 1], [x + 26, y - 9], [x + 11, y - 20], [x + 5, y - 15], [x - 5, y - 15]], color);
  line(ctx, [[x - 5, y - 13], [x + 5, y - 13]], '#7c657c50', 2);
  rect(ctx, x - 14, y - 23, 4, 9, '#805d6b'); rect(ctx, x + 10, y - 23, 4, 9, '#805d6b');
}
function pigeon(ctx, x, y) {
  ellipse(ctx, x, y - 1, 10, 7, '#45415c'); disk(ctx, x + 6, y - 9, 6, '#45415c');
  polygon(ctx, [[x + 11, y - 10], [x + 17, y - 8], [x + 11, y - 7]], '#dbab86');
  polygon(ctx, [[x - 6, y], [x - 17, y - 5], [x - 13, y + 5]], '#45415c');
  line(ctx, [[x - 2, y + 5], [x - 2, y + 11]], '#45415c', 2); line(ctx, [[x + 4, y + 5], [x + 4, y + 11]], '#45415c', 2);
  disk(ctx, x + 8, y - 10, 1, '#f5c799');
}
function rooftops(ctx, changed, random) {
  sky(ctx, '#b27894', '#efa68f', '#f7d59a');
  sun(ctx, 330, 486, 82);
  for (const [x, y, width] of [[32, 83, 87], [207, 119, 71], [415, 49, 107], [371, 329, 83]]) {
    line(ctx, [[x, y], [x + width, y]], '#ffe1b342', 6); line(ctx, [[x + 18, y + 9], [x + width + 30, y + 9]], '#ffe1b329', 3);
  }
  if (!changed.has(7)) {
    line(ctx, [[297, 477], [362, 477]], '#df9a918c', 8);
    line(ctx, [[308, 486], [369, 486]], '#df9a91b8', 6);
  }
  polygon(ctx, [[0, 504], [41, 470], [81, 495], [112, 474], [164, 506], [202, 484], [251, 510], [300, 505], [344, 519], [391, 494], [436, 511], [478, 479], [540, 505], [600, 477], [600, 600], [0, 600]], '#b47c86');
  polygon(ctx, [[0, 546], [83, 514], [156, 549], [228, 520], [265, 545], [341, 533], [418, 556], [483, 521], [600, 549], [600, 600], [0, 600]], '#8e6b80');
  for (let index = 0; index < 35; index++) {
    const x = range(random, 5, 595); const y = range(random, 549, 600);
    rect(ctx, x, y, 5, 9, index % 3 ? '#efbd9566' : '#5f5770');
  }
  rect(ctx, 0, 412, 215, 188, '#70536d');
  polygon(ctx, [[0, 415], [83, 353], [220, 410]], '#3f3b59');
  line(ctx, [[0, 415], [83, 353], [220, 410]], '#9f7080', 5);
  rect(ctx, 114, 208, 40, 169, '#835f75'); rect(ctx, 107, 207, 54, 14, '#4d425e');
  rect(ctx, 119, 230, 12, 6, '#ac7e84'); rect(ctx, 135, 248, 16, 6, '#ac7e84'); rect(ctx, 118, 274, 17, 6, '#ac7e84');
  if (!changed.has(1)) smoke(ctx, 140, 170);
  for (const x of [43, 112, 181]) { windowLight(ctx, x, 476); windowLight(ctx, x, 560, x !== 112); }
  line(ctx, [[36, 330], [24, 438]], '#393a55', 7); line(ctx, [[116, 330], [139, 438]], '#393a55', 7);
  line(ctx, [[31, 392], [131, 392]], '#393a55', 4); line(ctx, [[35, 337], [130, 423]], '#393a55', 3);
  rect(ctx, 29, 263, 95, 67, '#5c6573'); ellipse(ctx, 77, 329, 48, 11, '#45495f');
  polygon(ctx, [[22, 263], [77, 239], [131, 263]], '#3b3b56');
  ellipse(ctx, 77, 263, 49, 6, '#9a8b8c');
  for (const x of [43, 65, 87, 109]) line(ctx, [[x, 270], [x, 322]], '#a4a7a05c', 2);
  line(ctx, [[30, 281], [122, 281]], '#323c54', 4); line(ctx, [[29, 314], [124, 314]], '#323c54', 4);
  if (!changed.has(5)) {
    line(ctx, [[82, 332], [82, 430]], '#d9b79b', 3); line(ctx, [[98, 332], [98, 430]], '#d9b79b', 3);
    for (let y = 339; y <= 425; y += 12) line(ctx, [[82, y], [98, y]], '#d9b79b', 2);
  }
  rect(ctx, 398, 356, 202, 244, '#73546e');
  polygon(ctx, [[382, 358], [486, 292], [600, 349], [600, 370], [394, 370]], '#3e3b56');
  line(ctx, [[385, 357], [486, 292], [600, 349]], '#a17180', 5);
  for (let index = 0; index < 6; index++) line(ctx, [[418 + index * 21, 351 - index * 12], [448 + index * 24, 365]], '#726077', 1);
  windowLight(ctx, 430, 420); windowLight(ctx, 480, 420, !changed.has(4)); windowLight(ctx, 549, 420);
  windowLight(ctx, 430, 513, false); windowLight(ctx, 480, 513); windowLight(ctx, 549, 513);
  rect(ctx, 568, 260, 22, 77, '#72516c'); rect(ctx, 563, 255, 32, 11, '#403b56'); smoke(ctx, 580, 219);
  line(ctx, [[540, 209], [540, 319]], '#45405a', 4);
  line(ctx, [[515, 232], [565, 219]], '#45405a', 3); line(ctx, [[519, 257], [561, 244]], '#45405a', 3);
  for (const [x, y] of [[516, 232], [532, 227], [550, 223], [564, 219], [521, 256], [542, 250], [559, 245]]) line(ctx, [[x, y - 9], [x, y + 9]], '#45405a', 2);
  if (!changed.has(6)) disk(ctx, 540, 200, 7, '#45405a');
  ctx.strokeStyle = '#4d415a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(154, 215); ctx.quadraticCurveTo(306, 257, 428, 215); ctx.stroke();
  shirt(ctx, 222, 253, '#8cc6bd'); shirt(ctx, 300, 260, changed.has(2) ? '#efbd65' : '#fff0d4'); shirt(ctx, 375, 249, '#c77886');
  ctx.strokeStyle = '#4b415c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 126); ctx.quadraticCurveTo(300, 190, 600, 129); ctx.stroke();
  pigeon(ctx, 350, 147); if (!changed.has(3)) pigeon(ctx, 420, 140); pigeon(ctx, 482, 132);
  polygon(ctx, [[170, 600], [212, 566], [250, 587], [277, 568], [328, 600]], '#3c3b56');
  rect(ctx, 252, 564, 14, 30, '#3c3b56'); rect(ctx, 248, 561, 22, 6, '#3c3b56');
  line(ctx, [[0, 593], [159, 593]], '#a07783', 5);
}
export function paintScene(ctx, scene, appliedDifferenceIds) {
  ctx.save();
  const changed = new Set(appliedDifferenceIds);
  const random = mulberry32(scene.seed);
  [harbour, market, rooftops][scene.seed === 41 ? 0 : scene.seed === 82 ? 1 : 2](ctx, changed, random);
  ctx.restore();
}
