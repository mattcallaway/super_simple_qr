import React, { useRef } from 'react';
import type { QRSettings } from '../types';
import { Upload, Trash2, AlertTriangle } from 'lucide-react';
import { processLogoWithWhiteBackground } from '../utils/logoProcessor';

interface ControlsProps {
  settings: QRSettings;
  setSettings: React.Dispatch<React.SetStateAction<QRSettings>>;
}

export const Controls: React.FC<ControlsProps> = ({ settings, setSettings }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (key: keyof QRSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        processLogoWithWhiteBackground(event.target?.result as string).then(processedUrl => {
          handleChange('logoUrl', processedUrl);
        }).catch(err => {
          console.error(err);
          handleChange('logoUrl', event.target?.result as string);
        });
        // Automatically bump error correction to High when logo is uploaded for better Scannability
        handleChange('errorCorrectionLevel', 'H');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    handleChange('logoUrl', undefined);
  };

  return (
    <div className="glass-panel">
      <div className="control-group">
        <label className="control-label">Destination URL / Content</label>
        <input 
          type="text" 
          className="input-text" 
          value={settings.data} 
          onChange={(e) => handleChange('data', e.target.value)} 
          placeholder="Enter a URL or text"
        />
      </div>

      <div className="control-group">
        <label className="control-label">Colors</label>
        <div className="color-picker-row">
          <input type="color" className="color-input" value={settings.dotsColor} onChange={(e) => handleChange('dotsColor', e.target.value)} title="QR Dots Color" />
          <span className="control-label" style={{marginBottom: 0}}>Main Pattern (Dots)</span>
        </div>
        <div className="color-picker-row">
          <input type="color" className="color-input" value={settings.cornersColor} onChange={(e) => handleChange('cornersColor', e.target.value)} title="Corners Color" />
          <span className="control-label" style={{marginBottom: 0}}>Corner Finder Boxes</span>
        </div>
        <div className="color-picker-row">
          <input type="color" className="color-input" value={settings.backgroundColor} onChange={(e) => handleChange('backgroundColor', e.target.value)} title="Background Color" />
          <span className="control-label" style={{marginBottom: 0}}>Background</span>
        </div>
      </div>

      <div className="control-group" style={{marginBottom: settings.logoUrl ? '1rem' : '0'}}>
        <label className="control-label">Logo Upload</label>
        <input 
          type="file" 
          accept="image/*" 
          className="file-input" 
          ref={fileInputRef} 
          onChange={handleLogoUpload} 
        />
        <div className="slider-container">
          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} /> Choose Logo
          </button>
          {settings.logoUrl && (
        <div className="warning-box" style={{ padding: '8px', background: '#fff3cd', color: '#856404', borderRadius: '4px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <AlertTriangle size={16} /> Max recommended logo size is 25%. Ensure your pattern remains visible.
        </div>
      )}
      {settings.logoUrl && (
            <button className="btn btn-danger" onClick={removeLogo} title="Remove Logo">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {settings.logoUrl && (
        <div className="control-group" style={{marginBottom: '0'}}>
          <label className="control-label">Logo Size ({Math.round(settings.logoSize * 100)}%)</label>
          <input 
            type="range" 
            min="0.1" 
            max="0.25" 
            step="0.05" 
            value={settings.logoSize} 
            onChange={(e) => handleChange('logoSize', parseFloat(e.target.value))}
            className="slider"
          />
        </div>
      )}
    </div>
  );
};
