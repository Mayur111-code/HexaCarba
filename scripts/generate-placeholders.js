const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'frontend/public/assets/images');

const placeholders = [
  { file: 'hero-bg.jpg', label: 'Hero Background', w: 1920, h: 1080 },
  { file: 'logo.png', label: 'HEXACARB Logo', w: 200, h: 80 },
  { file: 'features/energy-efficiency.jpg', label: 'Energy Efficiency', w: 400, h: 300 },
  { file: 'features/process-uptime.jpg', label: 'Process Uptime', w: 400, h: 300 },
  { file: 'features/productivity.jpg', label: 'Productivity', w: 400, h: 300 },
  { file: 'features/safety-compliance.jpg', label: 'Safety & Compliance', w: 400, h: 300 },
  { file: 'events/chemtech-expo.jpg', label: 'ChemTech Expo 2024', w: 600, h: 400 },
  { file: 'projects/acid-concentration.jpg', label: 'Acid Concentration System', w: 600, h: 400 },
  { file: 'blog/water-jet-system.jpg', label: 'Water Jet System', w: 600, h: 400 },
  { file: 'about/about-intro.jpg', label: 'About Hexacarb', w: 800, h: 600 },
  { file: 'about/facility.jpg', label: 'Manufacturing Facility', w: 1280, h: 720 },
  { file: 'about/director.jpg', label: 'Mr. Milind Sonawane', w: 600, h: 800 },
  { file: 'about/video-poster.jpg', label: 'Facility Video Poster', w: 1280, h: 720 },
  { file: 'products/products-intro.jpg', label: 'Products Introduction', w: 1200, h: 600 },
  ...Array.from({ length: 8 }, (_, i) => ({
    file: `clients/client-${String(i + 1).padStart(2, '0')}.png`,
    label: `Client Logo ${i + 1}`,
    w: 200,
    h: 100,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    file: `certificates/cert-${i + 1}.jpg`,
    label: `Certificate ${i + 1}`,
    w: 400,
    h: 280,
  })),
];

function makeSvg(label, w, h, filePath) {
  const shortPath = `/assets/images/${filePath.replace(/\\/g, '/')}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#172554"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" stroke-width="0.5" opacity="0.4"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <rect x="${w * 0.1}" y="${h * 0.15}" width="${w * 0.8}" height="${h * 0.7}" rx="12" fill="#1e3a5f" fill-opacity="0.3" stroke="#3b82f6" stroke-opacity="0.3" stroke-width="2"/>
  <text x="${w / 2}" y="${h / 2 - 10}" text-anchor="middle" fill="#60a5fa" font-family="system-ui,sans-serif" font-size="${Math.min(w, h) * 0.06}" font-weight="600">${label}</text>
  <text x="${w / 2}" y="${h / 2 + 20}" text-anchor="middle" fill="#64748b" font-family="system-ui,sans-serif" font-size="${Math.min(w, h) * 0.025}">Replace: ${shortPath}</text>
</svg>`;
}

for (const { file, label, w, h } of placeholders) {
  const fullPath = path.join(root, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath.replace(/\.(jpg|png)$/, '.svg'), makeSvg(label, w, h, file));
}

console.log(`Created ${placeholders.length} placeholder SVGs in ${root}`);
