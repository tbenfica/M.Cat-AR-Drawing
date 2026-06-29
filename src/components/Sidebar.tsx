import React, { useState, useRef, useEffect } from 'react';
import { 
  Library, Sparkles, Type as TypeIcon, Edit2, Upload, 
  Settings, Camera, CameraOff, Lock, HelpCircle, RefreshCw,
  Palette, Grid, Check, Loader2, Trash2, Sliders, ChevronLeft, ChevronRight
} from 'lucide-react';
import { PREMADE_SKETCHES, PremadeSketch } from '../premadeSketches';
import { TracingState, StrokeColor, CameraDevice } from '../types';

interface SidebarProps {
  onSelectSketch: (svg: string, viewBox: string) => void;
  state: TracingState;
  setState: React.Dispatch<React.SetStateAction<TracingState>>;
  isCameraActive: boolean;
  setIsCameraActive: (active: boolean) => void;
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  onOpenTutorial: () => void;
}

type ActiveTab = 'premade' | 'ai' | 'calligraphy' | 'freehand' | 'upload';

export default function Sidebar({
  onSelectSketch,
  state,
  setState,
  isCameraActive,
  setIsCameraActive,
  selectedDeviceId,
  setSelectedDeviceId,
  onOpenTutorial
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('upload');
  
  // Premade State
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const categories = ['Todos', 'Animais', 'Natureza', 'Anime & Desenhos', 'Letras & Caligrafia', 'Mandalas'];

  // AI Generation State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLoadingMessage, setAiLoadingMessage] = useState<string>('');

  // Calligraphy State
  const [calligraphyText, setCalligraphyText] = useState<string>('Criar Arte');
  const [selectedFont, setSelectedFont] = useState<string>("'Great Vibes', cursive");
  const [fontSize, setFontSize] = useState<number>(20);
  const calligraphyFonts = [
    { name: 'Caligrafia Pincel', value: "'Great Vibes', cursive" },
    { name: 'Cursiva Suave', value: "'Dancing Script', cursive" },
    { name: 'Serifa Clássica', value: "'Playfair Display', serif" },
    { name: 'Medieval / Romano', value: "'Cinzel', serif" },
    { name: 'Sem Serifa Moderno', value: "'Montserrat', sans-serif" },
    { name: 'Código Monofônico', value: "'JetBrains Mono', monospace" }
  ];

  // Freehand Drawing State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);

  // Camera devices state
  const [cameraDevices, setCameraDevices] = useState<CameraDevice[]>([]);

  // Enumerate cameras on mount
  useEffect(() => {
    async function getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices
          .filter(device => device.kind === 'videoinput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Câmera ${cameraDevices.length + 1}`
          }));
        setCameraDevices(videoDevices);
      } catch (err) {
        console.warn("Could not list camera devices in sidebar:", err);
      }
    }
    getCameras();
  }, [isCameraActive]);

  // Render Premade Sketches
  const filteredSketches = PREMADE_SKETCHES.filter(sketch => 
    selectedCategory === 'Todos' || sketch.category === selectedCategory
  );

  // Call AI Endpoint to Generate custom SVG Sketch
  const handleGenerateAiSketch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setAiError(null);

    const messages = [
      "Esboçando as linhas iniciais...",
      "Calculando pontos de vetorização...",
      "Limpando o traçado para facilitar o decalque...",
      "Finalizando estrutura SVG..."
    ];
    
    let msgIndex = 0;
    setAiLoadingMessage(messages[0]);
    const messageInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setAiLoadingMessage(messages[msgIndex]);
    }, 1500);

    try {
      const response = await fetch('/api/generate-sketch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Não foi possível gerar o esboço por IA.');
      }

      // Load generated SVG on canvas
      onSelectSketch(data.svgContent, '0 0 100 100');
      setAiPrompt('');
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Erro de conexão com o servidor de IA.');
    } finally {
      clearInterval(messageInterval);
      setIsGenerating(false);
    }
  };

  // Programmatic text calligraphy generator
  const handleApplyCalligraphy = () => {
    if (!calligraphyText.trim()) return;

    // We generate a responsive SVG on-the-fly containing the styled text
    // The text is aligned horizontally and vertically, with high-contrast outlines (fill="none" stroke="currentColor")
    const generatedSVG = `
      <svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
        <text 
          x="50" 
          y="25" 
          font-family="${selectedFont}" 
          font-size="${fontSize}" 
          text-anchor="middle" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="0.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >${calligraphyText}</text>
      </svg>
    `;

    onSelectSketch(generatedSVG, '0 0 100 40');
  };

  // Trigger calligraphy on font, size or text change
  useEffect(() => {
    if (activeTab === 'calligraphy') {
      handleApplyCalligraphy();
    }
  }, [calligraphyText, selectedFont, fontSize, activeTab]);

  // Hand Drawing (Sketchpad) Methods
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    // Check if it's a touch event
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startCanvasDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getCanvasCoordinates(e);
    lastPosRef.current = pos;
    setIsDrawing(true);
    
    // Draw a point immediately
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#f8fafc'; // White outline
      ctx.fill();
    }
  };

  const drawOnCanvas = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPosRef.current) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const pos = getCanvasCoordinates(e);
    
    if (ctx && lastPosRef.current) {
      ctx.beginPath();
      ctx.strokeStyle = '#f8fafc'; // Slated/white lines
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      
      lastPosRef.current = pos;
    }
  };

  const stopCanvasDrawing = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const setCanvasAsSketch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if canvas is empty before exporting
    const blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    if (canvas.toDataURL() === blank.toDataURL()) {
      alert("Esboce algo no quadro antes de definir como guia!");
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');
    // Load canvas as guide directly (Our TracingCanvas supports render of standard image URLs!)
    onSelectSketch(dataUrl, '0 0 100 100');
  };

  // Handle local File upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedImageName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onSelectSketch(dataUrl, '0 0 100 100');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div 
      id="sidebar_container" 
      className={`fixed top-0 left-0 h-full bg-slate-950/80 border-r border-white/10 backdrop-blur-2xl transition-all duration-300 z-40 flex shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ${
        isOpen ? 'w-80 md:w-96' : 'w-0'
      }`}
    >
      {/* Toggle button pulling out the sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="btn_toggle_sidebar"
        className="absolute top-1/2 -translate-y-1/2 -right-10 w-10 h-20 bg-slate-950/90 hover:bg-slate-900/90 border-t border-b border-r border-white/10 rounded-r-xl flex items-center justify-center text-slate-400 hover:text-white backdrop-blur-md transition shadow-lg z-50 pointer-events-auto"
        title={isOpen ? "Esconder Menu" : "Mostrar Menu"}
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* Actual Sidebar Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-wider font-sans">M.cat <span className="text-cyan-400">Air Drawing</span></h1>
              <p className="text-[9px] text-slate-400 tracking-widest font-mono uppercase">Decalcar & Desenhar</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenTutorial}
              id="btn_sidebar_tutorial"
              title="Como usar o App"
              className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 rounded-xl backdrop-blur-sm transition"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Sub-panel active configuration content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* TAB 1: PREMADE SKETCHES */}
          {activeTab === 'premade' && (
            <div id="panel_premade" className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-1.5 px-3 rounded-full text-[10px] font-semibold border transition duration-200 ${
                      selectedCategory === cat 
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20 font-bold' 
                        : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {filteredSketches.map((sketch) => (
                  <button
                    key={sketch.id}
                    onClick={() => onSelectSketch(sketch.svgContent, sketch.viewBox)}
                    className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300 text-left flex flex-col justify-between h-28 relative overflow-hidden group shadow-lg"
                  >
                    {/* Tiny thumbnail preview */}
                    <div className="absolute right-2 bottom-2 w-12 h-12 opacity-10 group-hover:opacity-35 text-white transition pointer-events-none">
                      <svg viewBox={sketch.viewBox} className="w-full h-full fill-none stroke-current stroke-[3]">
                        <g dangerouslySetInnerHTML={{ __html: sketch.svgContent }} />
                      </svg>
                    </div>
                    
                    <div className="space-y-1 z-10">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold font-mono uppercase ${
                        sketch.difficulty === 'Fácil' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        sketch.difficulty === 'Médio' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {sketch.difficulty}
                      </span>
                      <h4 className="text-[11px] font-bold text-slate-200 font-sans group-hover:text-white transition leading-tight pt-1">{sketch.name}</h4>
                    </div>

                    <span className="text-[9px] font-medium text-slate-500 font-sans z-10">{sketch.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AI SKETCH GENERATOR */}
          {activeTab === 'ai' && (
            <div id="panel_ai" className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 font-sans uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Gerador de Contornos por IA
                </label>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  Digite qualquer ideia (ex: "gato fofo dormindo", "rosa com espinhos", "dragão minimalista") e a inteligência artificial desenhará um esboço vetorizado de linhas limpas pronto para você decalcar.
                </p>
              </div>

              <form onSubmit={handleGenerateAiSketch} className="space-y-3">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ex: Flor de lótus simples..."
                  disabled={isGenerating}
                  rows={3}
                  id="textarea_ai_prompt"
                  className="w-full p-3 bg-white/5 border border-white/10 focus:border-cyan-400 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none font-sans"
                />

                {aiError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] text-rose-400 font-medium font-sans">
                    {aiError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGenerating || !aiPrompt.trim()}
                  id="btn_ai_generate"
                  className="w-full py-3.5 px-4 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 disabled:bg-white/5 disabled:text-slate-600 text-slate-950 rounded-xl font-bold tracking-wide transition flex items-center justify-center gap-2 text-xs shadow-lg shadow-cyan-500/20"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{aiLoadingMessage}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Gerar Esboço Vetorizado</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: TEXT & CALLIGRAPHY */}
          {activeTab === 'calligraphy' && (
            <div id="panel_calligraphy" className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 font-sans uppercase tracking-wide">
                  Texto para Caligrafia
                </label>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  Crie guias de palavras personalizadas. Ideal para exercitar caligrafia, lettering, fazer cartazes ou praticar assinaturas elegantes.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-sans mb-1 block">O que você quer escrever:</label>
                  <input
                    type="text"
                    value={calligraphyText}
                    onChange={(e) => setCalligraphyText(e.target.value)}
                    placeholder="Sua palavra..."
                    id="input_calligraphy_text"
                    className="w-full py-2.5 px-3 bg-white/5 border border-white/10 focus:border-cyan-400 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-sans mb-1 block">Estilo de Fonte Caligráfica:</label>
                  <div className="grid grid-cols-1 gap-1.5 max-h-44 overflow-y-auto pr-1">
                    {calligraphyFonts.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => setSelectedFont(font.value)}
                        className={`p-2.5 rounded-xl text-left border transition flex items-center justify-between ${
                          selectedFont === font.value
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-[10px] font-sans font-medium">{font.name}</span>
                        <span 
                          style={{ fontFamily: font.value }} 
                          className="text-xs max-w-[120px] truncate pr-2 text-slate-100"
                        >
                          AaZz
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-sans mb-1">
                    <span>Tamanho do Texto:</span>
                    <span className="font-mono font-bold text-slate-200">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleApplyCalligraphy}
                  id="btn_apply_calligraphy"
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition"
                >
                  Recriar Guia de Texto
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: FREEHAND DRAWING SKETCHPAD */}
          {activeTab === 'freehand' && (
            <div id="panel_freehand" className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 font-sans uppercase tracking-wide">
                  Prancheta de Rascunho
                </label>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  Desenhe um rascunho com o dedo no quadro abaixo e defina-o como guia. Ótimo para duplicar ou decalcar seus próprios rabiscos.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-2 flex flex-col items-center">
                  <canvas
                    ref={canvasRef}
                    width={260}
                    height={200}
                    onMouseDown={startCanvasDrawing}
                    onMouseMove={drawOnCanvas}
                    onMouseUp={stopCanvasDrawing}
                    onMouseLeave={stopCanvasDrawing}
                    onTouchStart={startCanvasDrawing}
                    onTouchMove={drawOnCanvas}
                    onTouchEnd={stopCanvasDrawing}
                    className="bg-slate-900 border border-white/5 rounded-xl cursor-crosshair touch-none"
                    style={{ width: '260px', height: '200px' }}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearCanvas}
                    className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Limpar Quadro
                  </button>

                  <button
                    onClick={setCanvasAsSketch}
                    className="flex-1 py-2 px-3 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Definir como Guia
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div id="panel_upload" className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 font-sans uppercase tracking-wide">
                  Carregar Imagem Local
                </label>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  Escolha qualquer foto (PNG, JPEG) da sua galeria. Ela será convertida automaticamente em um contorno de alto contraste (nos modos de cores vermelho, azul ou preto) para facilitar o decalque!
                </p>
              </div>

              <div className="space-y-3">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-cyan-400 rounded-2xl p-6 text-center cursor-pointer bg-white/5 hover:bg-white/10 transition group"
                >
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 mx-auto mb-2.5 transition" />
                  <span className="text-xs font-bold text-slate-300 block mb-1 group-hover:text-slate-100 transition">Selecione uma imagem</span>
                  <span className="text-[10px] text-slate-500">PNG ou JPG até 5MB</span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                {uploadedImageName && (
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                    <div className="truncate pr-4">
                      <span className="text-[10px] text-slate-500 block">Carregado com sucesso:</span>
                      <span className="text-[11px] font-semibold text-slate-200 truncate block">{uploadedImageName}</span>
                    </div>
                    <button
                      onClick={() => {
                        setUploadedImageName(null);
                        onSelectSketch('', '0 0 100 100');
                      }}
                      className="p-1 hover:bg-white/10 text-slate-400 hover:text-rose-400 rounded-lg transition"
                      title="Remover guia"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION: ADJUSTMENTS / CONTROLS (Always visible at bottom scroll) */}
          <div className="border-t border-white/10 pt-5 space-y-5">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Settings className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold font-sans uppercase tracking-wider">Ajustes do Esboço</span>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                <span>Opacidade da Guia:</span>
                <span className="font-mono font-bold text-slate-200">{Math.round(state.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={state.opacity * 100}
                onChange={(e) => setState(prev => ({ ...prev, opacity: parseFloat(e.target.value) / 100 }))}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Line Color selectors */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-sans">Cor do Contorno (Mais visível para traçar):</span>
              <div className="grid grid-cols-5 gap-1.5">
                {(['black', 'red', 'blue', 'green', 'white'] as StrokeColor[]).map((col) => {
                  const label = col === 'black' ? 'Preto' : col === 'red' ? 'Vermelho' : col === 'blue' ? 'Azul' : col === 'green' ? 'Verde' : 'Branco';
                  return (
                    <button
                      key={col}
                      onClick={() => setState(prev => ({ ...prev, color: col }))}
                      title={label}
                      className={`h-9 rounded-xl border transition flex items-center justify-center relative ${
                        state.color === col 
                          ? 'border-cyan-400 bg-cyan-400/20' 
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border border-neutral-950/20 shadow-sm ${
                        col === 'black' ? 'bg-slate-950' : 
                        col === 'red' ? 'bg-red-500' : 
                        col === 'blue' ? 'bg-blue-500' : 
                        col === 'green' ? 'bg-emerald-500' : 
                        'bg-white'
                      }`} />
                      {state.color === col && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full flex items-center justify-center text-[8px] text-slate-950">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flip / Mirror modifiers */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-sans font-medium">Inversão e Espelhamento:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setState(prev => ({ ...prev, mirrorX: !prev.mirrorX }))}
                  className={`flex-1 py-2 px-2 border rounded-xl text-[10px] font-bold font-sans transition ${
                    state.mirrorX 
                      ? 'bg-cyan-500/15 text-cyan-400 border-cyan-400/40 shadow-sm' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-255'
                  }`}
                >
                  Espelhar Horizontal
                </button>
                <button
                  onClick={() => setState(prev => ({ ...prev, mirrorY: !prev.mirrorY }))}
                  className={`flex-1 py-2 px-2 border rounded-xl text-[10px] font-bold font-sans transition ${
                    state.mirrorY 
                      ? 'bg-cyan-500/15 text-cyan-400 border-cyan-400/40 shadow-sm' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-255'
                  }`}
                >
                  Espelhar Vertical
                </button>
              </div>
            </div>

            {/* Line thickness slider (for pre-made / calligraphy SVG paths) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                <span>Espessura das Linhas:</span>
                <span className="font-mono font-bold text-slate-200">{state.strokeWidth}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={state.strokeWidth}
                onChange={(e) => setState(prev => ({ ...prev, strokeWidth: parseFloat(e.target.value) }))}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Camera settings inside sidebar */}
            <div className="border-t border-white/10 pt-5 space-y-3">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold font-sans uppercase tracking-wider">Configurar Câmera</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className={`flex-1 py-2 px-3 border rounded-xl text-xs font-bold font-sans transition flex items-center justify-center gap-1.5 ${
                    isCameraActive 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-255'
                  }`}
                >
                  {isCameraActive ? (
                    <>
                      <Camera className="w-3.5 h-3.5" />
                      Câmera Ativada
                    </>
                  ) : (
                    <>
                      <CameraOff className="w-3.5 h-3.5" />
                      Câmera Desligada
                    </>
                  )}
                </button>
              </div>

              {isCameraActive && cameraDevices.length > 0 && (
                <div>
                  <label className="text-[10px] text-slate-500 mb-1 block">Selecione o Dispositivo:</label>
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-900 border border-white/10 rounded-xl text-[11px] text-slate-300 focus:outline-none"
                  >
                    {cameraDevices.map((dev) => (
                      <option key={dev.deviceId} value={dev.deviceId}>
                        {dev.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Giant Lock Tracing Button */}
            <div className="pt-2">
              <button
                onClick={() => setState(prev => ({ ...prev, isLocked: true }))}
                id="btn_sidebar_lock"
                className="w-full py-3.5 px-4 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-sans font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Bloquear Tela para Decalque (Tracing)
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
