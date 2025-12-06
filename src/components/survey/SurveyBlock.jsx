import React from 'react';
import { GripVertical, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import { SURVEY_BLOCK_TYPES } from '../../utils/surveyTemplates';
import {
  SingleChoiceBlock,
  MultiChoiceBlock,
  RatingBlock,
  TextInputBlock,
  NPSBlock,
  YesNoBlock,
  HeaderBlock,
  DescriptionBlock,
  ProblemStatementBlock,
  HypothesisBlock,
  SolutionTestBlock,
} from './blocks';

const BLOCK_COMPONENTS = {
  SINGLE_CHOICE: SingleChoiceBlock,
  MULTI_CHOICE: MultiChoiceBlock,
  RATING: RatingBlock,
  TEXT_INPUT: TextInputBlock,
  NPS: NPSBlock,
  YES_NO: YesNoBlock,
  HEADER: HeaderBlock,
  DESCRIPTION: DescriptionBlock,
  PROBLEM_STATEMENT: ProblemStatementBlock,
  HYPOTHESIS: HypothesisBlock,
  SOLUTION_TEST: SolutionTestBlock,
};

const SurveyBlock = ({
  block,
  index,
  totalBlocks,
  isSelected,
  isEditing,
  isPreview,
  response,
  onSelect,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onResponse,
}) => {
  const BlockComponent = BLOCK_COMPONENTS[block.type];
  const blockDef = SURVEY_BLOCK_TYPES[block.type];

  if (!BlockComponent) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
        Unknown block type: {block.type}
      </div>
    );
  }

  // Preview mode - minimal wrapper
  if (isPreview) {
    return (
      <div className="py-2">
        <BlockComponent
          content={block.content}
          onChange={(newContent) => onChange(block.id, newContent)}
          isEditing={false}
          isPreview={true}
          response={response}
          onResponse={onResponse}
        />
      </div>
    );
  }

  // Editor mode
  return (
    <div
      className={`group relative rounded-2xl border transition-all ${
        isSelected
          ? 'border-[#FF6B35]/50 bg-[#FF6B35]/5'
          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
      }`}
      onClick={() => onSelect && onSelect(block.id)}
    >
      {/* Block Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <div className="cursor-grab text-white/30 hover:text-white/50 transition-colors">
          <GripVertical className="h-4 w-4" />
        </div>

        <div
          className="w-6 h-6 rounded flex items-center justify-center"
          style={{
            background: `${blockDef?.category === 'question' ? '#FF6B35' : blockDef?.category === 'validation' ? '#00D4FF' : '#7C3AED'}15`,
          }}
        >
          {blockDef?.icon && (
            <blockDef.icon
              className="h-3.5 w-3.5"
              style={{
                color: blockDef?.category === 'question' ? '#FF6B35' : blockDef?.category === 'validation' ? '#00D4FF' : '#7C3AED',
              }}
            />
          )}
        </div>

        <span className="text-xs text-white/40 uppercase tracking-wider flex-1">
          {blockDef?.name || block.type}
        </span>

        {/* Block Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp && onMoveUp(block.id);
            }}
            disabled={index === 0}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown && onMoveDown(block.id);
            }}
            disabled={index === totalBlocks - 1}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate && onDuplicate(block.id);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(block.id);
            }}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Block Content */}
      <div className="p-4">
        <BlockComponent
          content={block.content}
          onChange={(newContent) => onChange(block.id, newContent)}
          isEditing={isEditing || isSelected}
          isPreview={false}
          response={response}
          onResponse={onResponse}
        />
      </div>
    </div>
  );
};

export default SurveyBlock;
