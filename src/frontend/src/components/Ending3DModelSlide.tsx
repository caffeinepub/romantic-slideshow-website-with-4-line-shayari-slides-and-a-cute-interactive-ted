import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sparkles, RotateCcw, Send } from 'lucide-react';
import { DrawNameCanvas } from './DrawNameCanvas';
import { ModelViewer3D } from './ModelViewer3D';
import { resolveModelFromName, getSupportedNames } from '../lib/modelCatalog';
import { sfxEngine } from '../lib/sfxEngine';

interface Ending3DModelSlideProps {
  sfxEnabled: boolean;
  volume: number;
}

export function Ending3DModelSlide({ sfxEnabled, volume }: Ending3DModelSlideProps) {
  const [inputName, setInputName] = useState('');
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const canvasRef = useRef<{ clear: () => void } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputName.trim()) {
      setErrorMessage('Please enter a name!');
      return;
    }

    const modelPath = resolveModelFromName(inputName);
    
    if (modelPath) {
      setCurrentModel(modelPath);
      setErrorMessage('');
      // Play SFX on successful model swap
      sfxEngine.playTap(sfxEnabled, volume);
    } else {
      const suggestions = getSupportedNames();
      setErrorMessage(
        `I don't know that one yet—try: ${suggestions.slice(0, 5).join(', ')}${suggestions.length > 5 ? ', ...' : ''}`
      );
    }
  };

  const handleClearCanvas = () => {
    canvasRef.current?.clear();
  };

  const handleReset = () => {
    setInputName('');
    setCurrentModel(null);
    setErrorMessage('');
    canvasRef.current?.clear();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-romantic-bg-start to-romantic-bg-end">
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

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 p-4 md:p-8">
        {/* Left Panel - Drawing & Input */}
        <Card className="w-full md:w-96 bg-white/95 dark:bg-black/90 backdrop-blur-md border-2 border-romantic-primary shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-romantic-primary">
              ✨ Create Magic
            </CardTitle>
            <CardDescription className="text-base">
              Draw the name below, then type it to see it come to life in 3D!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drawing Canvas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Draw here:</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCanvas}
                  className="text-xs"
                >
                  Clear Canvas
                </Button>
              </div>
              <DrawNameCanvas ref={canvasRef} />
            </div>

            {/* Text Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <label htmlFor="name-input" className="text-sm font-medium">
                  Type the name:
                </label>
                <Input
                  id="name-input"
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="e.g., rose, teddy, castle..."
                  className="text-base"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-romantic-primary hover:bg-romantic-primary/90 text-white font-bold"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                Show 3D Model
              </Button>
            </form>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>
            )}

            {/* Reset Button */}
            {currentModel && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Right Panel - 3D Viewer */}
        <div className="w-full md:flex-1 h-[400px] md:h-[600px] max-w-3xl">
          <Card className="w-full h-full bg-white/95 dark:bg-black/90 backdrop-blur-md border-2 border-romantic-primary shadow-2xl overflow-hidden">
            <CardContent className="p-0 w-full h-full">
              {currentModel ? (
                <ModelViewer3D modelPath={currentModel} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="text-6xl md:text-8xl mb-6 animate-pulse-slow">
                    🎨
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-romantic-primary mb-2">
                    Ready to Create?
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Draw and type the name of an object, place, or being to see it transform into an interactive 3D model!
                  </p>
                  <div className="mt-6 text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Try these:</p>
                    <p className="text-romantic-primary font-semibold">
                      {getSupportedNames().slice(0, 6).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
