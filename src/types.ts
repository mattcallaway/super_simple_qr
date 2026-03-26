export type ModuleShape = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
export type CornerShape = 'square' | 'dot' | 'extra-rounded';
export type LogoShape = 'square' | 'rounded' | 'circle' | 'original';

export interface QRSettings {
  data: string;
  width: number;
  height: number;
  margin: number;
  
  // Modules
  dotsType: ModuleShape;
  dotsColor: string;
  
  // Gradients (Modules)
  gradientEnabled: boolean;
  gradientColor1: string;
  gradientColor2: string;

  // Corners
  cornersSquareType: CornerShape;
  cornersColor: string;
  cornersDotType: 'square' | 'dot';
  cornersDotColor: string;

  // Background
  backgroundColor: string;

  // Logo
  logoUrl?: string;
  logoSize: number;
  logoShape: LogoShape;
  logoPadding: boolean;
  
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  outputSize: number; // For export
}

export interface VerifyResult {
  status: 'verified' | 'warning' | 'failed';
  message: string;
  canAutoFix?: boolean;
  autoFixPayload?: Partial<QRSettings>;
}
