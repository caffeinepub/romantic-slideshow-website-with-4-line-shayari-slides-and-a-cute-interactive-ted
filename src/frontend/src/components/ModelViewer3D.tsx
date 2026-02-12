import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

interface ModelProps {
  modelPath: string;
}

function Model({ modelPath }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
}

interface ModelViewer3DProps {
  modelPath: string;
}

export function ModelViewer3D({ modelPath }: ModelViewer3DProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 1, 3]} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />
        
        {/* Environment for reflections */}
        <Environment preset="sunset" />
        
        {/* Model */}
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#e91e63" wireframe />
            </mesh>
          }
        >
          <Model modelPath={modelPath} />
        </Suspense>
        
        {/* Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={10}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          makeDefault
        />
      </Canvas>
      
      {/* Loading overlay */}
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-romantic-primary" />
              <p className="text-sm text-muted-foreground">Loading 3D model...</p>
            </div>
          </div>
        }
      >
        <div />
      </Suspense>
    </div>
  );
}
