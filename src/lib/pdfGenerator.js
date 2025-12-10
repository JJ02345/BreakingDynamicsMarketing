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
 * Get CSS background string from slide data
 */
const getBackgroundCSS = (slide) => {
  if (slide?.styles?.backgroundImage?.url) {
    return `url(${slide.styles.backgroundImage.url})`;
  }

  const bgKey = slide?.styles?.background || 'solid-dark';
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
 * Render a slide to a canvas element
 */
const renderSlideToCanvas = async (slide, width, height, quality) => {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    width: ${width}px;
    height: ${height}px;
    z-index: 99999;
    overflow: hidden;
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
    gap: 16px;
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
  wrapper.style.cssText = `
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
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

    // BadgeBlock
    case 'BADGE': {
      const el = document.createElement('span');
      el.textContent = content.text || 'Badge';
      el.style.cssText = `
        display: inline-flex;
        align-items: center;
        padding: 12px 28px;
        border-radius: 9999px;
        background-color: ${content.backgroundColor || '#FF6B35'};
        color: ${content.textColor || '#FFFFFF'};
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      `;
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

    // IconBlock
    case 'ICON': {
      // Sehr große Icons für PDF - deutlich größer als im Editor
      const size = content.size === 'xxl' ? '220px' :
                   content.size === 'xl' ? '180px' :
                   content.size === 'lg' ? '140px' :
                   content.size === 'base' ? '100px' : '80px';

      const el = document.createElement('div');
      el.textContent = content.emoji || '🚀';
      el.style.cssText = `
        font-size: ${size};
        line-height: 1;
        margin: 30px 0;
        flex-shrink: 0;
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

      const nameEl = document.createElement('span');
      nameEl.textContent = content.name || '@username';
      nameEl.style.cssText = `
        font-size: 24px;
        font-weight: 600;
        color: #FFFFFF;
      `;

      el.appendChild(nameEl);
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
      const canvas = await renderSlideToCanvas(slide, width, height, quality);
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
