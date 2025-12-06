// Block Components for LinkedIn Carousel Builder
export { default as TextBlock } from './TextBlock';
export { default as ImageBlock } from './ImageBlock';
export { default as IconBlock } from './IconBlock';
export { default as BrandingBlock } from './BrandingBlock';
export { default as DividerBlock } from './DividerBlock';
export { default as BadgeBlock } from './BadgeBlock';
export { default as NumberBlock } from './NumberBlock';
export { default as QuoteBlock } from './QuoteBlock';
export { default as BulletListBlock } from './BulletListBlock';

// Block type to component mapping
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import IconBlock from './IconBlock';
import BrandingBlock from './BrandingBlock';
import DividerBlock from './DividerBlock';
import BadgeBlock from './BadgeBlock';
import NumberBlock from './NumberBlock';
import QuoteBlock from './QuoteBlock';
import BulletListBlock from './BulletListBlock';

export const BLOCK_COMPONENTS = {
  HEADING: TextBlock,
  SUBHEADING: TextBlock,
  PARAGRAPH: TextBlock,
  IMAGE: ImageBlock,
  ICON: IconBlock,
  BRANDING: BrandingBlock,
  DIVIDER: DividerBlock,
  BADGE: BadgeBlock,
  NUMBER: NumberBlock,
  QUOTE: QuoteBlock,
  BULLET_LIST: BulletListBlock,
};

// Get the component for a block type
export const getBlockComponent = (blockType) => {
  return BLOCK_COMPONENTS[blockType] || TextBlock;
};
