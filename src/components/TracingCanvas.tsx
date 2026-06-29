import React, { useState, useRef, useEffect } from 'react';
import { Lock, Unlock, Move, RotateCw, ZoomIn, ZoomOut, RotateCcw, HelpCircle } from 'lucide-react';
import { TracingState, StrokeColor } from '../types';

interface TracingCanvasProps {
  svgContent: string;
  viewBox: string;
  state: TracingState;
  setState: React.Dispatch<React.SetStateAction<TracingState>>;
}

export default function TracingCanvas({
  svgContent,
  viewBox,
  state,
  setState
}: TracingCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Parse color names to CSS color values or Tailwind text classes
  const getColorClass = (color: StrokeColor) => {
    switch (color) {
      case 'black': return 'text-neutral-950 dark:text-neutral-50';
      case 'red': return 'text-red-500';
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-emerald-500';
      case 'white': return 'text-white';
      default: return 'text-neutral-950';
    }
  };

  // Drag handlers (Mouse & Touch) for positioning the sketch
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (state.isLocked) return;
    
    // Check if the click is on a control button rather than the canvas
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - state.translateX,
      y: e.clientY - state.translateY
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || state.isLocked) return;

    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;

    setState(prev => ({
      ...prev,
      translateX: newX,
      translateY: newY
    }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStartRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {
      // Ignore failure to release capture if pointer was already lost
    }
  };

  // Support mouse wheel zooming as an alternative shortcut
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (state.isLocked) return;
    e.preventDefault();
    const zoomFactor = 0.05;
    const direction = e.deltaY < 0 ? 1 : -1;
    const newScale = Math.max(0.1, Math.min(5, state.scale + direction * zoomFactor));
    
    setState(prev => ({
      ...prev,
      scale: parseFloat(newScale.toFixed(2))
    }));
  };

  // Check if svgContent is a full SVG tag or just children
  const renderSVGElement = () => {
    if (!svgContent) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-neutral-500 p-4 font-sans text-center">
          <HelpCircle className="w-12 h-12 text-neutral-600 mb-2 animate-bounce" />
          <p className="text-sm font-medium text-neutral-400">Nenhum desenho selecionado</p>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs">Escolha um modelo pronto ou gere um com IA na barra de ferramentas.</p>
        </div>
      );
    }

    const trimmed = svgContent.trim();
    const isFullSVG = trimmed.startsWith('<svg');
    const isImageURL = trimmed.startsWith('data:image/') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://');

    if (isImageURL) {
      // Build CSS filter based on color
      let imageFilter = 'none';
      switch (state.color) {
        case 'black': 
          imageFilter = 'grayscale(100%) contrast(300%) brightness(110%)'; 
          break;
        case 'red': 
          imageFilter = 'grayscale(100%) contrast(300%) sepia(100%) hue-rotate(-50deg) saturate(1000%)'; 
          break;
        case 'blue': 
          imageFilter = 'grayscale(100%) contrast(300%) sepia(100%) hue-rotate(180deg) saturate(1000%)'; 
          break;
        case 'green': 
          imageFilter = 'grayscale(100%) contrast(300%) sepia(100%) hue-rotate(90deg) saturate(1000%)'; 
          break;
        case 'white': 
          imageFilter = 'grayscale(100%) contrast(300%) invert(100%)'; 
          break;
      }

      return (
        <img 
          src={trimmed} 
          alt="Guia de Decalque" 
          className="w-full h-full object-contain pointer-events-none select-none" 
          style={{ filter: imageFilter }} 
        />
      );
    }

    if (isFullSVG) {
      // Process full SVG: ensure it uses stroke="currentColor", fill="none"
      // We wrap it in a div that controls currentColor and injects the markup.
      return (
        <div 
          className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:fill-none [&_svg]:stroke-current"
          dangerouslySetInnerHTML={{ __html: trimmed }}
        />
      );
    } else {
      // If it's just the inner SVG tags (pre-made elements), wrap them in a standard viewBox SVG
      return (
        <svg 
          viewBox={viewBox || "0 0 100 100"} 
          className="w-full h-full fill-none stroke-current"
          style={{ strokeWidth: state.strokeWidth }}
        >
          <g dangerouslySetInnerHTML={{ __html: trimmed }} />
        </svg>
      );
    }
  };

  // Reset positioning transforms
  const resetTransforms = () => {
    setState(prev => ({
      ...prev,
      scale: 1.0,
      rotation: 0,
      translateX: 0,
      translateY: 0,
      mirrorX: false,
      mirrorY: false
    }));
  };

  // Combine transforms: mirror, scale, rotation, translation
  const transformStyle: React.CSSProperties = {
    transform: `
      translate(${state.translateX}px, ${state.translateY}px)
      scaleX(${state.mirrorX ? -state.scale : state.scale})
      scaleY(${state.mirrorY ? -state.scale : state.scale})
      rotate(${state.rotation}deg)
    `,
    opacity: state.opacity,
    transition: isDragging ? 'none' : 'transform 0.1s ease-out, opacity 0.15s ease-in-out',
    cursor: state.isLocked ? 'default' : isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div 
      ref={containerRef}
      id="tracing_canvas_wrapper"
      className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden z-20 select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* Target Tracing Overlay Container */}
      <div 
        id="tracing_svg_container"
        style={transformStyle}
        className={`w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] flex items-center justify-center transition-all ${getColorClass(state.color)}`}
      >
        {renderSVGElement()}
      </div>

      {/* Guide/Grid overlay when NOT locked (Visual assistance) */}
      {!state.isLocked && svgContent && (
        <div className="absolute inset-0 border-2 border-dashed border-white/5 pointer-events-none flex items-center justify-center">
          <div className="absolute w-full h-px bg-white/5" />
          <div className="absolute h-full w-px bg-white/5" />
          <p className="absolute bottom-4 left-4 text-[10px] font-mono text-slate-400 bg-slate-950/80 border border-white/10 px-2.5 py-1.5 rounded-xl backdrop-blur-md">
            Dica: Arraste o desenho para mover ou use o Scroll para dar zoom.
          </p>
        </div>
      )}

      {/* Lock Tracing Screen Mode HUD */}
      {state.isLocked && (
        <div id="locked_overlay_hud" className="absolute inset-0 bg-slate-950/20 pointer-events-none z-50 flex flex-col justify-between p-4">
          {/* Top Lock status bar */}
          <div className="flex justify-between items-center bg-slate-950/80 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg max-w-sm mx-auto pointer-events-auto">
            <div className="flex items-center gap-2 text-cyan-400 font-sans font-medium text-sm">
              <Lock className="w-4 h-4 animate-pulse" />
              <span>Modo Tracing Bloqueado</span>
            </div>
            
            <button
              onClick={() => setState(prev => ({ ...prev, isLocked: false }))}
              id="btn_unlock_screen"
              className="ml-4 py-1 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-full transition duration-150 flex items-center gap-1 shadow-lg shadow-cyan-500/20"
            >
              <Unlock className="w-3 h-3" />
              Desbloquear
            </button>
          </div>

          {/* Bottom notice */}
          <div className="text-center text-xs font-sans text-slate-300 bg-slate-950/80 py-1.5 px-3 rounded-full max-w-xs mx-auto pointer-events-none backdrop-blur-md border border-white/10 shadow-lg">
            Toques na tela estão ignorados para facilitar o traçado.
          </div>
        </div>
      )}

      {/* Quick Action Overlay (Scale, Rotate, Reset shortcuts) when not locked and image selected */}
      {!state.isLocked && svgContent && (
        <div id="quick_canvas_toolbar" className="absolute bottom-6 left-6 z-30 flex flex-col gap-2 bg-slate-950/80 border border-white/10 p-2.5 rounded-2xl backdrop-blur-md shadow-2xl">
          <div className="flex gap-1.5">
            <button
              onClick={() => setState(prev => ({ ...prev, scale: Math.max(0.1, parseFloat((prev.scale - 0.1).toFixed(2))) }))}
              title="Diminuir"
              className="p-1.5 bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/15 rounded-lg transition"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-300 w-10 text-center flex items-center justify-center">
              {Math.round(state.scale * 100)}%
            </span>
            <button
              onClick={() => setState(prev => ({ ...prev, scale: Math.min(5.0, parseFloat((prev.scale + 0.1).toFixed(2))) }))}
              title="Aumentar"
              className="p-1.5 bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/15 rounded-lg transition"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-1.5 border-t border-white/10 pt-2">
            <button
              onClick={() => setState(prev => ({ ...prev, rotation: (prev.rotation - 15) % 360 }))}
              title="Girar Anti-horário"
              className="p-1.5 bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/15 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-300 w-10 text-center flex items-center justify-center">
              {state.rotation}°
            </span>
            <button
              onClick={() => setState(prev => ({ ...prev, rotation: (prev.rotation + 15) % 360 }))}
              title="Girar Horário"
              className="p-1.5 bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/15 rounded-lg transition"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={resetTransforms}
            id="btn_reset_transforms"
            className="w-full mt-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 hover:text-white text-[10px] font-bold text-slate-300 rounded-lg border border-white/10 transition text-center"
          >
            Redefinir Posição
          </button>
        </div>
      )}
    </div>
  );
}
