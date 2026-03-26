import { useState, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QRSettings, VerifyResult } from './types';
import { QRPreview } from './components/QRPreview';
import { Controls } from './components/Controls';
import { Download, RefreshCw, AlertCircle, CheckCircle, XCircle, Wrench } from 'lucide-react';
import './index.css';

export const DEFAULT_SETTINGS: QRSettings = {
  data: 'https://github.com/mattcallaway/super_simple_qr',
  width: 300,
  height: 300,
  margin: 10,
  dotsType: 'square',
  dotsColor: '#000000',
  gradientEnabled: false,
  gradientColor1: '#000000',
  gradientColor2: '#00a8ff',
  cornersSquareType: 'square',
  cornersColor: '#000000',
  cornersDotType: 'square',
  cornersDotColor: '#000000',
  backgroundColor: '#ffffff',
  logoSize: 0.15,
  logoShape: 'original',
  logoPadding: true,
  errorCorrectionLevel: 'Q',
  outputSize: 512
};

function App() {
  const [settings, setSettings] = useState<QRSettings>(DEFAULT_SETTINGS);
  const [status, setStatus] = useState<VerifyResult>({ status: 'verified', message: 'Ready to scan!' });
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  const resetToDefaults = () => setSettings(DEFAULT_SETTINGS);

  const applyAutoFix = () => {
    if (status.autoFixPayload) {
      setSettings(prev => ({ ...prev, ...status.autoFixPayload }));
    }
  };

  const handleDownload = async (extension: 'png' | 'svg') => {
    if (!qrCodeRef.current) return;
    qrCodeRef.current.update({ width: settings.outputSize, height: settings.outputSize });
    await qrCodeRef.current.download({ name: 'qr-studio-export', extension });
    qrCodeRef.current.update({ width: 300, height: 300 }); // Revert preview scaling
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>QR Studio by MCMC</h1>
        <p>Pro-grade, reliable QR code generator with safe customization.</p>
      </header>

      <main className="main-layout">
        <aside className="sidebar custom-scrollbar">
          <Controls settings={settings} setSettings={setSettings} />
          <button style={{marginTop: '1.5rem', width: '100%', marginBottom: '2rem'}} className="btn btn-secondary" onClick={resetToDefaults}>
            <RefreshCw size={18} /> Reset to Defaults
          </button>
        </aside>

        <section className="preview-container">
          <div className="glass-panel preview-area">
            <QRPreview 
              settings={settings} 
              onStatusChange={setStatus} 
              qrCodeRef={qrCodeRef}
            />

            <div className={`status-banner status-\${status.status}`}>
              {status.status === 'verified' && <CheckCircle size={20} />}
              {status.status === 'warning' && <AlertCircle size={20} />}
              {status.status === 'failed' && <XCircle size={20} />}
              <span>{status.message}</span>
              {status.canAutoFix && (
                <button onClick={applyAutoFix} className="btn fix-btn btn-primary" style={{padding: '4px 8px', fontSize: '12px', marginLeft: 'auto'}}>
                  <Wrench size={14} /> Fix for me
                </button>
              )}
            </div>

            <div className="export-actions" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
              <button className="btn btn-primary" onClick={() => handleDownload('png')}>
                <Download size={18} /> PNG ({settings.outputSize}px)
              </button>
              <button className="btn btn-secondary" onClick={() => handleDownload('svg')}>
                <Download size={18} /> Vector (SVG)
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
