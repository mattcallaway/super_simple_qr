import jsQR from 'jsqr';

export const verifyQRCode = async (
  canvas: HTMLCanvasElement,
  expectedData: string
): Promise<{ status: 'verified' | 'warning' | 'failed'; message: string }> => {
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return { status: 'failed', message: 'Could not get canvas context' };

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      if (code.data === expectedData) {
        return { status: 'verified', message: 'Verified and ready to scan!' };
      } else {
        return { status: 'failed', message: 'QR content does not match input.' };
      }
    } else {
      return { status: 'warning', message: 'Could not verify. Adjust colors or logo size to ensure scannability.' };
    }
  } catch (err) {
    return { status: 'failed', message: 'Error during verification' };
  }
};
