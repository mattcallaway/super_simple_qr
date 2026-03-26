import type { LogoShape } from '../types';

export const processLogoWithBackground = (
  dataUrl: string, 
  shape: LogoShape, 
  addPadding: boolean
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      // Calculate a padded size for the logo background
      const maxDim = Math.max(img.width, img.height);
      const padding = addPadding ? maxDim * 0.15 : 0; 
      const size = maxDim + padding * 2;
      
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      if (addPadding && shape !== 'original') {
        const radius = shape === 'circle' ? size / 2 : (shape === 'rounded' ? size * 0.2 : 0);
        ctx.beginPath();
        if (radius > 0) {
          ctx.moveTo(radius, 0);
          ctx.lineTo(size - radius, 0);
          ctx.quadraticCurveTo(size, 0, size, radius);
          ctx.lineTo(size, size - radius);
          ctx.quadraticCurveTo(size, size, size - radius, size);
          ctx.lineTo(radius, size);
          ctx.quadraticCurveTo(0, size, 0, size - radius);
          ctx.lineTo(0, radius);
          ctx.quadraticCurveTo(0, 0, radius, 0);
        } else {
          ctx.rect(0, 0, size, size);
        }
        ctx.closePath();
        
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.clip(); // Mask the image inside this shape bounds too if needed, though padding usually keeps it inside.
      }
      
      // Draw image in center
      const x = (size - img.width) / 2;
      const y = (size - img.height) / 2;

      // Also mask the image itself if no padding but shape specified
      if (!addPadding && shape !== 'original') {
        const radius = shape === 'circle' ? size / 2 : (shape === 'rounded' ? size * 0.2 : 0);
        ctx.beginPath();
        if (radius > 0) {
          ctx.moveTo(radius, 0);
          ctx.lineTo(size - radius, 0);
          ctx.quadraticCurveTo(size, 0, size, radius);
          ctx.lineTo(size, size - radius);
          ctx.quadraticCurveTo(size, size, size - radius, size);
          ctx.lineTo(radius, size);
          ctx.quadraticCurveTo(0, size, 0, size - radius);
          ctx.lineTo(0, radius);
          ctx.quadraticCurveTo(0, 0, radius, 0);
        } else {
          ctx.rect(0, 0, size, size);
        }
        ctx.closePath();
        ctx.clip();
      }

      ctx.drawImage(img, x, y, img.width, img.height);
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image for processing'));
    img.src = dataUrl;
  });
};
