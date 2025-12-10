import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BACKGROUND_STYLES } from '../utils/slideTemplates';

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
  // Create a temporary container
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

  // Create the slide element with background
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

  // Add dark overlay for image backgrounds
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

  // Create content container
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
  `;

  // Render blocks
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

  // Wait for fonts and images to load
  await new Promise(resolve => setTimeout(resolve, 100));

  // Capture with html2canvas
  const canvas = await html2canvas(slideEl, {
    scale: quality,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    width: width,
    height: height,
  });

  // Cleanup
  document.body.removeChild(container);

  return canvas;
};

/**
 * Render a single block to DOM element
 */
const renderBlock = (block) => {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    margin-bottom: 8px;
    text-align: center;
    width: 100%;
  `;

  const content = block.content || {};

  switch (block.type) {
    case 'HEADING': {
      const el = document.createElement('h1');
      el.textContent = content.text || '';
      el.style.cssText = `
        font-size: ${content.fontSize || 72}px;
        font-weight: ${content.fontWeight || 700};
        color: ${content.color || '#FFFFFF'};
        margin: 0;
        line-height: 1.1;
        text-align: ${content.textAlign || 'center'};
      `;
      wrapper.appendChild(el);
      break;
    }

    case 'SUBHEADING': {
      const el = document.createElement('h2');
      el.textContent = content.text || '';
      el.style.cssText = `
        font-size: ${content.fontSize || 36}px;
        font-weight: ${content.fontWeight || 500};
        color: ${content.color || 'rgba(255,255,255,0.8)'};
        margin: 0;
        line-height: 1.2;
        text-align: ${content.textAlign || 'center'};
      `;
      wrapper.appendChild(el);
      break;
    }

    case 'PARAGRAPH': {
      const el = document.createElement('p');
      el.textContent = content.text || '';
      el.style.cssText = `
        font-size: ${content.fontSize || 24}px;
        font-weight: ${content.fontWeight || 400};
        color: ${content.color || 'rgba(255,255,255,0.7)'};
        margin: 0;
        line-height: 1.5;
        text-align: ${content.textAlign || 'center'};
        max-width: 900px;
      `;
      wrapper.appendChild(el);
      break;
    }

    case 'BADGE': {
      const el = document.createElement('span');
      el.textContent = content.text || '';
      el.style.cssText = `
        display: inline-block;
        padding: 8px 20px;
        border-radius: 9999px;
        font-size: ${content.fontSize || 18}px;
        font-weight: 600;
        color: ${content.color || '#FF6B35'};
        background: ${content.backgroundColor || 'rgba(255, 107, 53, 0.15)'};
        border: 1px solid ${content.borderColor || 'rgba(255, 107, 53, 0.3)'};
      `;
      wrapper.appendChild(el);
      break;
    }

    case 'DIVIDER': {
      const el = document.createElement('div');
      el.style.cssText = `
        width: ${content.width || '200px'};
        height: ${content.height || '4px'};
        background: ${content.color || 'linear-gradient(90deg, transparent, #FF6B35, transparent)'};
        border-radius: 2px;
        margin: 16px auto;
      `;
      wrapper.appendChild(el);
      break;
    }

    case 'NUMBER': {
      const el = document.createElement('div');
      el.textContent = content.number || '01';
      el.style.cssText = `
        font-size: ${content.fontSize || 120}px;
        font-weight: 800;
        color: ${content.color || '#FF6B35'};
        line-height: 1;
        opacity: ${content.opacity || 0.9};
      `;
      wrapper.appendChild(el);
      break;
    }

    case 'QUOTE': {
      const quoteEl = document.createElement('blockquote');
      quoteEl.style.cssText = `
        font-size: ${content.fontSize || 32}px;
        font-style: italic;
        color: ${content.color || 'rgba(255,255,255,0.9)'};
        margin: 0;
        padding: 0 40px;
        line-height: 1.4;
        text-align: center;
        position: relative;
      `;
      quoteEl.textContent = `"${content.text || ''}"`;
      wrapper.appendChild(quoteEl);

      if (content.author) {
        const authorEl = document.createElement('p');
        authorEl.textContent = `— ${content.author}`;
        authorEl.style.cssText = `
          font-size: 20px;
          color: rgba(255,255,255,0.6);
          margin-top: 16px;
        `;
        wrapper.appendChild(authorEl);
      }
      break;
    }

    case 'BULLET_LIST': {
      const items = content.items || ['Item 1', 'Item 2', 'Item 3'];
      const listEl = document.createElement('ul');
      listEl.style.cssText = `
        list-style: none;
        padding: 0;
        margin: 0;
        text-align: left;
      `;

      items.forEach(item => {
        const li = document.createElement('li');
        li.style.cssText = `
          font-size: ${content.fontSize || 28}px;
          color: ${content.color || 'rgba(255,255,255,0.85)'};
          margin-bottom: 12px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        `;

        const bullet = document.createElement('span');
        bullet.textContent = '•';
        bullet.style.color = '#FF6B35';
        bullet.style.fontWeight = 'bold';

        const text = document.createElement('span');
        text.textContent = item;

        li.appendChild(bullet);
        li.appendChild(text);
        listEl.appendChild(li);
      });

      wrapper.appendChild(listEl);
      break;
    }

    case 'ICON': {
      const el = document.createElement('div');
      el.textContent = content.emoji || '🚀';
      el.style.cssText = `
        font-size: ${content.fontSize || 64}px;
        line-height: 1;
      `;
      wrapper.appendChild(el);
      break;
    }

    case 'BRANDING': {
      const el = document.createElement('div');
      el.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 24px;
        background: rgba(0,0,0,0.4);
        border-radius: 12px;
      `;

      const nameEl = document.createElement('span');
      nameEl.textContent = content.name || '@username';
      nameEl.style.cssText = `
        font-size: ${content.fontSize || 24}px;
        font-weight: 600;
        color: ${content.color || '#FFFFFF'};
      `;

      el.appendChild(nameEl);
      wrapper.appendChild(el);
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
      // Render slide directly to canvas
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
