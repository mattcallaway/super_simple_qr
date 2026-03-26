import jsQR from 'jsqr';
import type { QRSettings } from '../types';

// Helper to get relative luminance
const getLuminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Helper: Hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : {r:0, g:0, b:0};
};

export const verifyQRCode = async (
  canvas: HTMLCanvasElement,
  expectedData: string,
  settings: QRSettings
): Promise<{ status: 'verified' | 'warning' | 'failed'; message: string; canAutoFix?: boolean; autoFixPayload?: Partial<QRSettings> }> => {
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return { status: 'failed', message: 'Could not get canvas context' };

    // 0. Pre-check: Contrast safety
    const bg = hexToRgb(settings.backgroundColor);
    const fg = hexToRgb(settings.dotsColor);
    const lumBg = getLuminance(bg.r, bg.g, bg.b);
    const lumFg = getLuminance(fg.r, fg.g, fg.b);
    const brightest = Math.max(lumBg, lumFg);
    const darkest = Math.min(lumBg, lumFg);
    const contrastRatio = (brightest + 0.05) / (darkest + 0.05);

    if (contrastRatio < 2.5) {
       return {
         status: 'failed',
         message: 'Contrast ratio too low! Colors are too similar. Increase contrast or click Fix.',
         canAutoFix: true,
         autoFixPayload: { backgroundColor: '#ffffff', dotsColor: '#000000', cornersColor: '#000000', cornersDotColor: '#000000' }
       };
    }

    if (settings.margin < 5) {
       return {
         status: 'warning',
         message: 'Warning: Margin (quiet zone) is very small. May reduce scannability on dense backgrounds.',
         canAutoFix: true,
         autoFixPayload: { margin: 10 }
       };
    }

    // PASS 1: Base verification
    const pass1 = checkCanvas(canvas, expectedData);
    if (!pass1) {
      if (settings.logoUrl && settings.logoSize > 0.2) {
        return { 
          status: 'failed', 
          message: 'Failed to verify. Logo may be too large or obscuring data.',
          canAutoFix: true,
          autoFixPayload: { logoSize: 0.15 }
        };
      }
      if (settings.gradientEnabled) {
        return { 
          status: 'failed', 
          message: 'Failed to verify. Gradients can reduce contrast unpredictably. Try turning off gradient.',
          canAutoFix: true,
          autoFixPayload: { gradientEnabled: false }
        };
      }
      if (settings.dotsType !== 'square' || settings.cornersSquareType !== 'square') {
         return {
           status: 'failed',
           message: 'Verification failed. Complex shapes may be distorting the data modules.',
           canAutoFix: true,
           autoFixPayload: { dotsType: 'square', cornersSquareType: 'square', cornersDotType: 'square' }
         }
      }

      return { 
        status: 'failed', 
        message: 'Failed to verify immediately. Adjust colors or layout.',
        canAutoFix: true,
        autoFixPayload: { backgroundColor: '#ffffff', dotsColor: '#000000', margin: 10, logoSize: 0.15 }
      };
    }

    // PASS 2: Downscaled verification (simulate distance)
    const downCanvas = document.createElement('canvas');
    downCanvas.width = canvas.width / 2;
    downCanvas.height = canvas.height / 2;
    const downCtx = downCanvas.getContext('2d');
    if (downCtx) {
      downCtx.drawImage(canvas, 0, 0, downCanvas.width, downCanvas.height);
      const pass2 = checkCanvas(downCanvas, expectedData);
      if (!pass2) {
        return {
          status: 'warning',
          message: 'Verified, but fails at a distance. Recommendation: Reduce logo size or simplify shapes.',
          canAutoFix: true,
          autoFixPayload: { logoSize: 0.15, dotsType: 'square' }
        };
      }
    }

    // PASS 3: Blur verification (simulate poor lighting/focus)
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = canvas.width;
    blurCanvas.height = canvas.height;
    const blurCtx = blurCanvas.getContext('2d');
    if (blurCtx) {
      blurCtx.filter = 'blur(1px)';
      blurCtx.drawImage(canvas, 0, 0);
      const pass3 = checkCanvas(blurCanvas, expectedData);
      if (!pass3) {
        return {
          status: 'warning',
          message: 'Verified, but sensitive to blur. Ensure good lighting when scanning.'
        };
      }
    }

    return { status: 'verified', message: 'Verified and ready to scan! Passes all fidelity checks.' };
  } catch (err) {
    return { status: 'failed', message: 'Error during verification' };
  }
};

function checkCanvas(c: HTMLCanvasElement, expectedData: string): boolean {
  const ctx = c.getContext('2d');
  if (!ctx) return false;
  const imageData = ctx.getImageData(0, 0, c.width, c.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  return code?.data === expectedData;
}
