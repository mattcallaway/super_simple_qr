export interface QRSettings {
  data: string;
  width: number;
  height: number;
  margin: number;
  dotsColor: string;
  cornersColor: string;
  backgroundColor: string;
  logoUrl?: string;
  logoSize: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

export interface VerifyResult {
  status: 'verified' | 'warning' | 'failed';
  message: string;
}
