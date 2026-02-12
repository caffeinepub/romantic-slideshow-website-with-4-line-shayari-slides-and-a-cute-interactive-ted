import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Sparkles, RotateCcw } from 'lucide-react';
import { sfxEngine } from '../lib/sfxEngine';

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
}

const GOAL = 50;
const COMPLETION_MESSAGES = [
  "You've filled my heart with love! 💕",
  "Our love is complete! 💖",
  "Together we created magic! ✨",
  "Love is in the air! 🥰",
];

interface EndingGameSlideProps {
  sfxEnabled: boolean;
  volume: number;
}

export function EndingGameSlide({ sfxEnabled, volume }: EndingGameSlideProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const heartIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const completionSoundPlayedRef = useRef(false);

  useEffect(() => {
    if (score >= GOAL && !isComplete) {
      setIsComplete(true);
      setCompletionMessage(
        COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)]
      );
      
      // Play completion sound once
      if (!completionSoundPlayedRef.current) {
        sfxEngine.playCompletion(sfxEnabled, volume);
        completionSoundPlayedRef.current = true;
      }
    }
  }, [score, isComplete, sfxEnabled, volume]);

  const handleInteraction = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (isComplete) return;

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Create multiple hearts at click/tap position
    const newHearts: Heart[] = [];
    const heartCount = Math.floor(Math.random() * 3) + 2; // 2-4 hearts per tap

    for (let i = 0; i < heartCount; i++) {
      newHearts.push({
        id: heartIdRef.current++,
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        size: Math.random() * 20 + 20, // 20-40px
        rotation: Math.random() * 360,
        delay: i * 0.1,
      });
    }

    setHearts((prev) => [...prev, ...newHearts]);
    setScore((prev) => prev + heartCount);

    // Play tap SFX
    sfxEngine.playTap(sfxEnabled, volume);

    // Remove hearts after animation completes
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)));
    }, 2000);
  };

  const handleReset = () => {
    setHearts([]);
    setScore(0);
    setIsComplete(false);
    setCompletionMessage('');
    completionSoundPlayedRef.current = false;
  };

  const progress = Math.min((score / GOAL) * 100, 100);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-romantic-bg-start to-romantic-bg-end cursor-pointer select-none"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Animated background sparkles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-sparkle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          >
            <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </div>
        ))}
      </div>

      {/* Game UI */}
      {!isComplete ? (
        <>
          {/* Instructions */}
          <div className="absolute top-8 md:top-16 z-20 px-4 text-center animate-fade-in">
            <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl border-2 border-romantic-primary">
              <p className="text-lg md:text-2xl font-bold text-romantic-primary mb-1">
                Tap anywhere to create hearts! 💕
              </p>
              <p className="text-sm md:text-base text-muted-foreground">
                Collect {GOAL} hearts to complete the magic
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute top-32 md:top-40 left-1/2 -translate-x-1/2 w-[80%] max-w-md z-20">
            <div className="bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-full h-6 md:h-8 overflow-hidden border-2 border-white/50 shadow-lg">
              <div
                className="h-full bg-gradient-to-r from-romantic-primary to-accent transition-all duration-300 ease-out flex items-center justify-end pr-2"
                style={{ width: `${progress}%` }}
              >
                {score > 0 && (
                  <span className="text-white text-xs md:text-sm font-bold drop-shadow">
                    {score}/{GOAL}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Central prompt */}
          <div className="z-10 text-center animate-pulse-slow">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center shadow-2xl">
              <span className="text-6xl md:text-8xl animate-heart-beat">💖</span>
            </div>
            <p className="mt-6 text-white text-lg md:text-xl font-medium drop-shadow-lg">
              Tap to spread the love!
            </p>
          </div>
        </>
      ) : (
        /* Completion Screen */
        <div className="z-20 text-center animate-scale-in px-4">
          <div className="bg-white/95 dark:bg-black/90 backdrop-blur-md px-8 py-10 md:px-12 md:py-14 rounded-3xl shadow-2xl border-4 border-romantic-primary max-w-lg">
            <div className="text-7xl md:text-9xl mb-6 animate-heart-beat">
              💝
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-romantic-primary mb-4">
              {completionMessage}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              You collected {score} hearts!
            </p>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              size="lg"
              className="bg-romantic-primary hover:bg-romantic-primary/90 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg transition-all hover:scale-105"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </Button>
          </div>
        </div>
      )}

      {/* Floating Hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute pointer-events-none animate-heart-float"
          style={{
            left: heart.x,
            top: heart.y,
            fontSize: `${heart.size}px`,
            transform: `rotate(${heart.rotation}deg)`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          <img
            src="/assets/generated/heart-particles-pack.dim_128x128.png"
            alt=""
            className="w-full h-full object-contain drop-shadow-lg"
            style={{ width: heart.size, height: heart.size }}
          />
        </div>
      ))}
    </div>
  );
}
