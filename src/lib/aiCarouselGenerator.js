// ============================================
// AI CAROUSEL GENERATOR
// Mock implementation - replace with real AI API later
// ============================================

/**
 * Generates a LinkedIn carousel from a hypothesis/topic
 * Currently uses mock data, but structured for easy API integration
 */

const MOCK_DELAY = 1500; // Simulate API delay

// Template patterns for different carousel types
const CAROUSEL_PATTERNS = {
  problem_solution: {
    name: 'Problem → Lösung',
    slides: ['hook', 'problem', 'agitate', 'solution', 'benefits', 'cta']
  },
  listicle: {
    name: 'Listicle',
    slides: ['hook', 'point1', 'point2', 'point3', 'point4', 'cta']
  },
  story: {
    name: 'Story',
    slides: ['hook', 'background', 'conflict', 'resolution', 'lesson', 'cta']
  },
  comparison: {
    name: 'Vergleich',
    slides: ['hook', 'optionA', 'optionB', 'analysis', 'recommendation', 'cta']
  },
  myth_busting: {
    name: 'Mythen aufklären',
    slides: ['hook', 'myth1', 'truth1', 'myth2', 'truth2', 'cta']
  }
};

// Generate mock content based on hypothesis
const generateMockContent = (hypothesis, pattern, slideCount) => {
  const words = hypothesis.split(' ');
  const keyword = words.find(w => w.length > 4) || words[0] || 'Thema';

  const mockSlides = [];

  // Cover/Hook Slide
  mockSlides.push({
    type: 'cover',
    blocks: [
      { type: 'ICON', content: { emoji: '🎯', size: 'xxl' } },
      { type: 'HEADING', content: {
        text: hypothesis.length > 50 ? hypothesis.slice(0, 50) + '...' : hypothesis,
        fontSize: 'xxl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF'
      }},
      { type: 'SUBHEADING', content: {
        text: 'Swipe für die Erklärung →',
        fontSize: 'lg', fontWeight: 'normal', textAlign: 'center', color: '#FF6B35'
      }},
      { type: 'BRANDING', content: { name: 'Dein Name', handle: '@handle', showAvatar: true }}
    ],
    styles: { background: 'gradient-orange', padding: 'lg' }
  });

  // Content slides based on pattern
  if (pattern === 'problem_solution') {
    mockSlides.push({
      type: 'option',
      blocks: [
        { type: 'NUMBER', content: { number: '01', label: '', color: '#FF6B35' }},
        { type: 'HEADING', content: { text: 'Das Problem', fontSize: 'xl', fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' }},
        { type: 'PARAGRAPH', content: {
          text: `Viele Menschen kämpfen mit ${keyword}. Das führt zu Frustration und verlorener Zeit.`,
          fontSize: 'base', textAlign: 'left', color: '#B0B0B0'
        }}
      ],
      styles: { background: 'solid-dark', padding: 'lg' }
    });
    mockSlides.push({
      type: 'option',
      blocks: [
        { type: 'NUMBER', content: { number: '02', label: '', color: '#FF6B35' }},
        { type: 'HEADING', content: { text: 'Die Auswirkungen', fontSize: 'xl', fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' }},
        { type: 'BULLET_LIST', content: {
          items: ['Zeitverlust durch ineffiziente Prozesse', 'Frustration im Team', 'Verpasste Chancen'],
          bulletStyle: 'arrow', color: '#FFFFFF'
        }}
      ],
      styles: { background: 'solid-dark', padding: 'lg' }
    });
    mockSlides.push({
      type: 'option',
      blocks: [
        { type: 'ICON', content: { emoji: '💡', size: 'xl' }},
        { type: 'HEADING', content: { text: 'Die Lösung', fontSize: 'xl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' }},
        { type: 'PARAGRAPH', content: {
          text: `Mit dem richtigen Ansatz für ${keyword} kannst du diese Probleme lösen.`,
          fontSize: 'base', textAlign: 'center', color: '#B0B0B0'
        }}
      ],
      styles: { background: 'gradient-purple', padding: 'lg' }
    });
  } else if (pattern === 'listicle') {
    for (let i = 1; i <= Math.min(slideCount - 2, 5); i++) {
      mockSlides.push({
        type: 'option',
        blocks: [
          { type: 'NUMBER', content: { number: `0${i}`, label: '', color: '#FF6B35' }},
          { type: 'HEADING', content: { text: `Punkt ${i}: ${keyword}`, fontSize: 'xl', fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' }},
          { type: 'PARAGRAPH', content: {
            text: `Hier ist ein wichtiger Aspekt zu ${keyword}, den du kennen solltest.`,
            fontSize: 'base', textAlign: 'left', color: '#B0B0B0'
          }}
        ],
        styles: { background: 'solid-dark', padding: 'lg' }
      });
    }
  } else if (pattern === 'comparison') {
    mockSlides.push({
      type: 'comparison',
      blocks: [
        { type: 'BADGE', content: { text: 'Option A', backgroundColor: '#FF6B35', textColor: '#FFFFFF' }},
        { type: 'HEADING', content: { text: 'Der traditionelle Weg', fontSize: 'xl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' }},
        { type: 'BULLET_LIST', content: {
          items: ['Mehr Aufwand', 'Längere Zeit', 'Höhere Kosten'],
          bulletStyle: 'arrow', color: '#FF5252'
        }}
      ],
      styles: { background: 'solid-dark', padding: 'lg' }
    });
    mockSlides.push({
      type: 'comparison',
      blocks: [
        { type: 'BADGE', content: { text: 'Option B', backgroundColor: '#00E676', textColor: '#000000' }},
        { type: 'HEADING', content: { text: 'Der neue Ansatz', fontSize: 'xl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' }},
        { type: 'BULLET_LIST', content: {
          items: ['Weniger Aufwand', 'Schnellere Ergebnisse', 'Bessere Effizienz'],
          bulletStyle: 'check', color: '#00E676'
        }}
      ],
      styles: { background: 'solid-dark', padding: 'lg' }
    });
    mockSlides.push({
      type: 'option',
      blocks: [
        { type: 'ICON', content: { emoji: '🏆', size: 'xl' }},
        { type: 'HEADING', content: { text: 'Meine Empfehlung', fontSize: 'xl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' }},
        { type: 'PARAGRAPH', content: {
          text: `Für ${keyword} empfehle ich den neuen Ansatz - hier ist warum.`,
          fontSize: 'base', textAlign: 'center', color: '#B0B0B0'
        }}
      ],
      styles: { background: 'gradient-blue', padding: 'lg' }
    });
  } else {
    // Default: Generate simple content slides
    for (let i = 1; i <= Math.min(slideCount - 2, 4); i++) {
      mockSlides.push({
        type: 'option',
        blocks: [
          { type: 'NUMBER', content: { number: `0${i}`, label: '', color: '#FF6B35' }},
          { type: 'HEADING', content: { text: `Aspekt ${i}`, fontSize: 'xl', fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' }},
          { type: 'PARAGRAPH', content: {
            text: `Ein wichtiger Punkt über ${hypothesis.slice(0, 30)}...`,
            fontSize: 'base', textAlign: 'left', color: '#B0B0B0'
          }}
        ],
        styles: { background: 'solid-dark', padding: 'lg' }
      });
    }
  }

  // CTA Slide
  mockSlides.push({
    type: 'cta',
    blocks: [
      { type: 'HEADING', content: { text: 'Was denkst du?', fontSize: 'xxl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' }},
      { type: 'SUBHEADING', content: { text: 'Teile deine Meinung in den Kommentaren!', fontSize: 'lg', fontWeight: 'normal', textAlign: 'center', color: '#B0B0B0' }},
      { type: 'DIVIDER', content: { style: 'solid', opacity: 0.2, width: '60%' }},
      { type: 'PARAGRAPH', content: { text: '💬 Kommentieren\n♻️ Reposten\n🔔 Folgen für mehr', fontSize: 'base', textAlign: 'center', color: '#FF6B35' }},
      { type: 'BRANDING', content: { name: 'Dein Name', handle: '@handle', showAvatar: true }}
    ],
    styles: { background: 'gradient-orange', padding: 'lg' }
  });

  return mockSlides.slice(0, slideCount);
};

/**
 * Generate carousel from hypothesis
 * @param {Object} options
 * @param {string} options.hypothesis - The main hypothesis/topic
 * @param {string} options.pattern - Carousel pattern (problem_solution, listicle, etc.)
 * @param {number} options.slideCount - Number of slides to generate
 * @param {string} options.tone - Tone of voice (professional, casual, provocative)
 * @param {string} options.language - Language (de, en)
 * @param {function} options.onProgress - Progress callback
 * @returns {Promise<Object>} Generated carousel data
 */
export const generateCarouselFromHypothesis = async ({
  hypothesis,
  pattern = 'problem_solution',
  slideCount = 5,
  tone = 'professional',
  language = 'de',
  onProgress = () => {}
}) => {
  // Validate inputs
  if (!hypothesis || hypothesis.trim().length < 10) {
    throw new Error('Bitte gib eine Hypothese mit mindestens 10 Zeichen ein.');
  }

  // Simulate progress
  onProgress({ stage: 'analyzing', percentage: 10 });
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY / 3));

  onProgress({ stage: 'generating', percentage: 40 });
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY / 3));

  onProgress({ stage: 'formatting', percentage: 70 });
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY / 3));

  // Generate mock content
  const slides = generateMockContent(hypothesis, pattern, slideCount);

  // Add unique IDs
  const slidesWithIds = slides.map((slide, slideIndex) => ({
    id: `slide-${Date.now()}-${slideIndex}-${Math.random().toString(36).substr(2, 9)}`,
    ...slide,
    blocks: slide.blocks.map((block, blockIndex) => ({
      id: `block-${Date.now()}-${slideIndex}-${blockIndex}-${Math.random().toString(36).substr(2, 9)}`,
      ...block,
      content: { ...block.content }
    })),
    order: slideIndex + 1
  }));

  onProgress({ stage: 'complete', percentage: 100 });

  return {
    title: hypothesis.slice(0, 50),
    slides: slidesWithIds,
    settings: {
      width: 1080,
      height: 1080
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      hypothesis,
      pattern,
      slideCount,
      tone,
      language
    }
  };
};

/**
 * Get available carousel patterns
 */
export const getCarouselPatterns = () => CAROUSEL_PATTERNS;

/**
 * Estimate generation time
 */
export const estimateGenerationTime = (slideCount) => {
  return Math.ceil(MOCK_DELAY / 1000) + Math.ceil(slideCount * 0.2);
};

export default {
  generateCarouselFromHypothesis,
  getCarouselPatterns,
  estimateGenerationTime
};
