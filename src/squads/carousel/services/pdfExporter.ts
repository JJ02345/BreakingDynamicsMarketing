// PDF Exporter Service
// Generates PDFs from carousel slides

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDF_BACKGROUND_FALLBACKS, BACKGROUND_STYLES, getFontSize } from '../templates';
import type { Slide, Block, ExportOptions, ExportProgress } from '../types';

// ============================================
// BACKGROUND HELPERS
// ============================================

function getBackgroundCSS(slide: Slide): string {
  if (slide?.styles?.backgroundImage) {
    return `url(${slide.styles.backgroundImage})`;
  }

  const bgKey = slide?.styles?.background || 'solid-dark';

  // Use PDF-optimized backgrounds first
  if (PDF_BACKGROUND_FALLBACKS[bgKey]) {
    return PDF_BACKGROUND_FALLBACKS[bgKey];
  }

  // Fallback to original style
  const bgStyle = BACKGROUND_STYLES[bgKey];
  if (bgStyle?.style.background) {
    return bgStyle.style.background;
  }
  if (bgStyle?.style.backgroundColor) {
    return bgStyle.style.backgroundColor;
  }

  return '#0A0A0B';
}

// ============================================
// BLOCK RENDERING
// ============================================

function renderBlock(block: Block): HTMLElement | null {
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
    case 'HEADING':
    case 'PARAGRAPH': {
      const el = document.createElement('div');
      el.textContent = (content as any).text || '';
      el.style.cssText = `
        font-size: ${getFontSize((content as any).fontSize)};
        font-weight: ${(content as any).fontWeight || 'normal'};
        font-style: ${(content as any).fontStyle || 'normal'};
        text-align: ${(content as any).textAlign || 'center'};
        color: ${(content as any).color || '#FFFFFF'};
        line-height: 1.3;
        font-family: ${(content as any).fontFamily || "'Space Grotesk', sans-serif"};
        width: 100%;
        white-space: pre-wrap;
      `;
      wrapper.appendChild(el);
      break;
    }

    case 'BADGE': {
      const el = document.createElement('span');
      el.textContent = (content as any).text || 'Badge';
      el.style.cssText = `
        display: inline-flex;
        align-items: center;
        padding: 12px 28px;
        border-radius: 9999px;
        background-color: ${(content as any).backgroundColor || '#FF6B35'};
        color: ${(content as any).textColor || '#FFFFFF'};
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      `;
      wrapper.appendChild(el);
      break;
    }

    case 'DIVIDER': {
      const el = document.createElement('div');
      const dividerHeight =
        (content as any).style === 'thick' ? '4px' :
        (content as any).style === 'thin' ? '1px' : '2px';
      el.style.cssText = `
        width: ${(content as any).width || '50%'};
        height: ${dividerHeight};
        background-color: ${(content as any).color || '#FFFFFF'};
        opacity: ${(content as any).opacity ?? 0.2};
        border-radius: 2px;
        margin: 24px auto;
      `;
      wrapper.appendChild(el);
      break;
    }

    case 'NUMBER': {
      const container = document.createElement('div');
      container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
      `;

      const numEl = document.createElement('div');
      numEl.textContent = (content as any).number || '01';
      numEl.style.cssText = `
        font-size: 120px;
        font-weight: 800;
        color: ${(content as any).color || '#FF6B35'};
        line-height: 1;
        font-family: 'Space Grotesk', sans-serif;
        letter-spacing: -0.02em;
        text-shadow: 0 4px 20px rgba(0,0,0,0.3);
      `;
      container.appendChild(numEl);

      if ((content as any).label) {
        const labelEl = document.createElement('div');
        labelEl.textContent = (content as any).label;
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

    case 'QUOTE': {
      const container = document.createElement('div');
      container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
      `;

      const fontSize =
        (content as any).fontSize === 'xl' ? '32px' :
        (content as any).fontSize === 'lg' ? '28px' : '24px';

      const quoteEl = document.createElement('div');
      quoteEl.textContent = (content as any).text || '"Quote here"';
      quoteEl.style.cssText = `
        font-size: ${fontSize};
        font-style: ${(content as any).fontStyle || 'italic'};
        color: #FFFFFF;
        line-height: 1.4;
        text-align: center;
        font-family: 'Space Grotesk', sans-serif;
      `;
      container.appendChild(quoteEl);

      if ((content as any).author) {
        const authorEl = document.createElement('div');
        authorEl.textContent = `— ${(content as any).author}`;
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

    case 'BULLET_LIST': {
      const items = (content as any).items || ['Item 1', 'Item 2', 'Item 3'];
      const bulletStyle = (content as any).bulletStyle || 'check';

      const bulletColors: Record<string, string> = {
        check: '#00E676',
        circle: '#FF6B35',
        arrow: '#0A66C2',
      };

      const bulletSymbols: Record<string, string> = {
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

      items.forEach((item: string) => {
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
          color: ${(content as any).color || '#FFFFFF'};
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

    case 'ICON': {
      const size =
        (content as any).size === 'xxxl' ? '280px' :
        (content as any).size === 'xxl' ? '220px' :
        (content as any).size === 'xl' ? '160px' :
        (content as any).size === 'lg' ? '120px' :
        (content as any).size === 'base' ? '80px' : '80px';

      const el = document.createElement('div');
      el.textContent = (content as any).emoji || '🚀';
      el.style.cssText = `
        font-size: ${size};
        line-height: 1;
        margin: 40px 0;
        flex-shrink: 0;
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
        margin-top: 30px;
      `;

      const nameEl = document.createElement('span');
      nameEl.textContent = (content as any).name || '@username';
      nameEl.style.cssText = `
        font-size: 24px;
        font-weight: 600;
        color: #FFFFFF;
      `;

      el.appendChild(nameEl);
      wrapper.appendChild(el);
      break;
    }

    case 'IMAGE': {
      if ((content as any).src || (content as any).url) {
        const img = document.createElement('img');
        img.src = (content as any).src || (content as any).url;
        img.style.cssText = `
          max-width: 100%;
          max-height: 600px;
          object-fit: contain;
          border-radius: ${(content as any).borderRadius || '12px'};
        `;
        wrapper.appendChild(img);
      }
      break;
    }

    default:
      return null;
  }

  return wrapper;
}

// ============================================
// SLIDE RENDERING
// ============================================

async function renderSlideToCanvas(
  slide: Slide,
  width: number,
  height: number,
  quality: number
): Promise<HTMLCanvasElement> {
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
  const hasBackgroundImage = !!slide?.styles?.backgroundImage;

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
  const padding =
    slide.styles?.padding === 'sm' ? 40 :
    slide.styles?.padding === 'lg' ? 80 :
    slide.styles?.padding === 'xl' ? 100 : 60;

  contentContainer.style.cssText = `
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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

  // Wait for fonts and images to load
  await new Promise((resolve) => setTimeout(resolve, 100));

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
}

// ============================================
// PDF GENERATION
// ============================================

/**
 * Generate a PDF from carousel slides
 */
export async function generateCarouselPDF(
  slides: Slide[],
  options: ExportOptions = {}
): Promise<jsPDF> {
  const {
    width = 1080,
    height = 1080,
    quality = 2,
    onProgress,
  } = options;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [width, height],
    compress: true,
  });

  const totalSlides = slides.length;

  for (let i = 0; i < totalSlides; i++) {
    const slide = slides[i];

    if (!slide) continue;

    onProgress?.({
      stage: 'rendering',
      currentSlide: i + 1,
      totalSlides,
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
      throw new Error(`Failed to capture slide ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return pdf;
}

/**
 * Download a PDF
 */
export function downloadPDF(pdf: jsPDF, filename: string = 'carousel.pdf'): void {
  pdf.save(filename);
}

/**
 * Generate and download PDF in one step
 */
export async function generateAndDownloadPDF(
  slides: Slide[],
  options: ExportOptions = {}
): Promise<jsPDF> {
  const { filename = 'linkedin-carousel.pdf', ...pdfOptions } = options;
  const pdf = await generateCarouselPDF(slides, pdfOptions);
  downloadPDF(pdf, filename);
  return pdf;
}

/**
 * Generate PDF as blob
 */
export async function generatePDFBlob(
  slides: Slide[],
  options: ExportOptions = {}
): Promise<Blob> {
  const pdf = await generateCarouselPDF(slides, options);
  return pdf.output('blob');
}

/**
 * Capture a single slide as image
 */
export async function captureSlideImage(
  slideRef: HTMLElement,
  options: { width?: number; height?: number; scale?: number } = {}
): Promise<string> {
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
}

export default {
  generateCarouselPDF,
  downloadPDF,
  generateAndDownloadPDF,
  generatePDFBlob,
  captureSlideImage,
};
