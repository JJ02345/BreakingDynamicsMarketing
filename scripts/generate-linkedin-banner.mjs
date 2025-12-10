import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');

// LinkedIn Company Banner: 1128 x 191 pixels
const svgContent = `
<svg width="1128" height="191" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0A0A0B"/>
      <stop offset="50%" stop-color="#111113"/>
      <stop offset="100%" stop-color="#0A0A0B"/>
    </linearGradient>
    <linearGradient id="orange-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B35"/>
      <stop offset="100%" stop-color="#FF8C5A"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#FF6B35" stop-opacity="0"/>
      <stop offset="50%" stop-color="#FF6B35" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#FF6B35" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1128" height="191" fill="url(#bg-gradient)"/>

  <!-- Decorative glow -->
  <ellipse cx="564" cy="95" rx="400" ry="100" fill="url(#glow)"/>

  <!-- Grid pattern overlay -->
  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  </pattern>
  <rect width="1128" height="191" fill="url(#grid)"/>

  <!-- Left decorative elements - Abstract carousel slides -->
  <g transform="translate(60, 45)">
    <rect x="0" y="10" width="70" height="90" rx="8" fill="rgba(255,107,53,0.1)" stroke="rgba(255,107,53,0.3)" stroke-width="1"/>
    <rect x="20" y="5" width="70" height="90" rx="8" fill="rgba(255,107,53,0.15)" stroke="rgba(255,107,53,0.4)" stroke-width="1"/>
    <rect x="40" y="0" width="70" height="90" rx="8" fill="url(#orange-gradient)"/>
    <text x="75" y="50" text-anchor="middle" font-family="system-ui, sans-serif" font-size="32" font-weight="700" fill="#0A0A0B">1</text>
  </g>

  <!-- Main Title -->
  <text x="564" y="75" text-anchor="middle" font-family="system-ui, sans-serif" font-size="36" font-weight="800" fill="white">
    The LinkedIn Carousel Generator
  </text>

  <!-- Subtitle -->
  <text x="564" y="115" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" fill="rgba(255,255,255,0.7)">
    Professionelle Carousels in 2 Minuten - Kostenlos - Ohne Anmeldung
  </text>

  <!-- Launch Badge -->
  <rect x="454" y="130" width="220" height="32" rx="16" fill="rgba(255,107,53,0.15)" stroke="#FF6B35" stroke-width="1"/>
  <text x="564" y="152" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#FF6B35">
    LAUNCHING JANUARY 1ST, 2026
  </text>

  <!-- Right decorative elements - Feature pills -->
  <g transform="translate(900, 55)">
    <rect x="0" y="0" width="85" height="28" rx="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="42" y="19" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="rgba(255,255,255,0.6)">PDF Export</text>

    <rect x="0" y="35" width="85" height="28" rx="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="42" y="54" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="rgba(255,255,255,0.6)">1080x1080</text>

    <rect x="0" y="70" width="85" height="28" rx="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="42" y="89" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="rgba(255,255,255,0.6)">Drag and Drop</text>
  </g>

  <!-- Bottom accent line -->
  <rect x="0" y="188" width="1128" height="3" fill="url(#orange-gradient)"/>
</svg>
`;

async function generateLinkedInBanner() {
  await sharp(Buffer.from(svgContent))
    .png()
    .toFile(join(publicDir, 'linkedin-banner.png'));
  console.log('Generated linkedin-banner.png (1128x191)');
}

generateLinkedInBanner().catch(console.error);
