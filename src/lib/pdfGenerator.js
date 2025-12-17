import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BACKGROUND_STYLES } from '../utils/slideTemplates';

/**
 * Font size map matching TextBlock.jsx
 */
const FONT_SIZE_MAP = {
  xs: '16px',
  sm: '20px',
  base: '28px',
  lg: '40px',
  xl: '56px',
  xxl: '72px',
  xxxl: '96px'
};

const getFontSize = (fontSize) => {
  if (!fontSize) return FONT_SIZE_MAP.base;
  if (typeof fontSize === 'string' && fontSize.endsWith('px')) {
    return fontSize;
  }
  return FONT_SIZE_MAP[fontSize] || FONT_SIZE_MAP.base;
};

/**
 * Helper: Lighten a hex color by percentage
 */
const lightenColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
};

/**
 * Helper: Convert hex to rgba
 */
const hexToRgba = (hex, alpha) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(255, 107, 53, ${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
};

/**
 * Simplified background colors for PDF export
 * html2canvas struggles with complex gradients, so we use simplified versions
 */
const PDF_BACKGROUND_FALLBACKS = {
  // Solids - use exact colors
  'solid-dark': '#0A0A0B',
  'solid-black': '#000000',
  'solid-charcoal': '#1A1A1D',
  'solid-navy': '#0d1b2a',
  'solid-white': '#FFFFFF',
  // Gradients - use simple linear gradients that html2canvas can handle
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
  // Mesh gradients - simplified to single gradient (html2canvas can't do multiple radial-gradients)
  'mesh-vibrant': 'linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 50%, #0A0A0B 100%)',
  'mesh-sunset': 'linear-gradient(135deg, #4a1515 0%, #2d2510 50%, #0A0A0B 100%)',
  'mesh-cool': 'linear-gradient(135deg, #172a45 0%, #0d3d2e 50%, #0A0A0B 100%)',
};

/**
 * Get CSS background string from slide data
 */
const getBackgroundCSS = (slide) => {
  if (slide?.styles?.backgroundImage?.url) {
    return `url(${slide.styles.backgroundImage.url})`;
  }

  const bgKey = slide?.styles?.background || 'solid-dark';

  // Use PDF-optimized backgrounds first
  if (PDF_BACKGROUND_FALLBACKS[bgKey]) {
    return PDF_BACKGROUND_FALLBACKS[bgKey];
  }

  // Fallback to original style
  const bgStyle = BACKGROUND_STYLES[bgKey] || BACKGROUND_STYLES['solid-dark'];

  if (bgStyle.style.background) {
    return bgStyle.style.background;
  }
  if (bgStyle.style.backgroundColor) {
    return bgStyle.style.backgroundColor;
  }

  return '#0A0A0B';
};

/**
 * Render Breaking Dynamics watermark
 */
const renderBDWatermark = () => {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    position: absolute;
    bottom: 32px;
    right: 32px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: rgba(10, 10, 11, 0.85);
    border: 1px solid rgba(255, 107, 53, 0.3);
    border-radius: 10px;
    z-index: 100;
  `;

  // BD Icon - simplified for html2canvas compatibility
  const iconEl = document.createElement('div');
  iconEl.style.cssText = `
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `;
  const bdText = document.createElement('span');
  bdText.textContent = 'BD';
  bdText.style.cssText = `
    font-size: 10px;
    font-weight: 800;
    color: #0A0A0B;
    font-family: 'Inter', system-ui, sans-serif;
  `;
  iconEl.appendChild(bdText);
  wrapper.appendChild(iconEl);

  // Text
  const textEl = document.createElement('span');
  textEl.textContent = 'Breaking Dynamics';
  textEl.style.cssText = `
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
    font-family: 'Inter', system-ui, sans-serif;
  `;
  wrapper.appendChild(textEl);

  return wrapper;
};

/**
 * Render a slide to a canvas element
 */
const renderSlideToCanvas = async (slide, width, height, quality, options = {}) => {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: -9999px;
    width: ${width}px;
    height: ${height}px;
    z-index: 99999;
    overflow: hidden;
    clip-path: inset(0);
  `;

  const slideEl = document.createElement('div');
  const bgCSS = getBackgroundCSS(slide);
  const hasBackgroundImage = !!slide?.styles?.backgroundImage?.url;

  slideEl.style.cssText = `
    width: ${width}px;
    height: ${height}px;
    background: ${bgCSS};
    ${hasBackgroundImage ? `
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    ` : ''}
    position: relative;
    overflow: hidden;
    clip-path: inset(0);
    font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  `;

  if (hasBackgroundImage) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%);
      pointer-events: none;
    `;
    slideEl.appendChild(overlay);
  }

  const contentContainer = document.createElement('div');
  const padding = slide.styles?.padding === 'sm' ? 40 :
                  slide.styles?.padding === 'lg' ? 80 :
                  slide.styles?.padding === 'xl' ? 100 : 60;

  const verticalAlign = slide.styles?.verticalAlign === 'top' ? 'flex-start' :
                        slide.styles?.verticalAlign === 'bottom' ? 'flex-end' : 'center';

  // Match SlideCanvas.jsx content container styling exactly
  contentContainer.style.cssText = `
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: ${verticalAlign};
    padding: ${padding}px;
    box-sizing: border-box;
    z-index: 10;
  `;

  if (slide.blocks && slide.blocks.length > 0) {
    for (const block of slide.blocks) {
      const blockEl = renderBlock(block);
      if (blockEl) {
        contentContainer.appendChild(blockEl);
      }
    }
  }

  slideEl.appendChild(contentContainer);

  // Add Breaking Dynamics watermark if enabled
  if (options.showBranding) {
    const watermark = renderBDWatermark();
    slideEl.appendChild(watermark);
  }

  container.appendChild(slideEl);
  document.body.appendChild(container);

  await new Promise(resolve => setTimeout(resolve, 100));

  const canvas = await html2canvas(slideEl, {
    scale: quality,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    width: width,
    height: height,
  });

  document.body.removeChild(container);

  return canvas;
};

/**
 * Render a single block to DOM element - matching exact styles from block components
 */
const renderBlock = (block) => {
  const wrapper = document.createElement('div');
  // Match SlideCanvas.jsx: marginBottom: 16px between blocks
  wrapper.style.cssText = `
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
  `;

  const content = block.content || {};

  switch (block.type) {
    // TextBlock - HEADING, SUBHEADING, PARAGRAPH all use same component
    case 'HEADING':
    case 'SUBHEADING':
    case 'PARAGRAPH': {
      const el = document.createElement('div');
      el.textContent = content.text || '';
      el.style.cssText = `
        font-size: ${getFontSize(content.fontSize)};
        font-weight: ${content.fontWeight || 'normal'};
        font-style: ${content.fontStyle || 'normal'};
        text-align: ${content.textAlign || 'center'};
        color: ${content.color || '#FFFFFF'};
        line-height: 1.3;
        font-family: ${content.fontFamily || "'Space Grotesk', sans-serif"};
        width: 100%;
        white-space: pre-wrap;
      `;
      wrapper.appendChild(el);
      break;
    }

    // BadgeBlock - Match exact editor styling
    case 'BADGE': {
      const el = document.createElement('div');
      // Exact match to BadgeBlock.jsx styles
      el.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 28px;
        border-radius: 9999px;
        background-color: ${content.backgroundColor || '#FF6B35'};
        color: ${content.textColor || '#FFFFFF'};
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-family: 'Inter', 'Space Grotesk', sans-serif;
      `;
      el.textContent = content.text || 'Badge';
      wrapper.appendChild(el);
      break;
    }

    // DividerBlock
    case 'DIVIDER': {
      const el = document.createElement('div');
      const dividerHeight = content.style === 'thick' ? '4px' : content.style === 'thin' ? '1px' : '2px';
      el.style.cssText = `
        width: ${content.width || '50%'};
        height: ${dividerHeight};
        background-color: ${content.color || '#FFFFFF'};
        opacity: ${content.opacity ?? 0.2};
        border-radius: 2px;
        margin: 24px auto;
      `;
      wrapper.appendChild(el);
      break;
    }

    // NumberBlock
    case 'NUMBER': {
      const container = document.createElement('div');
      container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
      `;

      const numEl = document.createElement('div');
      numEl.textContent = content.number || '01';
      numEl.style.cssText = `
        font-size: 120px;
        font-weight: 800;
        color: ${content.color || '#FF6B35'};
        line-height: 1;
        font-family: 'Space Grotesk', sans-serif;
        letter-spacing: -0.02em;
        text-shadow: 0 4px 20px rgba(0,0,0,0.3);
      `;
      container.appendChild(numEl);

      if (content.label) {
        const labelEl = document.createElement('div');
        labelEl.textContent = content.label;
        labelEl.style.cssText = `
          font-size: 28px;
          color: #FFFFFF;
          opacity: 0.9;
          margin-top: 16px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        `;
        container.appendChild(labelEl);
      }

      wrapper.appendChild(container);
      break;
    }

    // QuoteBlock
    case 'QUOTE': {
      const container = document.createElement('div');
      container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
      `;

      const fontSize = content.fontSize === 'xl' ? '32px' :
                       content.fontSize === 'lg' ? '28px' : '24px';

      const quoteEl = document.createElement('div');
      quoteEl.textContent = content.text || '"Quote here"';
      quoteEl.style.cssText = `
        font-size: ${fontSize};
        font-style: ${content.fontStyle || 'italic'};
        color: #FFFFFF;
        line-height: 1.4;
        text-align: center;
        font-family: 'Space Grotesk', sans-serif;
      `;
      container.appendChild(quoteEl);

      if (content.author) {
        const authorEl = document.createElement('div');
        authorEl.textContent = `— ${content.author}`;
        authorEl.style.cssText = `
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 16px;
          text-align: center;
        `;
        container.appendChild(authorEl);
      }

      wrapper.appendChild(container);
      break;
    }

    // BulletListBlock
    case 'BULLET_LIST': {
      const items = content.items || ['Item 1', 'Item 2', 'Item 3'];
      const bulletStyle = content.bulletStyle || 'check';

      const bulletColors = {
        check: '#00E676',
        circle: '#FF6B35',
        arrow: '#0A66C2',
      };

      const bulletSymbols = {
        check: '✓',
        circle: '●',
        arrow: '➤',
      };

      const listContainer = document.createElement('div');
      listContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      `;

      items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.style.cssText = `
          display: flex;
          align-items: center;
          gap: 16px;
        `;

        const bullet = document.createElement('span');
        bullet.textContent = bulletSymbols[bulletStyle] || '✓';
        bullet.style.cssText = `
          color: ${bulletColors[bulletStyle] || '#00E676'};
          font-size: 32px;
          font-weight: bold;
          flex-shrink: 0;
        `;

        const text = document.createElement('span');
        text.textContent = item;
        text.style.cssText = `
          font-size: 28px;
          color: ${content.color || '#FFFFFF'};
          line-height: 1.5;
          font-weight: 500;
          text-align: center;
        `;

        itemEl.appendChild(bullet);
        itemEl.appendChild(text);
        listContainer.appendChild(itemEl);
      });

      wrapper.appendChild(listContainer);
      break;
    }

    // IconBlock - Match exact editor styling from IconBlock.jsx
    case 'ICON': {
      // Exact match to IconBlock.jsx size mapping
      const size = content.size === 'xxl' ? '280px' :
                   content.size === 'xl' ? '220px' :
                   content.size === 'lg' ? '160px' :
                   content.size === 'base' ? '120px' : '80px';

      const el = document.createElement('div');
      el.textContent = content.emoji || '🚀';
      // Match IconBlock.jsx: style={{ fontSize: size, lineHeight: 1, margin: '16px 0' }}
      el.style.cssText = `
        font-size: ${size};
        line-height: 1;
        margin: 16px 0;
        padding: 16px 0;
      `;
      wrapper.appendChild(el);
      break;
    }

    // BrandingBlock
    case 'BRANDING': {
      const el = document.createElement('div');
      el.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 24px;
        background: rgba(0,0,0,0.4);
        border-radius: 12px;
        margin-top: 30px;
      `;

      // Avatar/Logo
      if (content.showAvatar !== false) {
        if (content.avatarUrl) {
          // Custom uploaded avatar/logo
          const avatarImg = document.createElement('img');
          avatarImg.src = content.avatarUrl;
          avatarImg.style.cssText = `
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255,255,255,0.2);
            flex-shrink: 0;
          `;
          el.appendChild(avatarImg);
        } else {
          // Default avatar placeholder with gradient
          const avatarPlaceholder = document.createElement('div');
          avatarPlaceholder.style.cssText = `
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          `;
          // User icon as SVG
          avatarPlaceholder.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          `;
          el.appendChild(avatarPlaceholder);
        }
      }

      // Name and handle container
      const textContainer = document.createElement('div');
      textContainer.style.cssText = `
        display: flex;
        flex-direction: column;
      `;

      const nameEl = document.createElement('span');
      nameEl.textContent = content.name || 'Your Name';
      nameEl.style.cssText = `
        font-size: 20px;
        font-weight: 600;
        color: #FFFFFF;
        font-family: 'Space Grotesk', sans-serif;
      `;
      textContainer.appendChild(nameEl);

      if (content.handle) {
        const handleEl = document.createElement('span');
        handleEl.textContent = content.handle;
        handleEl.style.cssText = `
          font-size: 14px;
          color: rgba(255,255,255,0.6);
        `;
        textContainer.appendChild(handleEl);
      }

      el.appendChild(textContainer);
      wrapper.appendChild(el);
      break;
    }

    // ImageBlock
    case 'IMAGE': {
      if (content.url) {
        const img = document.createElement('img');
        img.src = content.url;
        img.style.cssText = `
          max-width: 100%;
          max-height: 600px;
          object-fit: contain;
          border-radius: ${content.borderRadius || '12px'};
        `;
        wrapper.appendChild(img);
      }
      break;
    }

    default:
      return null;
  }

  return wrapper;
};

/**
 * Generate a PDF from carousel slides
 */
export const generateCarouselPDF = async (slideData, options = {}) => {
  const {
    width = 1080,
    height = 1080,
    quality = 2,
    onProgress = () => {},
    showBranding = false,
  } = options;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [width, height],
    compress: true,
  });

  const totalSlides = slideData.length;

  for (let i = 0; i < totalSlides; i++) {
    const item = slideData[i];
    const slide = item?.slide || item;

    if (!slide) continue;

    onProgress({
      current: i + 1,
      total: totalSlides,
      percentage: Math.round(((i + 1) / totalSlides) * 100),
    });

    try {
      const canvas = await renderSlideToCanvas(slide, width, height, quality, { showBranding });
      const imgData = canvas.toDataURL('image/png', 1.0);

      if (i > 0) {
        pdf.addPage([width, height], 'portrait');
      }

      pdf.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');
    } catch (error) {
      console.error(`Error capturing slide ${i + 1}:`, error);
      throw new Error(`Failed to capture slide ${i + 1}: ${error.message}`);
    }
  }

  return pdf;
};

export const downloadPDF = (pdf, filename = 'carousel.pdf') => {
  pdf.save(filename);
};

export const generateAndDownloadPDF = async (slideData, options = {}) => {
  const { filename = 'linkedin-carousel.pdf', ...pdfOptions } = options;
  const pdf = await generateCarouselPDF(slideData, pdfOptions);
  downloadPDF(pdf, filename);
  return pdf;
};

export const generatePDFBlob = async (slideData, options = {}) => {
  const pdf = await generateCarouselPDF(slideData, options);
  return pdf.output('blob');
};

export const captureSlideImage = async (slideRef, options = {}) => {
  const { width = 1080, height = 1080, scale = 0.5 } = options;

  const canvas = await html2canvas(slideRef, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    width,
    height,
  });

  return canvas.toDataURL('image/png');
};

export default {
  generateCarouselPDF,
  downloadPDF,
  generateAndDownloadPDF,
  generatePDFBlob,
  captureSlideImage,
};
