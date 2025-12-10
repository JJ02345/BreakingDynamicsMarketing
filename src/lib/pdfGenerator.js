import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BACKGROUND_STYLES } from '../utils/slideTemplates';

/**
 * Get CSS background string from slide data
 * @param {Object} slide - The slide object with styles
 * @returns {string} - CSS background value
 */
const getBackgroundCSS = (slide) => {
  // Check for custom background image first
  if (slide?.styles?.backgroundImage?.url) {
    return `url(${slide.styles.backgroundImage.url})`;
  }

  // Get background from BACKGROUND_STYLES
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
 * Generate a PDF from carousel slides
 * @param {Array} slideData - Array of {element, slide} objects
 * @param {Object} options - PDF generation options
 * @returns {Promise<jsPDF>} - The generated PDF document
 */
export const generateCarouselPDF = async (slideData, options = {}) => {
  const {
    width = 1080,
    height = 1080,
    quality = 2,
    onProgress = () => {},
  } = options;

  // Create PDF with square format (LinkedIn optimal)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [width, height],
    compress: true,
  });

  const totalSlides = slideData.length;

  // Create a temporary container for rendering slides
  const tempContainer = document.createElement('div');
  tempContainer.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    width: ${width}px;
    height: ${height}px;
    z-index: 99999;
    pointer-events: none;
    overflow: hidden;
  `;
  document.body.appendChild(tempContainer);

  for (let i = 0; i < totalSlides; i++) {
    const item = slideData[i];

    // Support both old format (just element) and new format ({element, slide})
    const slideRef = item?.element || item;
    const slide = item?.slide;

    if (!slideRef) continue;

    // Report progress
    onProgress({
      current: i + 1,
      total: totalSlides,
      percentage: Math.round(((i + 1) / totalSlides) * 100),
    });

    try {
      // Clone the slide element
      const clonedSlide = slideRef.cloneNode(true);

      // Get background CSS - use slide data if available, otherwise try computed style
      let backgroundCSS = '#0A0A0B';
      let hasBackgroundImage = false;

      if (slide) {
        // Use slide data directly (preferred method)
        backgroundCSS = getBackgroundCSS(slide);
        hasBackgroundImage = !!slide?.styles?.backgroundImage?.url;
      } else {
        // Fallback to computed style (may not work well for gradients)
        const originalStyles = window.getComputedStyle(slideRef);
        backgroundCSS = originalStyles.background || originalStyles.backgroundColor || '#0A0A0B';
      }

      // Apply styles to make it visible and properly sized
      clonedSlide.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        width: ${width}px;
        height: ${height}px;
        transform: none;
        visibility: visible;
        opacity: 1;
        overflow: hidden;
        background: ${backgroundCSS};
        ${hasBackgroundImage ? `
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        ` : ''}
        font-family: 'Space Grotesk', 'Inter', sans-serif;
      `;

      // Clear temp container and add cloned slide
      tempContainer.innerHTML = '';
      tempContainer.appendChild(clonedSlide);

      // Make all child elements visible and fix their styles
      clonedSlide.querySelectorAll('*').forEach((child) => {
        if (child instanceof HTMLElement) {
          child.style.visibility = 'visible';
          child.style.transform = 'none';
          if (child.style.opacity === '0') {
            child.style.opacity = '1';
          }
        }
      });

      // Wait for styles to apply and images to load
      await new Promise(resolve => setTimeout(resolve, 50));

      // Capture the cloned slide
      const canvas = await html2canvas(clonedSlide, {
        scale: quality,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null, // Use element's own background
        logging: false,
        width: width,
        height: height,
        scrollX: 0,
        scrollY: 0,
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png', 1.0);

      // Add new page for slides after the first
      if (i > 0) {
        pdf.addPage([width, height], 'portrait');
      }

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');
    } catch (error) {
      console.error(`Error capturing slide ${i + 1}:`, error);
      throw new Error(`Failed to capture slide ${i + 1}: ${error.message}`);
    }
  }

  // Clean up temp container
  document.body.removeChild(tempContainer);

  return pdf;
};

/**
 * Download the generated PDF
 * @param {jsPDF} pdf - The PDF document
 * @param {string} filename - The filename for download
 */
export const downloadPDF = (pdf, filename = 'carousel.pdf') => {
  pdf.save(filename);
};

/**
 * Generate and download carousel PDF in one step
 * @param {Array} slideData - Array of {element, slide} objects or just elements
 * @param {Object} options - Options including filename
 */
export const generateAndDownloadPDF = async (slideData, options = {}) => {
  const { filename = 'linkedin-carousel.pdf', ...pdfOptions } = options;

  const pdf = await generateCarouselPDF(slideData, pdfOptions);
  downloadPDF(pdf, filename);

  return pdf;
};

/**
 * Generate PDF as blob for preview or upload
 * @param {Array} slideData - Array of {element, slide} objects
 * @param {Object} options - Generation options
 * @returns {Promise<Blob>}
 */
export const generatePDFBlob = async (slideData, options = {}) => {
  const pdf = await generateCarouselPDF(slideData, options);
  return pdf.output('blob');
};

/**
 * Generate individual slide images (for preview thumbnails)
 * @param {HTMLElement} slideRef - DOM reference to a slide
 * @param {Object} options - Capture options
 * @returns {Promise<string>} - Data URL of the captured image
 */
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
