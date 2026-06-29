export interface CustomSketch {
  id: string;
  name: string;
  svgContent: string; // Valid SVG markup string or custom path string
  viewBox: string;
  type: 'ai' | 'upload' | 'calligraphy' | 'canvas';
  timestamp: number;
}

export interface CameraDevice {
  deviceId: string;
  label: string;
}

export type StrokeColor = 'black' | 'red' | 'blue' | 'green' | 'white';

export interface TracingState {
  scale: number;      // 0.2 to 5.0
  rotation: number;   // 0 to 360
  opacity: number;    // 0 to 1
  mirrorX: boolean;
  mirrorY: boolean;
  color: StrokeColor;
  strokeWidth: number; // 1 to 10
  translateX: number;
  translateY: number;
  isLocked: boolean;
}
