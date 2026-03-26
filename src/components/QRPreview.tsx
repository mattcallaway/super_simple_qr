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
        margin: settings.margin,
        qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: settings.errorCorrectionLevel },
        imageOptions: { hideBackgroundDots: settings.logoPadding, imageSize: settings.logoSize, margin: 5 },
        dotsOptions: { color: settings.dotsColor, type: settings.dotsType },
        backgroundOptions: { color: settings.backgroundColor },
        cornersSquareOptions: { color: settings.cornersColor, type: settings.cornersSquareType },
        cornersDotOptions: { color: settings.cornersDotColor, type: settings.cornersDotType }
      });
      if (containerRef.current) {
        qrCodeRef.current.append(containerRef.current);
      }
    }
  }, []);

  useEffect(() => {
    if (!qrCodeRef.current) return;

    let dotsOptions: any = { color: settings.dotsColor, type: settings.dotsType };
    if (settings.gradientEnabled) {
      dotsOptions = {
        type: settings.dotsType,
        gradient: {
          type: 'linear',
          rotation: Math.PI / 4,
          colorStops: [{ offset: 0, color: settings.gradientColor1 }, { offset: 1, color: settings.gradientColor2 }]
        }
      };
    }

    qrCodeRef.current.update({
      data: settings.data || ' ',
      width: 300,
      height: 300,
      margin: settings.margin,
      qrOptions: {
        errorCorrectionLevel: settings.errorCorrectionLevel
      },
      dotsOptions,
      cornersSquareOptions: {
        color: settings.cornersColor,
        type: settings.cornersSquareType
      },
      cornersDotOptions: {
        color: settings.cornersDotColor,
        type: settings.cornersDotType
      },
      backgroundOptions: {
        color: settings.backgroundColor,
      },
      image: settings.logoUrl,
      imageOptions: {
        imageSize: settings.logoSize,
        margin: 5,
        hideBackgroundDots: settings.logoPadding
      }
    });

    const timeoutId = setTimeout(async () => {
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          const result = await verifyQRCode(canvas, settings.data, settings);
          onStatusChange(result);
        }
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [settings, onStatusChange]);

  return <div ref={containerRef} className="qr-wrapper" />;
};
