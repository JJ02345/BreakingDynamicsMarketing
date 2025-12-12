// Background Styles for Carousel
// Premium gradient and solid backgrounds

import type { BackgroundType } from '../types';

export interface BackgroundStyle {
  name: string;
  nameDE: string;
  category: 'solid' | 'gradient' | 'mesh';
  style: {
    background?: string;
    backgroundColor?: string;
  };
}

export const BACKGROUND_STYLES: Record<string, BackgroundStyle> = {
  // === SOLIDS ===
  'solid-dark': {
    name: 'Dark',
    nameDE: 'Dunkel',
    category: 'solid',
    style: { backgroundColor: '#0A0A0B' }
  },
  'solid-black': {
    name: 'Black',
    nameDE: 'Schwarz',
    category: 'solid',
    style: { backgroundColor: '#000000' }
  },
  'solid-charcoal': {
    name: 'Charcoal',
    nameDE: 'Anthrazit',
    category: 'solid',
    style: { backgroundColor: '#1A1A1D' }
  },
  'solid-navy': {
    name: 'Navy',
    nameDE: 'Marine',
    category: 'solid',
    style: { backgroundColor: '#0d1b2a' }
  },
  'solid-white': {
    name: 'White',
    nameDE: 'Weiß',
    category: 'solid',
    style: { backgroundColor: '#FFFFFF' }
  },

  // === PREMIUM GRADIENTS ===
  'gradient-orange': {
    name: 'Sunset',
    nameDE: 'Sonnenuntergang',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }
  },
  'gradient-fire': {
    name: 'Fire',
    nameDE: 'Feuer',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a0a0a 0%, #2d1010 40%, #4a1515 70%, #1a0a0a 100%)' }
  },
  'gradient-dark': {
    name: 'Midnight',
    nameDE: 'Mitternacht',
    category: 'gradient',
    style: { background: 'linear-gradient(180deg, #0A0A0B 0%, #1a1a2e 100%)' }
  },
  'gradient-purple': {
    name: 'Cosmic',
    nameDE: 'Kosmisch',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 50%, #1a1a2e 100%)' }
  },
  'gradient-aurora': {
    name: 'Aurora',
    nameDE: 'Polarlicht',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #0a1628 0%, #1a2744 30%, #2d1b4e 70%, #0a1628 100%)' }
  },
  'gradient-blue': {
    name: 'Ocean',
    nameDE: 'Ozean',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #0a192f 0%, #172a45 50%, #0a192f 100%)' }
  },
  'gradient-cyan': {
    name: 'Ice',
    nameDE: 'Eis',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #0a1a2e 0%, #0d3b4a 50%, #0a1a2e 100%)' }
  },
  'gradient-green': {
    name: 'Forest',
    nameDE: 'Wald',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #0a1a0a 0%, #1a2f1a 50%, #0a1a0a 100%)' }
  },
  'gradient-emerald': {
    name: 'Emerald',
    nameDE: 'Smaragd',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #0a1a14 0%, #0d3d2e 50%, #0a1a14 100%)' }
  },
  'gradient-gold': {
    name: 'Gold',
    nameDE: 'Gold',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a1508 0%, #2d2510 50%, #1a1508 100%)' }
  },
  'gradient-rose': {
    name: 'Rose',
    nameDE: 'Rose',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a0a14 0%, #3d1a2e 50%, #1a0a14 100%)' }
  },

  // === MESH GRADIENTS (Premium) ===
  'mesh-vibrant': {
    name: 'Vibrant',
    nameDE: 'Lebhaft',
    category: 'mesh',
    style: { background: 'radial-gradient(at 20% 80%, #2d1b4e 0%, transparent 50%), radial-gradient(at 80% 20%, #1a2f1a 0%, transparent 50%), radial-gradient(at 50% 50%, #1a1a2e 0%, #0A0A0B 100%)' }
  },
  'mesh-sunset': {
    name: 'Warm',
    nameDE: 'Warm',
    category: 'mesh',
    style: { background: 'radial-gradient(at 0% 100%, #4a1515 0%, transparent 50%), radial-gradient(at 100% 0%, #2d2510 0%, transparent 50%), radial-gradient(at 50% 50%, #1a1a2e 0%, #0A0A0B 100%)' }
  },
  'mesh-cool': {
    name: 'Cool',
    nameDE: 'Kühl',
    category: 'mesh',
    style: { background: 'radial-gradient(at 0% 0%, #172a45 0%, transparent 50%), radial-gradient(at 100% 100%, #0d3d2e 0%, transparent 50%), radial-gradient(at 50% 50%, #0a192f 0%, #0A0A0B 100%)' }
  },
  'mesh-neon': {
    name: 'Neon',
    nameDE: 'Neon',
    category: 'mesh',
    style: { background: 'radial-gradient(at 30% 70%, #ff006620 0%, transparent 50%), radial-gradient(at 70% 30%, #00ff8820 0%, transparent 50%), radial-gradient(at 50% 50%, #0A0A0B 0%, #0A0A0B 100%)' }
  },
  'mesh-galaxy': {
    name: 'Galaxy',
    nameDE: 'Galaxie',
    category: 'mesh',
    style: { background: 'radial-gradient(at 10% 90%, #1a0a3d 0%, transparent 40%), radial-gradient(at 90% 10%, #0a1a3d 0%, transparent 40%), radial-gradient(at 50% 50%, #0d0d1a 0%, #050508 100%)' }
  },
  'mesh-tropical': {
    name: 'Tropical',
    nameDE: 'Tropisch',
    category: 'mesh',
    style: { background: 'radial-gradient(at 0% 50%, #0d3d2e 0%, transparent 50%), radial-gradient(at 100% 50%, #2d2510 0%, transparent 50%), radial-gradient(at 50% 100%, #0a1a2e 0%, #0A0A0B 100%)' }
  },

  // === NEW PREMIUM GRADIENTS ===
  'gradient-blood': {
    name: 'Blood Moon',
    nameDE: 'Blutmond',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a0505 0%, #3d0a0a 30%, #5c1010 60%, #1a0505 100%)' }
  },
  'gradient-midnight-blue': {
    name: 'Midnight Blue',
    nameDE: 'Mitternachtsblau',
    category: 'gradient',
    style: { background: 'linear-gradient(180deg, #020111 0%, #0a1628 40%, #162a45 70%, #020111 100%)' }
  },
  'gradient-violet': {
    name: 'Violet Dream',
    nameDE: 'Violetter Traum',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #150520 0%, #2a0a40 50%, #150520 100%)' }
  },
  'gradient-teal': {
    name: 'Teal Depths',
    nameDE: 'Petrol-Tiefe',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #051515 0%, #0a2e2e 50%, #051515 100%)' }
  },
  'gradient-copper': {
    name: 'Copper',
    nameDE: 'Kupfer',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a100a 0%, #3d2010 50%, #1a100a 100%)' }
  },
  'gradient-silver': {
    name: 'Silver',
    nameDE: 'Silber',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 30%, #3a3a3a 60%, #1a1a1a 100%)' }
  },
  'gradient-wine': {
    name: 'Wine',
    nameDE: 'Wein',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a0510 0%, #3d0a20 50%, #1a0510 100%)' }
  },
  'gradient-ocean-deep': {
    name: 'Deep Ocean',
    nameDE: 'Tiefer Ozean',
    category: 'gradient',
    style: { background: 'linear-gradient(180deg, #000510 0%, #001030 30%, #002050 60%, #000510 100%)' }
  },
  'gradient-sunset-orange': {
    name: 'Sunset Orange',
    nameDE: 'Sonnenuntergang Orange',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a0a05 0%, #3d1a0a 30%, #5c2a10 60%, #1a0a05 100%)' }
  },
  'gradient-northern-lights': {
    name: 'Northern Lights',
    nameDE: 'Nordlichter',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #0a1020 0%, #102030 25%, #0a3020 50%, #102030 75%, #0a1020 100%)' }
  },

  // === NEW SOLID COLORS ===
  'solid-slate': {
    name: 'Slate',
    nameDE: 'Schiefer',
    category: 'solid',
    style: { backgroundColor: '#1e293b' }
  },
  'solid-zinc': {
    name: 'Zinc',
    nameDE: 'Zink',
    category: 'solid',
    style: { backgroundColor: '#27272a' }
  },
  'solid-stone': {
    name: 'Stone',
    nameDE: 'Stein',
    category: 'solid',
    style: { backgroundColor: '#292524' }
  },
  'solid-neutral': {
    name: 'Neutral',
    nameDE: 'Neutral',
    category: 'solid',
    style: { backgroundColor: '#262626' }
  },
  'solid-deep-purple': {
    name: 'Deep Purple',
    nameDE: 'Tiefviolett',
    category: 'solid',
    style: { backgroundColor: '#1e1033' }
  },
  'solid-deep-blue': {
    name: 'Deep Blue',
    nameDE: 'Tiefblau',
    category: 'solid',
    style: { backgroundColor: '#0c1929' }
  },
  'solid-deep-green': {
    name: 'Deep Green',
    nameDE: 'Tiefgrün',
    category: 'solid',
    style: { backgroundColor: '#0a1a12' }
  },
  'solid-cream': {
    name: 'Cream',
    nameDE: 'Creme',
    category: 'solid',
    style: { backgroundColor: '#faf7f2' }
  },
  'solid-light-gray': {
    name: 'Light Gray',
    nameDE: 'Hellgrau',
    category: 'solid',
    style: { backgroundColor: '#f5f5f5' }
  }
};

// PDF-optimized backgrounds (simplified for html2canvas)
export const PDF_BACKGROUND_FALLBACKS: Record<string, string> = {
  // Solids
  'solid-dark': '#0A0A0B',
  'solid-black': '#000000',
  'solid-charcoal': '#1A1A1D',
  'solid-navy': '#0d1b2a',
  'solid-white': '#FFFFFF',
  'solid-slate': '#1e293b',
  'solid-zinc': '#27272a',
  'solid-stone': '#292524',
  'solid-neutral': '#262626',
  'solid-deep-purple': '#1e1033',
  'solid-deep-blue': '#0c1929',
  'solid-deep-green': '#0a1a12',
  'solid-cream': '#faf7f2',
  'solid-light-gray': '#f5f5f5',
  // Original gradients
  'gradient-orange': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
  'gradient-fire': 'linear-gradient(135deg, #1a0a0a 0%, #2d1010 50%, #4a1515 100%)',
  'gradient-dark': 'linear-gradient(180deg, #0A0A0B 0%, #1a1a2e 100%)',
  'gradient-purple': 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 50%, #1a1a2e 100%)',
  'gradient-aurora': 'linear-gradient(135deg, #0a1628 0%, #1a2744 50%, #2d1b4e 100%)',
  'gradient-blue': 'linear-gradient(135deg, #0a192f 0%, #172a45 50%, #0a192f 100%)',
  'gradient-cyan': 'linear-gradient(135deg, #0a1a2e 0%, #0d3b4a 50%, #0a1a2e 100%)',
  'gradient-green': 'linear-gradient(135deg, #0a1a0a 0%, #1a2f1a 50%, #0a1a0a 100%)',
  'gradient-emerald': 'linear-gradient(135deg, #0a1a14 0%, #0d3d2e 50%, #0a1a14 100%)',
  'gradient-gold': 'linear-gradient(135deg, #1a1508 0%, #2d2510 50%, #1a1508 100%)',
  'gradient-rose': 'linear-gradient(135deg, #1a0a14 0%, #3d1a2e 50%, #1a0a14 100%)',
  // New gradients
  'gradient-blood': 'linear-gradient(135deg, #1a0505 0%, #3d0a0a 50%, #5c1010 100%)',
  'gradient-midnight-blue': 'linear-gradient(180deg, #020111 0%, #0a1628 50%, #162a45 100%)',
  'gradient-violet': 'linear-gradient(135deg, #150520 0%, #2a0a40 50%, #150520 100%)',
  'gradient-teal': 'linear-gradient(135deg, #051515 0%, #0a2e2e 50%, #051515 100%)',
  'gradient-copper': 'linear-gradient(135deg, #1a100a 0%, #3d2010 50%, #1a100a 100%)',
  'gradient-silver': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #3a3a3a 100%)',
  'gradient-wine': 'linear-gradient(135deg, #1a0510 0%, #3d0a20 50%, #1a0510 100%)',
  'gradient-ocean-deep': 'linear-gradient(180deg, #000510 0%, #001030 50%, #002050 100%)',
  'gradient-sunset-orange': 'linear-gradient(135deg, #1a0a05 0%, #3d1a0a 50%, #5c2a10 100%)',
  'gradient-northern-lights': 'linear-gradient(135deg, #0a1020 0%, #102030 50%, #0a3020 100%)',
  // Mesh (simplified for PDF)
  'mesh-vibrant': 'linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 50%, #0A0A0B 100%)',
  'mesh-sunset': 'linear-gradient(135deg, #4a1515 0%, #2d2510 50%, #0A0A0B 100%)',
  'mesh-cool': 'linear-gradient(135deg, #172a45 0%, #0d3d2e 50%, #0A0A0B 100%)',
  'mesh-neon': 'linear-gradient(135deg, #1a0030 0%, #001a20 50%, #0A0A0B 100%)',
  'mesh-galaxy': 'linear-gradient(135deg, #1a0a3d 0%, #0a1a3d 50%, #050508 100%)',
  'mesh-tropical': 'linear-gradient(135deg, #0d3d2e 0%, #2d2510 50%, #0A0A0B 100%)',
};

export function getBackgroundCSS(backgroundKey: string, backgroundImage?: string | null): string {
  if (backgroundImage) {
    return `url(${backgroundImage})`;
  }

  const style = BACKGROUND_STYLES[backgroundKey];
  if (!style) {
    return '#0A0A0B';
  }

  return style.style.background || style.style.backgroundColor || '#0A0A0B';
}

export function getPDFBackgroundCSS(backgroundKey: string): string {
  return PDF_BACKGROUND_FALLBACKS[backgroundKey] || '#0A0A0B';
}

export default BACKGROUND_STYLES;
