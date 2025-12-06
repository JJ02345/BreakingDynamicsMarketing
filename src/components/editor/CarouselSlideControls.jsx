import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CarouselSlideControls = ({
  activeSlideIndex,
  totalSlides,
  onPrev,
  onNext,
}) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#1A1A1D] rounded-xl px-4 py-2 border border-white/10">
      <button
        onClick={onPrev}
        disabled={activeSlideIndex === 0}
        className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>
      <span className="text-white font-medium">
        {activeSlideIndex + 1} / {totalSlides}
      </span>
      <button
        onClick={onNext}
        disabled={activeSlideIndex === totalSlides - 1}
        className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

export default CarouselSlideControls;
