import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw, AlertTriangle, Disc, FlipHorizontal, RotateCw } from 'lucide-react';
import { CameraDevice } from '../types';

interface CameraFeedProps {
  onCameraActiveChange?: (active: boolean) => void;
  isCameraActive: boolean;
  setIsCameraActive: (active: boolean) => void;
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
}

export default function CameraFeed({
  isCameraActive,
  setIsCameraActive,
  selectedDeviceId,
  setSelectedDeviceId,
  onCameraActiveChange
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [frozenImageData, setFrozenImageData] = useState<string | null>(null);

  // Orientation states (Mirroring and Rotation) to fix inverted cameras
  const [isMirrored, setIsMirrored] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);

  // Dynamic style applied to both active video stream and static frozen image
  const cameraStyle = {
    transform: `scaleX(${isMirrored ? -1 : 1}) rotate(${rotation}deg)`,
    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  // Unified Camera initialization & device listing with robust fallback constraints
  useEffect(() => {
    let active = true;

    async function startCamera() {
      if (!isCameraActive) {
        stopCamera();
        return;
      }

      setError(null);
      stopCamera();

      try {
        // Step 1: Define constraints
        const constraints: MediaStreamConstraints = {
          video: {
            deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: selectedDeviceId ? undefined : 'environment'
          },
          audio: false
        };

        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (firstErr) {
          console.warn("Falha com restrições exatas, tentando restrições simples...", firstErr);
          try {
            // Fallback to simpler constraints
            stream = await navigator.mediaDevices.getUserMedia({
              video: selectedDeviceId ? { deviceId: selectedDeviceId } : { facingMode: 'environment' },
              audio: false
            });
          } catch (secondErr) {
            console.warn("Falha com restrições intermediárias, tentando qualquer câmera...", secondErr);
            // Absolute fallback
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            });
          }
        }
        
        if (!active) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => {
            console.error("Erro ao dar play no vídeo:", err);
          });
        }
        
        // Step 2: Once stream is active, enumerate video devices
        try {
          const deviceInfos = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = deviceInfos
            .filter(device => device.kind === 'videoinput')
            .map((device, idx) => ({
              deviceId: device.deviceId,
              label: device.label || `Câmera ${idx + 1}`
            }));

          setDevices(videoDevices);

          // Auto-select the active track's device ID if nothing is selected yet
          const activeTrack = stream.getVideoTracks()[0];
          if (activeTrack && !selectedDeviceId) {
            const settings = activeTrack.getSettings();
            if (settings.deviceId && settings.deviceId !== selectedDeviceId) {
              setSelectedDeviceId(settings.deviceId);
            }
          }
        } catch (enumErr) {
          console.warn("Falha ao enumerar dispositivos pós-inicialização:", enumErr);
        }

        if (onCameraActiveChange) {
          onCameraActiveChange(true);
        }
      } catch (err: any) {
        console.error("Erro completo ao acessar a câmera:", err);
        setError(
          "Ops! A câmera está bloqueada ou não foi encontrada. Se você estiver usando o editor de código, clique no botão 'Abrir em Nova Aba' logo abaixo para que o navegador possa pedir a permissão de câmera corretamente!"
        );
        setIsCameraActive(false);
        if (onCameraActiveChange) {
          onCameraActiveChange(false);
        }
      }
    }

    startCamera();

    return () => {
      active = false;
    };
  }, [isCameraActive, selectedDeviceId]);

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  // Freeze / Unfreeze camera frame
  function toggleFreeze() {
    if (isFrozen) {
      setIsFrozen(false);
      setFrozenImageData(null);
    } else {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw current video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          setFrozenImageData(dataUrl);
          setIsFrozen(true);
        }
      }
    }
  }

  // Switch to next available camera
  function switchCamera() {
    if (devices.length <= 1) return;
    const currentIndex = devices.findIndex(d => d.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    setSelectedDeviceId(devices[nextIndex].deviceId);
  }

  return (
    <div id="camera_feed_container" className="absolute inset-0 w-full h-full bg-neutral-900 overflow-hidden flex items-center justify-center">
      {/* Hidden canvas for capturing snapshots/freezing frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Video Feed */}
      {isCameraActive && !isFrozen && (
        <video
          ref={videoRef}
          id="camera_video_element"
          className="w-full h-full object-cover select-none pointer-events-none"
          style={cameraStyle}
          playsInline
          muted
        />
      )}

      {/* Frozen Static Frame */}
      {isFrozen && frozenImageData && (
        <img
          src={frozenImageData}
          alt="Câmera Congelada"
          id="frozen_camera_image"
          className="w-full h-full object-cover select-none pointer-events-none"
          style={cameraStyle}
        />
      )}

      {/* Error & Onboarding State when camera is inactive */}
      {(!isCameraActive || error) && (
        <div id="camera_fallback_state" className="max-w-md p-8 bg-slate-950/80 rounded-3xl border border-white/10 text-center mx-4 space-y-5 shadow-2xl backdrop-blur-xl z-10">
          <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-rose-400 border border-white/10">
            {error ? <AlertTriangle className="w-8 h-8" /> : <CameraOff className="w-8 h-8 text-slate-400" />}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white font-sans">
              {error ? "Acesso à câmera bloqueado" : "Câmera Desativada"}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              {error || "Ative a sua câmera para ver a sua mesa/papel e poder contornar o esboço digital diretamente sobre a folha física."}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsCameraActive(true);
                setIsFrozen(false);
              }}
              id="btn_enable_camera"
              className="w-full py-3.5 px-4 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 rounded-2xl font-bold transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Camera className="w-5 h-5" />
              Ativar Câmera Traseira
            </button>
            
            {error && (
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                id="link_new_tab"
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-2xl text-sm font-bold transition duration-200 block text-center"
              >
                Abrir em Nova Aba (Recomendado)
              </a>
            )}
          </div>
        </div>
      )}

      {/* Quick Camera In-Feed Overlays for status */}
      {isCameraActive && (
        <div id="camera_status_badge" className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/80 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold font-mono text-slate-300 shadow-md">
          <div className={`w-2.5 h-2.5 rounded-full ${isFrozen ? 'bg-amber-500 animate-pulse' : 'bg-cyan-400 animate-ping'}`} />
          {isFrozen ? 'CÂMERA CONGELADA' : 'CÂMERA ATIVA'}
        </div>
      )}

      {/* Float camera controls inside feed */}
      {isCameraActive && (
        <div id="floating_camera_controls" className="absolute bottom-6 right-6 z-10 flex flex-wrap gap-2 justify-end max-w-[280px] md:max-w-none">
          {/* Mirror Toggle Button */}
          <button
            onClick={() => setIsMirrored(prev => !prev)}
            title="Espelhar Câmera (Inverter Esquerda/Direita)"
            id="btn_mirror_camera"
            className={`p-3 rounded-full border transition duration-200 flex items-center justify-center shadow-lg backdrop-blur-md ${
              isMirrored 
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 hover:bg-cyan-400' 
                : 'bg-slate-950/80 text-slate-200 border-white/10 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <FlipHorizontal className="w-5 h-5" />
          </button>

          {/* Rotate Camera Button */}
          <button
            onClick={() => setRotation(prev => (prev + 90) % 360)}
            title="Girar Imagem (90°)"
            id="btn_rotate_camera"
            className="p-3 bg-slate-950/80 text-slate-200 border border-white/10 rounded-full hover:bg-slate-900 hover:text-white transition duration-200 flex items-center justify-center shadow-lg backdrop-blur-md"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          {/* Freeze Frame Button */}
          <button
            onClick={toggleFreeze}
            title={isFrozen ? "Descongelar Câmera" : "Congelar Tela (Ideal para desenhar sem suporte)"}
            id="btn_freeze_frame"
            className={`p-3 rounded-full border transition duration-200 flex items-center justify-center shadow-lg backdrop-blur-md ${
              isFrozen 
                ? 'bg-amber-500/90 text-neutral-950 border-amber-400 hover:bg-amber-400' 
                : 'bg-slate-950/80 text-slate-200 border-white/10 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Disc className={`w-5 h-5 ${isFrozen ? 'animate-spin' : ''}`} />
          </button>

          {/* Switch Camera Button (Visible only if multiple devices available) */}
          {devices.length > 1 && (
            <button
              onClick={switchCamera}
              title="Trocar de Câmera"
              id="btn_switch_camera"
              className="p-3 bg-slate-950/80 text-slate-200 border border-white/10 rounded-full hover:bg-slate-900 hover:text-white transition duration-200 flex items-center justify-center shadow-lg backdrop-blur-md"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
