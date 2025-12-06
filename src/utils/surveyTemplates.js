// ============================================
// OFFLINE SURVEY TEMPLATES - Problem & Idea Validation
// ============================================

import { MessageSquare, CheckSquare, Star, Type, ListChecks, Scale, ThumbsUp, Lightbulb, AlertTriangle, Target } from 'lucide-react';

// ============================================
// SURVEY BLOCK TYPES
// ============================================
export const SURVEY_BLOCK_TYPES = {
  // Questions
  SINGLE_CHOICE: {
    id: 'SINGLE_CHOICE',
    name: 'Single Choice',
    nameDE: 'Einfachauswahl',
    icon: CheckSquare,
    category: 'question',
    defaultContent: {
      question: '',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: true,
      allowOther: false,
    }
  },
  MULTI_CHOICE: {
    id: 'MULTI_CHOICE',
    name: 'Multiple Choice',
    nameDE: 'Mehrfachauswahl',
    icon: ListChecks,
    category: 'question',
    defaultContent: {
      question: '',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: true,
      allowOther: false,
      maxSelections: null,
    }
  },
  RATING: {
    id: 'RATING',
    name: 'Rating Scale',
    nameDE: 'Bewertungsskala',
    icon: Star,
    category: 'question',
    defaultContent: {
      question: '',
      minValue: 1,
      maxValue: 5,
      minLabel: '',
      maxLabel: '',
      required: true,
      style: 'stars', // 'stars', 'numbers', 'emoji'
    }
  },
  NPS: {
    id: 'NPS',
    name: 'NPS Score',
    nameDE: 'NPS Bewertung',
    icon: Scale,
    category: 'question',
    defaultContent: {
      question: 'How likely are you to recommend this to a friend?',
      minLabel: 'Not likely',
      maxLabel: 'Very likely',
      required: true,
    }
  },
  TEXT_INPUT: {
    id: 'TEXT_INPUT',
    name: 'Text Answer',
    nameDE: 'Textantwort',
    icon: Type,
    category: 'question',
    defaultContent: {
      question: '',
      placeholder: '',
      required: false,
      multiline: true,
      maxLength: 500,
    }
  },
  YES_NO: {
    id: 'YES_NO',
    name: 'Yes/No Question',
    nameDE: 'Ja/Nein Frage',
    icon: ThumbsUp,
    category: 'question',
    defaultContent: {
      question: '',
      required: true,
      yesLabel: 'Yes',
      noLabel: 'No',
    }
  },
  // Content Blocks
  HEADER: {
    id: 'HEADER',
    name: 'Section Header',
    nameDE: 'Abschnitts-Überschrift',
    icon: Type,
    category: 'content',
    defaultContent: {
      title: '',
      subtitle: '',
    }
  },
  DESCRIPTION: {
    id: 'DESCRIPTION',
    name: 'Description',
    nameDE: 'Beschreibung',
    icon: MessageSquare,
    category: 'content',
    defaultContent: {
      text: '',
    }
  },
  // Validation Specific
  PROBLEM_STATEMENT: {
    id: 'PROBLEM_STATEMENT',
    name: 'Problem Statement',
    nameDE: 'Problem-Beschreibung',
    icon: AlertTriangle,
    category: 'validation',
    defaultContent: {
      problem: '',
      showToRespondent: true,
    }
  },
  HYPOTHESIS: {
    id: 'HYPOTHESIS',
    name: 'Hypothesis',
    nameDE: 'Hypothese',
    icon: Lightbulb,
    category: 'validation',
    defaultContent: {
      hypothesis: '',
      metrics: '',
      showToRespondent: false,
    }
  },
  SOLUTION_TEST: {
    id: 'SOLUTION_TEST',
    name: 'Solution Test',
    nameDE: 'Lösungs-Test',
    icon: Target,
    category: 'validation',
    defaultContent: {
      solutionDescription: '',
      question: 'Would this solution help you?',
      options: ['Definitely yes', 'Probably yes', 'Not sure', 'Probably not', 'Definitely not'],
    }
  },
};

// ============================================
// SURVEY TEMPLATES
// ============================================
export const SURVEY_TEMPLATES = {
  problemValidation: {
    id: 'problemValidation',
    name: 'Problem Validation',
    nameDE: 'Problem-Validierung',
    description: 'Validate if a problem exists and how painful it is',
    descriptionDE: 'Validiere ob ein Problem existiert und wie schmerzhaft es ist',
    icon: AlertTriangle,
    color: '#FF6B35',
    defaultBlocks: [
      {
        type: 'HEADER',
        content: {
          title: 'Problem Validation Survey',
          subtitle: 'Help us understand your challenges'
        }
      },
      {
        type: 'PROBLEM_STATEMENT',
        content: {
          problem: 'Describe the problem you want to validate...',
          showToRespondent: false
        }
      },
      {
        type: 'YES_NO',
        content: {
          question: 'Do you experience this problem?',
          required: true
        }
      },
      {
        type: 'RATING',
        content: {
          question: 'How painful is this problem for you?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Not painful',
          maxLabel: 'Very painful',
          style: 'stars'
        }
      },
      {
        type: 'SINGLE_CHOICE',
        content: {
          question: 'How often do you face this problem?',
          options: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
          required: true
        }
      },
      {
        type: 'TEXT_INPUT',
        content: {
          question: 'How do you currently solve this problem?',
          placeholder: 'Describe your current solution...',
          multiline: true
        }
      },
    ],
  },
  ideaValidation: {
    id: 'ideaValidation',
    name: 'Idea Validation',
    nameDE: 'Ideen-Validierung',
    description: 'Test if your solution idea resonates with users',
    descriptionDE: 'Teste ob deine Lösungsidee bei Nutzern ankommt',
    icon: Lightbulb,
    color: '#00D4FF',
    defaultBlocks: [
      {
        type: 'HEADER',
        content: {
          title: 'Idea Feedback Survey',
          subtitle: 'We value your honest opinion'
        }
      },
      {
        type: 'HYPOTHESIS',
        content: {
          hypothesis: 'We believe that...',
          metrics: 'Success if >60% show interest',
          showToRespondent: false
        }
      },
      {
        type: 'DESCRIPTION',
        content: {
          text: 'Describe your idea/solution here for the respondent...'
        }
      },
      {
        type: 'SOLUTION_TEST',
        content: {
          solutionDescription: 'Our solution would...',
          question: 'Would this solution help you?',
          options: ['Definitely yes', 'Probably yes', 'Not sure', 'Probably not', 'Definitely not']
        }
      },
      {
        type: 'NPS',
        content: {
          question: 'How likely would you recommend this to others?',
          minLabel: 'Not likely',
          maxLabel: 'Very likely'
        }
      },
      {
        type: 'TEXT_INPUT',
        content: {
          question: 'What would make this solution better?',
          placeholder: 'Your suggestions...',
          multiline: true
        }
      },
    ],
  },
  marketResearch: {
    id: 'marketResearch',
    name: 'Market Research',
    nameDE: 'Marktforschung',
    description: 'Understand your target market and competitors',
    descriptionDE: 'Verstehe deinen Zielmarkt und Wettbewerber',
    icon: Target,
    color: '#00E676',
    defaultBlocks: [
      {
        type: 'HEADER',
        content: {
          title: 'Market Research Survey',
          subtitle: 'Help us understand your needs'
        }
      },
      {
        type: 'SINGLE_CHOICE',
        content: {
          question: 'What is your role?',
          options: ['Founder/CEO', 'Product Manager', 'Developer', 'Designer', 'Other'],
          allowOther: true
        }
      },
      {
        type: 'MULTI_CHOICE',
        content: {
          question: 'Which tools do you currently use?',
          options: ['Tool A', 'Tool B', 'Tool C', 'None'],
          allowOther: true
        }
      },
      {
        type: 'RATING',
        content: {
          question: 'How satisfied are you with current solutions?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very unsatisfied',
          maxLabel: 'Very satisfied',
          style: 'stars'
        }
      },
      {
        type: 'TEXT_INPUT',
        content: {
          question: 'What features are missing in current tools?',
          placeholder: 'Describe missing features...',
          multiline: true
        }
      },
      {
        type: 'SINGLE_CHOICE',
        content: {
          question: 'What would you pay for a better solution?',
          options: ['$0 - Free only', '$1-10/month', '$11-50/month', '$51-100/month', '$100+/month']
        }
      },
    ],
  },
  quickFeedback: {
    id: 'quickFeedback',
    name: 'Quick Feedback',
    nameDE: 'Schnelles Feedback',
    description: 'Get fast feedback with minimal questions',
    descriptionDE: 'Erhalte schnelles Feedback mit minimalen Fragen',
    icon: ThumbsUp,
    color: '#7C3AED',
    defaultBlocks: [
      {
        type: 'HEADER',
        content: {
          title: 'Quick Feedback',
          subtitle: 'Just 2 minutes of your time'
        }
      },
      {
        type: 'NPS',
        content: {
          question: 'How would you rate your overall experience?',
          minLabel: 'Poor',
          maxLabel: 'Excellent'
        }
      },
      {
        type: 'TEXT_INPUT',
        content: {
          question: 'Any comments or suggestions?',
          placeholder: 'Your feedback...',
          multiline: true,
          required: false
        }
      },
    ],
  },
  blank: {
    id: 'blank',
    name: 'Blank Survey',
    nameDE: 'Leere Umfrage',
    description: 'Start from scratch',
    descriptionDE: 'Von Grund auf neu',
    icon: MessageSquare,
    color: '#6B7280',
    defaultBlocks: [
      {
        type: 'HEADER',
        content: {
          title: 'Survey Title',
          subtitle: 'Subtitle or description'
        }
      },
    ],
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export const generateSurveyId = () => `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
export const generateBlockId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
export const generateResponseId = () => `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const createSurveyFromTemplate = (templateId) => {
  const template = SURVEY_TEMPLATES[templateId];
  if (!template) return null;

  return {
    id: generateSurveyId(),
    templateId,
    title: template.name,
    description: template.description,
    blocks: template.defaultBlocks.map((block) => ({
      id: generateBlockId(),
      type: block.type,
      content: { ...SURVEY_BLOCK_TYPES[block.type].defaultContent, ...block.content },
    })),
    settings: {
      showProgressBar: true,
      allowBack: true,
      shuffleQuestions: false,
      requireAllQuestions: false,
      thankYouMessage: 'Thank you for your feedback!',
      redirectUrl: '',
    },
    responses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const createBlock = (blockType) => {
  const blockDef = SURVEY_BLOCK_TYPES[blockType];
  if (!blockDef) return null;

  return {
    id: generateBlockId(),
    type: blockType,
    content: { ...blockDef.defaultContent },
  };
};

// Get blocks by category
export const getBlocksByCategory = (category) => {
  return Object.entries(SURVEY_BLOCK_TYPES)
    .filter(([_, block]) => block.category === category)
    .map(([key, block]) => ({ key, ...block }));
};

export default {
  SURVEY_BLOCK_TYPES,
  SURVEY_TEMPLATES,
  generateSurveyId,
  generateBlockId,
  generateResponseId,
  createSurveyFromTemplate,
  createBlock,
  getBlocksByCategory,
};
