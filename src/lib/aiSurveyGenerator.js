// ============================================
// AI SURVEY GENERATOR
// Uses local AI for survey generation
// ============================================

import { callAI } from './ai/config';

/**
 * Generate survey questions from a hypothesis/topic
 */
export const generateSurveyFromHypothesis = async ({
  hypothesis,
  surveyType = 'problemValidation',
  questionCount = 5,
  language = 'de',
  onProgress = () => {}
}) => {
  if (!hypothesis || hypothesis.trim().length < 10) {
    throw new Error('Bitte gib eine Hypothese mit mindestens 10 Zeichen ein.');
  }

  onProgress({ stage: 'analyzing', percentage: 20 });

  let blocks;

  try {
    // Try to use AI for survey generation
    onProgress({ stage: 'generating', percentage: 40 });

    const result = await callAI('ideas', {
      topic: `Survey questions for: ${hypothesis}`,
      count: questionCount,
      platform: 'survey',
      language: language,
    });

    onProgress({ stage: 'formatting', percentage: 70 });

    // Convert AI ideas to survey blocks if successful
    if (result.data?.ideas || result.ideas) {
      const ideas = result.data?.ideas || result.ideas || [];
      blocks = convertIdeasToBlocks(ideas, hypothesis, surveyType, language);
    } else {
      // Fallback to template blocks
      blocks = generateTemplateBlocks(hypothesis, surveyType, questionCount, language);
    }
  } catch (error) {
    console.warn('AI survey generation failed, using templates:', error);
    onProgress({ stage: 'formatting', percentage: 70 });
    blocks = generateTemplateBlocks(hypothesis, surveyType, questionCount, language);
  }

  onProgress({ stage: 'complete', percentage: 100 });

  return {
    id: `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: hypothesis.slice(0, 50),
    description: hypothesis,
    blocks,
    settings: {
      showProgressBar: true,
      allowBack: true,
      shuffleQuestions: false,
      requireAllQuestions: false,
      thankYouMessage: language === 'de' ? 'Vielen Dank für dein Feedback!' : 'Thank you for your feedback!',
      theme: 'dark',
      accentColor: '#FF6B35',
    },
    responses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      generatedAt: new Date().toISOString(),
      hypothesis,
      surveyType,
      questionCount,
      language,
      aiGenerated: true,
    }
  };
};

/**
 * Convert AI-generated ideas to survey blocks
 */
const convertIdeasToBlocks = (ideas, hypothesis, surveyType, language) => {
  const blocks = [];
  const isDE = language === 'de';

  // Header
  blocks.push({
    id: `block_${Date.now()}_header`,
    type: 'HEADER',
    content: {
      title: hypothesis.slice(0, 40),
      subtitle: isDE ? 'Wir schätzen deine ehrliche Meinung' : 'We value your honest opinion'
    }
  });

  // Convert ideas to questions
  ideas.slice(0, 5).forEach((idea, index) => {
    const questionText = typeof idea === 'string' ? idea : idea.title || idea.text || `Question ${index + 1}`;

    if (index === 0) {
      blocks.push({
        id: `block_${Date.now()}_${index}`,
        type: 'YES_NO',
        content: {
          question: questionText,
          required: true,
          yesLabel: isDE ? 'Ja' : 'Yes',
          noLabel: isDE ? 'Nein' : 'No'
        }
      });
    } else if (index === 1) {
      blocks.push({
        id: `block_${Date.now()}_${index}`,
        type: 'RATING',
        content: {
          question: questionText,
          minValue: 1,
          maxValue: 5,
          minLabel: isDE ? 'Gar nicht' : 'Not at all',
          maxLabel: isDE ? 'Sehr' : 'Very much',
          required: true,
          style: 'stars'
        }
      });
    } else {
      blocks.push({
        id: `block_${Date.now()}_${index}`,
        type: 'TEXT_INPUT',
        content: {
          question: questionText,
          placeholder: isDE ? 'Deine Antwort...' : 'Your answer...',
          required: false,
          multiline: true,
          maxLength: 500
        }
      });
    }
  });

  return blocks;
};

/**
 * Generate template-based blocks (fallback)
 */
const generateTemplateBlocks = (hypothesis, surveyType, questionCount, language) => {
  return generateMockBlocks(hypothesis, surveyType, questionCount, language);
};

const generateMockBlocks = (hypothesis, surveyType, questionCount, language) => {
  const blocks = [];
  const isDE = language === 'de';

  // Header
  blocks.push({
    id: `block_${Date.now()}_header`,
    type: 'HEADER',
    content: {
      title: hypothesis.slice(0, 40),
      subtitle: isDE ? 'Wir schätzen deine ehrliche Meinung' : 'We value your honest opinion'
    }
  });

  // Hypothesis block (hidden from respondent)
  blocks.push({
    id: `block_${Date.now()}_hypo`,
    type: 'HYPOTHESIS',
    content: {
      hypothesis: hypothesis,
      metrics: isDE ? 'Erfolg wenn >60% Zustimmung' : 'Success if >60% agree',
      showToRespondent: false
    }
  });

  if (surveyType === 'problemValidation') {
    blocks.push({
      id: `block_${Date.now()}_1`,
      type: 'YES_NO',
      content: {
        question: isDE ? 'Hast du dieses Problem selbst erlebt?' : 'Have you experienced this problem yourself?',
        required: true,
        yesLabel: isDE ? 'Ja' : 'Yes',
        noLabel: isDE ? 'Nein' : 'No'
      }
    });

    blocks.push({
      id: `block_${Date.now()}_2`,
      type: 'RATING',
      content: {
        question: isDE ? 'Wie schmerzhaft ist dieses Problem für dich?' : 'How painful is this problem for you?',
        minValue: 1,
        maxValue: 5,
        minLabel: isDE ? 'Gar nicht' : 'Not at all',
        maxLabel: isDE ? 'Sehr schmerzhaft' : 'Very painful',
        required: true,
        style: 'stars'
      }
    });

    blocks.push({
      id: `block_${Date.now()}_3`,
      type: 'SINGLE_CHOICE',
      content: {
        question: isDE ? 'Wie oft tritt dieses Problem bei dir auf?' : 'How often do you face this problem?',
        options: isDE
          ? ['Täglich', 'Wöchentlich', 'Monatlich', 'Selten']
          : ['Daily', 'Weekly', 'Monthly', 'Rarely'],
        required: true,
        allowOther: false
      }
    });

    blocks.push({
      id: `block_${Date.now()}_4`,
      type: 'TEXT_INPUT',
      content: {
        question: isDE ? 'Wie löst du dieses Problem aktuell?' : 'How do you currently solve this problem?',
        placeholder: isDE ? 'Beschreibe deine aktuelle Lösung...' : 'Describe your current solution...',
        required: false,
        multiline: true,
        maxLength: 500
      }
    });
  } else if (surveyType === 'ideaValidation') {
    blocks.push({
      id: `block_${Date.now()}_desc`,
      type: 'DESCRIPTION',
      content: {
        text: isDE
          ? `Stell dir vor: ${hypothesis}. Wie würdest du darauf reagieren?`
          : `Imagine: ${hypothesis}. How would you react?`
      }
    });

    blocks.push({
      id: `block_${Date.now()}_1`,
      type: 'SOLUTION_TEST',
      content: {
        solutionDescription: hypothesis,
        question: isDE ? 'Würde diese Lösung dir helfen?' : 'Would this solution help you?',
        options: isDE
          ? ['Definitiv ja', 'Wahrscheinlich ja', 'Nicht sicher', 'Wahrscheinlich nicht', 'Definitiv nicht']
          : ['Definitely yes', 'Probably yes', 'Not sure', 'Probably not', 'Definitely not']
      }
    });

    blocks.push({
      id: `block_${Date.now()}_2`,
      type: 'NPS',
      content: {
        question: isDE
          ? 'Wie wahrscheinlich würdest du diese Lösung weiterempfehlen?'
          : 'How likely would you recommend this solution?',
        minLabel: isDE ? 'Unwahrscheinlich' : 'Not likely',
        maxLabel: isDE ? 'Sehr wahrscheinlich' : 'Very likely',
        required: true
      }
    });

    blocks.push({
      id: `block_${Date.now()}_3`,
      type: 'SINGLE_CHOICE',
      content: {
        question: isDE ? 'Was würdest du für diese Lösung bezahlen?' : 'What would you pay for this solution?',
        options: isDE
          ? ['Nichts - nur kostenlos', '1-10€/Monat', '11-50€/Monat', '50€+/Monat']
          : ['Nothing - free only', '$1-10/month', '$11-50/month', '$50+/month'],
        required: true,
        allowOther: false
      }
    });

    blocks.push({
      id: `block_${Date.now()}_4`,
      type: 'TEXT_INPUT',
      content: {
        question: isDE ? 'Was würde diese Lösung für dich verbessern?' : 'What would make this solution better for you?',
        placeholder: isDE ? 'Deine Vorschläge...' : 'Your suggestions...',
        required: false,
        multiline: true,
        maxLength: 500
      }
    });
  } else {
    // Default questions
    for (let i = 0; i < Math.min(questionCount, 5); i++) {
      blocks.push({
        id: `block_${Date.now()}_q${i}`,
        type: i % 2 === 0 ? 'SINGLE_CHOICE' : 'RATING',
        content: i % 2 === 0
          ? {
              question: isDE ? `Frage ${i + 1} zu "${hypothesis.slice(0, 20)}..."` : `Question ${i + 1} about "${hypothesis.slice(0, 20)}..."`,
              options: isDE ? ['Option A', 'Option B', 'Option C'] : ['Option A', 'Option B', 'Option C'],
              required: true
            }
          : {
              question: isDE ? `Bewerte Aspekt ${i + 1}` : `Rate aspect ${i + 1}`,
              minValue: 1,
              maxValue: 5,
              minLabel: isDE ? 'Schlecht' : 'Poor',
              maxLabel: isDE ? 'Ausgezeichnet' : 'Excellent',
              style: 'stars'
            }
      });
    }
  }

  return blocks;
};

export const SURVEY_TYPES = {
  problemValidation: {
    id: 'problemValidation',
    name: 'Problem Validation',
    nameDE: 'Problem-Validierung',
    description: 'Validate if a problem exists and how painful it is',
    descriptionDE: 'Prüfe ob ein Problem existiert und wie schmerzhaft es ist',
    icon: '🔍'
  },
  ideaValidation: {
    id: 'ideaValidation',
    name: 'Idea Validation',
    nameDE: 'Ideen-Validierung',
    description: 'Test if your solution idea resonates with users',
    descriptionDE: 'Teste ob deine Lösungsidee bei Nutzern ankommt',
    icon: '💡'
  },
  marketResearch: {
    id: 'marketResearch',
    name: 'Market Research',
    nameDE: 'Marktforschung',
    description: 'Understand your target market',
    descriptionDE: 'Verstehe deinen Zielmarkt',
    icon: '📊'
  },
  customerFeedback: {
    id: 'customerFeedback',
    name: 'Customer Feedback',
    nameDE: 'Kunden-Feedback',
    description: 'Collect feedback from existing customers',
    descriptionDE: 'Sammle Feedback von bestehenden Kunden',
    icon: '💬'
  }
};

export default {
  generateSurveyFromHypothesis,
  SURVEY_TYPES
};
