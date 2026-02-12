interface SlideIndicatorProps {
  currentSlide: number;
  totalSlides: number;
}

export function SlideIndicator({ currentSlide, totalSlides }: SlideIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Dots */}
      <div className="flex gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={index}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-8 h-2 bg-romantic-primary'
                : 'w-2 h-2 bg-white/40'
            }`}
          />
        ))}
      </div>
      
      {/* Counter */}
      <div className="text-white/80 text-sm font-medium">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
}
