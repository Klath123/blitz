
const cursor = document.getElementById('cursor');
const colors = ['#ff2d78', '#00f5ff', '#fff200', '#39ff14', '#bf00ff', '#ff6a00'];
let ci = 0;
// Go to 
//https://drive.google.com/drive/folders/1AOFzMitNnYNuD2IefJ9kUMIup-1Igdyc?usp=sharing
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

setInterval(() => {
  ci = (ci + 1) % colors.length;
  cursor.style.background = colors[ci];
  cursor.style.boxShadow  = `0 0 10px ${colors[ci]}, 0 0 20px ${colors[ci]}`;
}, 300);

// Build disco floor tiles dynamically
const floor = document.getElementById('floor');
const tileColors = [
  '#ff2d78', '#00f5ff', '#fff200',
  '#39ff14', '#bf00ff', '#ff6a00',
  '#ff0090', '#00fff7'
];

for (let i = 0; i < 60; i++) {
  const tile  = document.createElement('div');
  tile.className = 'tile';
  const color = tileColors[Math.floor(Math.random() * tileColors.length)];
  const delay = (Math.random() * 2).toFixed(2);
  const dur   = (1.2 + Math.random() * 2).toFixed(2);
  tile.style.cssText = `--tile-color:${color}; animation-delay:${delay}s; animation-duration:${dur}s;`;
  floor.appendChild(tile);
}