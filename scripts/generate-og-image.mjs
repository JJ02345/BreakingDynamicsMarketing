import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');

// Create OG image (1200x630) with Breaking Dynamics branding
const svgContent = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A0A0B"/>
      <stop offset="50%" stop-color="#111113"/>
      <stop offset="100%" stop-color="#0A0A0B"/>
    </linearGradient>
    <linearGradient id="orange-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B35"/>
      <stop offset="100%" stop-color="#FF8C5A"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B35" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#FF6B35" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg-gradient)"/>

  <!-- Decorative glow -->
  <ellipse cx="600" cy="315" rx="500" ry="300" fill="url(#glow)"/>

  <!-- Grid pattern overlay -->
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  </pattern>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- Logo icon -->
  <g transform="translate(520, 140)">
    <rect width="160" height="160" rx="32" fill="url(#orange-gradient)"/>
    <!-- B shape inside -->
    <path
      d="M40 35 L40 125 L85 125 C100 125 115 115 115 100 C115 90 108 82 95 80 C105 78 112 70 112 60 C112 48 100 40 85 40 L40 40 Z
         M55 52 L80 52 C88 52 95 56 95 62 C95 68 88 72 80 72 L55 72 L55 52 Z
         M55 84 L82 84 C92 84 100 88 100 98 C100 108 92 112 82 112 L55 112 L55 84 Z"
      fill="#0A0A0B"
      fill-rule="evenodd"
    />
    <!-- Arrow -->
    <path
      d="M95 72 L135 50 L135 62 L110 80 L135 98 L135 110 L95 88 L95 72 Z"
      fill="#0A0A0B"
    />
    <circle cx="130" cy="42" r="6" fill="#0A0A0B"/>
  </g>

  <!-- Title -->
  <text x="600" y="360" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="800" fill="white">
    Breaking Dynamics
  </text>

  <!-- Subtitle -->
  <text x="600" y="420" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="rgba(255,255,255,0.7)">
    LinkedIn Carousel Creator
  </text>

  <!-- Tagline -->
  <text x="600" y="480" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="#FF6B35">
    Erstelle professionelle Carousels in 2 Minuten
  </text>

  <!-- Bottom badge -->
  <rect x="500" y="530" width="200" height="40" rx="20" fill="rgba(255,107,53,0.15)" stroke="#FF6B35" stroke-width="1"/>
  <text x="600" y="557" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#FF6B35">
    100% KOSTENLOS
  </text>
</svg>
`;

async function generateOGImage() {
  await sharp(Buffer.from(svgContent))
    .png()
    .toFile(join(publicDir, 'og-image.png'));
  console.log('Generated og-image.png (1200x630)');
}

generateOGImage().catch(console.error);
