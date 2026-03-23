import { useState, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QRSettings, VerifyResult } from './types';
import { QRPreview } from './components/QRPreview';
import { Controls } from './components/Controls';
import { Download, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import './index.css';

const DEFAULT_SETTINGS: QRSettings = {
  data: 'https://github.com/mattcallaway/super_simple_qr',
  width: 300,
  height: 300,
  margin: 10,
  dotsColor: '#000000',
  cornersColor: '#000000',
  backgroundColor: '#ffffff',
  logoSize: 0.3,
  errorCorrectionLevel: 'Q'
};

function App() {
  const [settings, setSettings] = useState<QRSettings>(DEFAULT_SETTINGS);
  const [status, setStatus] = useState<VerifyResult>({ status: 'verified', message: 'Ready to scan!' });
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const handleDownload = (extension: 'png' | 'svg') => {
    if (!qrCodeRef.current) return;
    qrCodeRef.current.download({ name: 'qr-code', extension });
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>QR Studio</h1>
        <p>Simple, aesthetic, and verifiable QR code generator.</p>
      </header>

      <main className="main-layout">
        <aside className="sidebar">
          <Controls settings={settings} setSettings={setSettings} />
          <button style={{marginTop: '1.5rem', width: '100%'}} className="btn btn-secondary" onClick={resetToDefaults}>
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

            <div className={`status-banner status-${status.status}`}>
              {status.status === 'verified' && <CheckCircle size={20} />}
              {status.status === 'warning' && <AlertCircle size={20} />}
              {status.status === 'failed' && <XCircle size={20} />}
              <span>{status.message}</span>
            </div>

            <div className="export-actions">
              <button className="btn btn-primary" onClick={() => handleDownload('png')}>
                <Download size={18} /> Export as PNG
              </button>
              <button className="btn btn-secondary" onClick={() => handleDownload('svg')}>
                <Download size={18} /> Export as SVG
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
