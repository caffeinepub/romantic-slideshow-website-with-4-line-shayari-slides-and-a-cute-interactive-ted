import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Music } from 'lucide-react';
import { shayariCollection } from '../data/shayari';
import { ShayariSlide } from './ShayariSlide';
import { SlideIndicator } from './SlideIndicator';
import { Ending3DModelSlide } from './Ending3DModelSlide';
import { MusicControls } from './MusicControls';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import { useLocalAudioSettings } from '../hooks/useLocalAudioSettings';
import { sfxEngine } from '../lib/sfxEngine';

const backgrounds = [
  '/assets/generated/romantic-bg-1.dim_1920x1080.png',
  '/assets/generated/romantic-bg-2.dim_1920x1080.png',
];

export function Slideshow() {
  const totalSlides = shayariCollection.length + 1; // +1 for ending 3D model game
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMusicControls, setShowMusicControls] = useState(false);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isEnabled, volume, sfxEnabled } = useLocalAudioSettings();

  // Initialize audio with Tum Hi Ho
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/assets/audio/tum-hi-ho.mp3');
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;
    audio.volume = volume;

    if (isEnabled) {
      audio.play().catch(() => {
        // Autoplay blocked - set flag to retry on next user interaction
        setNeedsUserGesture(true);
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [isEnabled, volume]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Retry play on user interaction if autoplay was blocked
  useEffect(() => {
    if (needsUserGesture && isEnabled && audioRef.current) {
      const handleInteraction = () => {
        if (audioRef.current && isEnabled) {
          audioRef.current.play().then(() => {
            setNeedsUserGesture(false);
          }).catch(() => {
            // Still blocked, will retry on next interaction
          });
        }
      };

      window.addEventListener('click', handleInteraction, { once: true });
      window.addEventListener('touchstart', handleInteraction, { once: true });

      return () => {
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
      };
    }
  }, [needsUserGesture, isEnabled]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
      // Play navigation SFX
      sfxEngine.playNavigation(sfxEnabled, volume);
    }
  };

  const nextSlide = () => {
    goToSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    goToSlide(currentSlide - 1);
  };

  // Swipe navigation
  useSwipeNavigation({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
    elementRef: containerRef,
  });

  const isLastSlide = currentSlide === totalSlides - 1;
  const isFirstSlide = currentSlide === 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden touch-pan-y"
    >
      {/* Slide Content */}
      <div className="w-full h-full">
        {currentSlide < shayariCollection.length ? (
          <ShayariSlide
            shayari={shayariCollection[currentSlide]}
            backgroundImage={backgrounds[currentSlide % backgrounds.length]}
          />
        ) : (
          <Ending3DModelSlide sfxEnabled={sfxEnabled} volume={volume} />
        )}
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center px-4 md:px-8 pointer-events-none z-20">
        <button
          onClick={prevSlide}
          disabled={isFirstSlide}
          className={`pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all hover:bg-white/30 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none shadow-lg ${
            isFirstSlide ? 'invisible' : ''
          }`}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isLastSlide}
          className={`pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all hover:bg-white/30 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none shadow-lg ${
            isLastSlide ? 'invisible' : ''
          }`}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </button>
      </div>

      {/* Slide Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <SlideIndicator currentSlide={currentSlide} totalSlides={totalSlides} />
      </div>

      {/* Music Controls Toggle */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => setShowMusicControls(!showMusicControls)}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all hover:bg-white/30 hover:scale-110 shadow-lg"
          aria-label="Toggle music controls"
        >
          <Music className="w-5 h-5 text-white" />
        </button>

        {showMusicControls && (
          <div className="absolute top-14 right-0 animate-fade-in">
            <MusicControls />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-3 text-center text-white/60 text-sm z-20">
        <p>
          © {new Date().getFullYear()} Built with ♥ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'romantic-shayari'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-romantic-primary transition-colors underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
