
import jsQR from 'jsqr';

export const verifyQRCode = async (
  canvas: HTMLCanvasElement,
  expectedData: string
): Promise<{ status: 'verified' | 'warning' | 'failed'; message: string }> => {
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return { status: 'failed', message: 'Could not get canvas context' };

    // PASS 1: Base verification
    const pass1 = checkCanvas(canvas, expectedData);
    if (!pass1) {
      return { 
        status: 'failed', 
        message: 'Failed to verify immediately. Recommendation: Remove logo, or reduce logo size, or increase error correction contrast.' 
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
          message: 'Verified, but fails at a distance. Recommendation: Reduce logo size.'
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
