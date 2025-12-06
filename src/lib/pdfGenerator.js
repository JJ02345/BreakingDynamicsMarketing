import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate a PDF from carousel slides
 * @param {HTMLElement[]} slideRefs - Array of DOM references to slide elements
 * @param {Object} options - PDF generation options
 * @returns {Promise<jsPDF>} - The generated PDF document
 */
export const generateCarouselPDF = async (slideRefs, options = {}) => {
  const {
    width = 1080,
    height = 1080,
    quality = 2, // Scale factor for image quality
    filename = 'carousel.pdf',
    onProgress = () => {},
  } = options;

  // Create PDF with square format (LinkedIn optimal)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [width, height],
    compress: true,
  });

  const totalSlides = slideRefs.length;

  for (let i = 0; i < totalSlides; i++) {
    const slideRef = slideRefs[i];

    if (!slideRef) continue;

    // Report progress
    onProgress({
      current: i + 1,
      total: totalSlides,
      percentage: Math.round(((i + 1) / totalSlides) * 100),
    });

    try {
      // Capture slide as canvas
      const canvas = await html2canvas(slideRef, {
        scale: quality,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: width,
        height: height,
        onclone: (clonedDoc, element) => {
          // Ensure fonts are loaded in cloned document
          element.style.fontFamily = "'Space Grotesk', 'Inter', sans-serif";
        },
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
 * @param {HTMLElement[]} slideRefs - Array of DOM references to slide elements
 * @param {Object} options - Options including filename
 */
export const generateAndDownloadPDF = async (slideRefs, options = {}) => {
  const { filename = 'linkedin-carousel.pdf', ...pdfOptions } = options;

  const pdf = await generateCarouselPDF(slideRefs, pdfOptions);
  downloadPDF(pdf, filename);

  return pdf;
};

/**
 * Generate PDF as blob for preview or upload
 * @param {HTMLElement[]} slideRefs - Array of DOM references
 * @param {Object} options - Generation options
 * @returns {Promise<Blob>}
 */
export const generatePDFBlob = async (slideRefs, options = {}) => {
  const pdf = await generateCarouselPDF(slideRefs, options);
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
