import { Shayari } from '../data/shayari';

interface ShayariSlideProps {
  shayari: Shayari;
  backgroundImage: string;
}

export function ShayariSlide({ shayari, backgroundImage }: ShayariSlideProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Shayari Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12">
        <div className="backdrop-blur-sm bg-white/10 dark:bg-black/20 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <div className="space-y-4 text-center">
            {shayari.map((line, index) => (
              <p 
                key={index}
                className="text-xl md:text-3xl lg:text-4xl font-serif text-white leading-relaxed animate-fade-in"
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
