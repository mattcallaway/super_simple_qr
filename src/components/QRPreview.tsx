import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QRSettings } from '../types';
import { verifyQRCode } from '../utils/verifier';

interface QRPreviewProps {
  settings: QRSettings;
  onStatusChange: (status: any) => void;
  qrCodeRef: React.MutableRefObject<QRCodeStyling | null>;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ settings, onStatusChange, qrCodeRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: 300,
        height: 300,
        type: 'canvas',
        data: settings.data,
        margin: 10,
        qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' },
        imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 5 },
        dotsOptions: { color: '#000000', type: 'rounded' },
        backgroundOptions: { color: '#ffffff' },
        cornersSquareOptions: { color: '#000000', type: 'extra-rounded' },
        cornersDotOptions: { color: '#000000', type: 'dot' }
      });
      if (containerRef.current) {
        qrCodeRef.current.append(containerRef.current);
      }
    }
  }, []);

  useEffect(() => {
    if (!qrCodeRef.current) return;

    qrCodeRef.current.update({
      data: settings.data || ' ',
      width: settings.width,
      height: settings.height,
      margin: settings.margin,
      qrOptions: {
        errorCorrectionLevel: settings.errorCorrectionLevel
      },
      dotsOptions: {
        color: settings.dotsColor,
      },
      cornersSquareOptions: {
        color: settings.cornersColor,
      },
      backgroundOptions: {
        color: settings.backgroundColor,
      },
      image: settings.logoUrl,
      imageOptions: {
        imageSize: settings.logoSize,
        margin: 5,
        hideBackgroundDots: true
      }
    });

    // Verification step with a small delay to ensure canvas is repainted
    const timeoutId = setTimeout(async () => {
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          const result = await verifyQRCode(canvas, settings.data);
          onStatusChange(result);
        }
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [settings, onStatusChange]);

  return <div ref={containerRef} className="qr-wrapper" />;
};
