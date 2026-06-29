import React, { useState, useEffect } from 'react';
import { 
  Lock, BookOpen, Smartphone, ExternalLink, RefreshCw, 
  Sparkles, Camera, Sliders, ChevronRight, HelpCircle 
} from 'lucide-react';
import CameraFeed from './components/CameraFeed';
import TracingCanvas from './components/TracingCanvas';
import Sidebar from './components/Sidebar';
import TutorialModal from './components/TutorialModal';
import { TracingState, StrokeColor } from './types';
import { PREMADE_SKETCHES } from './premadeSketches';

export default function App() {
  // Initialize tracing configuration
  // We default to a visible red color (standard in animation for tracing) and 0.5 opacity
  const [tracingState, setTracingState] = useState<TracingState>({
    scale: 1.0,
    rotation: 0,
    opacity: 0.5,
    mirrorX: false,
    mirrorY: false,
    color: 'red',
    strokeWidth: 2,
    translateX: 0,
    translateY: 0,
    isLocked: false,
  });

  // Default sketch to start with (so the canvas isn't empty)
  const defaultSketch = PREMADE_SKETCHES[0];
  const [selectedSketch, setSelectedSketch] = useState<string>(defaultSketch.svgContent);
  const [selectedViewBox, setSelectedViewBox] = useState<string>(defaultSketch.viewBox);

  // Camera Management States
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // Tutorial / Onboarding Modal State
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  // Auto-open tutorial on first visit using local storage
  useEffect(() => {
    const hasVisited = localStorage.getItem('ar_drawing_visited');
    if (!hasVisited) {
      setIsTutorialOpen(true);
      localStorage.setItem('ar_drawing_visited', 'true');
    }
  }, []);

  // Set selected sketch
  const handleSelectSketch = (svgContent: string, viewBox: string) => {
    setSelectedSketch(svgContent);
    setSelectedViewBox(viewBox);
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* 1. Live Camera Stream Background */}
      <CameraFeed 
        isCameraActive={isCameraActive}
        setIsCameraActive={setIsCameraActive}
        selectedDeviceId={selectedDeviceId}
        setSelectedDeviceId={setSelectedDeviceId}
      />

      {/* 2. Overlaid Tracing Canvas (Sketch projection overlay) */}
      <TracingCanvas 
        svgContent={selectedSketch}
        viewBox={selectedViewBox}
        state={tracingState}
        setState={setTracingState}
      />

      {/* 3. Floating Minimal Header Toolbar (Hidden when locked) */}
      {!tracingState.isLocked && (
        <header id="app_header_floating" className="absolute top-4 right-4 left-4 md:left-auto z-30 flex flex-wrap gap-2 justify-between md:justify-end items-center pointer-events-none">
          {/* Brand identifier for mobile/freestanding layout */}
          <div className="md:hidden flex items-center gap-1.5 bg-slate-950/80 border border-white/10 backdrop-blur-md py-1.5 px-3 rounded-full pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-white">M.cat Air Drawing</span>
          </div>

          <div className="flex gap-2 pointer-events-auto ml-auto">
            {/* Tutorial Button */}
            <button
              onClick={() => setIsTutorialOpen(true)}
              id="header_btn_tutorial"
              className="py-2 px-3 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 rounded-full text-xs font-semibold backdrop-blur-md transition shadow-md flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Como Desenhar</span>
            </button>

            {/* Lock Tracing Shortcut */}
            <button
              onClick={() => setTracingState(prev => ({ ...prev, isLocked: true }))}
              id="header_btn_lock"
              className="py-2 px-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full text-xs font-bold transition shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Bloquear Tela</span>
            </button>
          </div>
        </header>
      )}

      {/* 4. Left Drawer Side Controller Panel (Contains tabs for Premade, AI, Text, Upload, Camera) */}
      <Sidebar 
        onSelectSketch={handleSelectSketch}
        state={tracingState}
        setState={setTracingState}
        isCameraActive={isCameraActive}
        setIsCameraActive={setIsCameraActive}
        selectedDeviceId={selectedDeviceId}
        setSelectedDeviceId={setSelectedDeviceId}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      {/* 5. Instruction Onboarding Tutorial Modal */}
      <TutorialModal 
        isOpen={isTutorialOpen} 
        onClose={() => setIsTutorialOpen(false)} 
      />

      {/* Help corner tooltip helper (Hidden when locked) */}
      {!tracingState.isLocked && (
        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 pointer-events-none z-10 hidden lg:flex flex-col gap-1.5 max-w-[180px] bg-slate-950/60 border border-white/10 p-4 rounded-2xl backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-1.5 text-slate-200">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Modo Tracing</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            Apoie o celular, envie um desenho, ajuste a opacidade e contorne olhando pela tela!
          </p>
        </div>
      )}

    </div>
  );
}
