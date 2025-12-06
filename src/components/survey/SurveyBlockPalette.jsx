import React from 'react';
import { SURVEY_BLOCK_TYPES, getBlocksByCategory } from '../../utils/surveyTemplates';
import { useLanguage } from '../../context/LanguageContext';

const SurveyBlockPalette = ({ onAddBlock }) => {
  const { language } = useLanguage();

  const categories = [
    { id: 'question', label: language === 'de' ? 'Fragen' : 'Questions', color: '#FF6B35' },
    { id: 'content', label: language === 'de' ? 'Inhalt' : 'Content', color: '#7C3AED' },
    { id: 'validation', label: language === 'de' ? 'Validierung' : 'Validation', color: '#00D4FF' },
  ];

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const blocks = getBlocksByCategory(category.id);
        if (blocks.length === 0) return null;

        return (
          <div key={category.id}>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: category.color }}
            >
              {category.label}
            </h3>
            <div className="space-y-2">
              {blocks.map((block) => {
                const Icon = block.icon;
                const name = language === 'de' ? block.nameDE : block.name;

                return (
                  <button
                    key={block.key}
                    onClick={() => onAddBlock(block.key)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group text-left"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                      style={{
                        background: `${category.color}15`,
                        border: `1px solid ${category.color}30`,
                      }}
                    >
                      <Icon className="h-4 w-4" style={{ color: category.color }} />
                    </div>
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SurveyBlockPalette;
