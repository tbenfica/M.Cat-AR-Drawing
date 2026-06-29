import React from 'react';
import { X, BookOpen, Smartphone, Layers, CheckCircle2, ShieldAlert } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      title: "1. Prepare seu Suporte",
      description: "Coloque o celular paralelo à mesa. Você pode usar um suporte articulado, uma pilha de livros ou até apoiar o celular em cima de um copo de vidro transparente alto (onde a câmera filma através do copo).",
      icon: <Smartphone className="w-6 h-6 text-cyan-400" />,
      visual: (
        <div className="w-full h-32 bg-slate-950/40 border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-2 w-16 h-2 bg-slate-800 rounded-full" />
          {/* Books representation */}
          <div className="absolute bottom-0 left-6 w-24 h-16 bg-amber-900/40 border-t border-r border-amber-800/40 rounded-tr-lg flex flex-col justify-end p-2 gap-1">
            <div className="h-2 bg-amber-600/30 rounded w-full" />
            <div className="h-2 bg-amber-700/30 rounded w-[90%]" />
            <div className="h-2 bg-amber-800/30 rounded w-[95%]" />
          </div>
          {/* Transparent Cup representation */}
          <div className="w-12 h-20 border-2 border-dashed border-white/20 rounded-b-xl relative flex items-center justify-center mt-4 bg-slate-950/20">
            <div className="absolute top-0 w-12 h-2 border-b border-white/20" />
            <div className="w-8 h-1 bg-cyan-500/30 rounded-full absolute bottom-4 animate-pulse" />
          </div>
          {/* Phone pointing down */}
          <div className="absolute top-6 left-12 w-28 h-6 bg-slate-800 border border-white/10 rounded-md flex items-center px-2 gap-1.5 shadow-lg transform rotate-[-5deg]">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            <div className="w-12 h-1 bg-slate-600 rounded" />
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse ml-auto" />
          </div>
        </div>
      )
    },
    {
      title: "2. Posicione o Papel",
      description: "Coloque uma folha de papel em branco na mesa diretamente sob a câmera do celular. Certifique-se de que a iluminação da sua mesa está boa para ver o lápis claramente.",
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      visual: (
        <div className="w-full h-32 bg-slate-950/40 border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden">
          {/* Table surface */}
          <div className="absolute bottom-0 w-full h-4 bg-slate-950 border-t border-white/5" />
          {/* Paper sheet */}
          <div className="w-36 h-24 bg-white/95 border border-slate-200 shadow-md rounded transform rotate-1 flex flex-col justify-between p-2">
            <div className="border border-dashed border-slate-300 w-full h-full rounded flex items-center justify-center">
              <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">Desenho Real</span>
            </div>
          </div>
          {/* Pencil */}
          <div className="absolute right-8 top-6 w-1 h-16 bg-amber-500 rounded transform rotate-[35deg] shadow-md flex flex-col justify-between">
            <div className="w-full h-2 bg-slate-800 rounded-t" />
            <div className="w-full h-2 bg-pink-400" />
          </div>
        </div>
      )
    },
    {
      title: "3. Ajuste a Opacidade e Tamanho",
      description: "Envie qualquer desenho ou foto do seu celular. Use o slider de Opacidade na tela. Reduzir a opacidade (ex: 45%) é o segredo para conseguir ver a linha virtual e a ponta do seu lápis físico ao mesmo tempo!",
      icon: <BookOpen className="w-6 h-6 text-cyan-400" />,
      visual: (
        <div className="w-full h-32 bg-slate-950/40 border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden">
          {/* Solid line representing background and half-transparent overlays */}
          <div className="w-20 h-20 border-2 border-white/10 rounded-full flex items-center justify-center relative bg-slate-950/40">
            {/* Real drawing line */}
            <div className="absolute w-12 h-12 border-2 border-slate-500 rounded-full" />
            {/* Overlay drawing line (Red and half-transparent) */}
            <div className="absolute w-12 h-12 border-2 border-cyan-500 border-dashed rounded-full animate-pulse opacity-60" />
            <div className="text-[10px] font-mono text-cyan-400 font-semibold">AR 50%</div>
          </div>
          {/* Slider visual */}
          <div className="absolute bottom-2 w-[70%] h-1 bg-white/10 rounded-full flex items-center">
            <div className="w-[50%] h-full bg-cyan-500 rounded-full" />
            <div className="w-3 h-3 bg-white rounded-full border border-cyan-500 shadow" />
          </div>
        </div>
      )
    },
    {
      title: "4. Bloqueie a Tela e Comece!",
      description: "Quando o desenho digital estiver no tamanho e posição ideais sobre o papel, clique no botão \"Bloquear Tela\". Toques acidentais serão ignorados enquanto você desenha olhando pela tela do celular!",
      icon: <CheckCircle2 className="w-6 h-6 text-cyan-400" />,
      visual: (
        <div className="w-full h-32 bg-slate-950/40 border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500 rounded-full flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20 animate-bounce">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Pronto para Traçar!</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div id="tutorial_modal_backdrop" className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div 
        id="tutorial_modal_content" 
        className="bg-slate-900/90 border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-cyan-400">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white font-sans uppercase tracking-wide">Como Usar o M.cat Air Drawing</h2>
          </div>
          <button 
            onClick={onClose}
            id="btn_close_tutorial"
            className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white/10 rounded-xl border border-white/10">
                    {step.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-white font-sans">{step.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{step.description}</p>
                {step.visual}
              </div>
            ))}
          </div>

          {/* Iframe advice warning */}
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <h5 className="text-xs font-semibold text-cyan-400 font-sans">Importante sobre Permissão de Câmera:</h5>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Se você não conseguir ativar a câmera, é porque o navegador bloqueia o acesso à webcam por motivos de segurança dentro de visualizações de iframe integradas.
                Para resolver, basta clicar no botão <span className="text-white font-semibold">"Abrir em Nova Guia" / "Open in new tab"</span> no topo do seu editor de código para rodar o app em tela cheia!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            id="btn_start_drawing"
            className="py-2.5 px-6 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 text-xs font-bold rounded-xl transition shadow-lg shadow-cyan-500/20"
          >
            Entendi, Começar a Desenhar!
          </button>
        </div>
      </div>
    </div>
  );
}
