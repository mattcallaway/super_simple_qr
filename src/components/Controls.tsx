import React, { useRef, useState } from 'react';
import type { QRSettings, ModuleShape, CornerShape, LogoShape } from '../types';
import { Upload, Trash2, AlertTriangle, Settings2, Palette, Image as ImageIcon, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { processLogoWithBackground } from '../utils/logoProcessor';
import './Controls.css';

interface ControlsProps {
  settings: QRSettings;
  setSettings: React.Dispatch<React.SetStateAction<QRSettings>>;
}

const PRESETS: Record<string, Partial<QRSettings>> = {
  'Classic Safe': {
    dotsType: 'square', cornersSquareType: 'square', cornersDotType: 'square',
    dotsColor: '#000000', cornersColor: '#000000', cornersDotColor: '#000000',
    backgroundColor: '#ffffff', gradientEnabled: false, margin: 10
  },
  'Modern Rounded': {
    dotsType: 'rounded', cornersSquareType: 'extra-rounded', cornersDotType: 'square', margin: 10
  },
  'Dot Style': {
    dotsType: 'dots', cornersSquareType: 'dot', cornersDotType: 'dot', margin: 15
  },
  'High Contrast': {
    dotsType: 'square', cornersSquareType: 'square', cornersDotType: 'square',
    dotsColor: '#000000', cornersColor: '#000000', cornersDotColor: '#000000',
    backgroundColor: '#ffffff', gradientEnabled: false, margin: 20
  }
};

const Section = ({ title, icon: Icon, defaultOpen = false, children }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="section-container">
      <button className="section-header" onClick={() => setIsOpen(!isOpen)}>
        <Icon size={18} />
        <span className="section-title">{title}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className="section-content">{children}</div>}
    </div>
  );
};

export const Controls: React.FC<ControlsProps> = ({ settings, setSettings }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (key: keyof QRSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyPreset = (presetName: string) => {
    setSettings(prev => ({ ...prev, ...PRESETS[presetName] }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const url = event.target?.result as string;
        try {
          const finalUrl = await processLogoWithBackground(url, settings.logoShape, settings.logoPadding);
          setSettings(prev => ({ 
            ...prev, 
            logoUrl: finalUrl, 
            errorCorrectionLevel: 'H' 
          }));
        } catch (err) {
          handleChange('logoUrl', url);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updateLogoSettings = async (shape: LogoShape, pad: boolean) => {
    if (!settings.logoUrl) return;
    handleChange('logoShape', shape);
    handleChange('logoPadding', pad);
  };

  const removeLogo = () => handleChange('logoUrl', undefined);

  return (
    <div className="glass-panel controls-stack">
      <div className="control-group">
        <label className="control-label">Destination URL</label>
        <input 
          type="text" 
          className="input-text" 
          value={settings.data} 
          onChange={(e) => handleChange('data', e.target.value)} 
          placeholder="https://..."
        />
      </div>

      <div className="presets-row">
        {Object.keys(PRESETS).map(name => (
          <button key={name} className="btn-preset" onClick={() => handleApplyPreset(name)}>
            {name}
          </button>
        ))}
      </div>

      <Section title="Structural Style" icon={Settings2} defaultOpen={true}>
        <div className="control-group">
          <label className="control-label">Module / Dot Shape</label>
          <select className="input-text" value={settings.dotsType} onChange={(e) => handleChange('dotsType', e.target.value as ModuleShape)}>
            <option value="square">Square (Safest)</option>
            <option value="rounded">Rounded</option>
            <option value="dots">Dots</option>
            <option value="extra-rounded">Extra Rounded</option>
            <option value="classy">Classy</option>
            <option value="classy-rounded">Classy Rounded</option>
          </select>
        </div>
        <div className="control-group">
          <label className="control-label">Corner Frame Shape</label>
          <select className="input-text" value={settings.cornersSquareType} onChange={(e) => handleChange('cornersSquareType', e.target.value as CornerShape)}>
            <option value="square">Square</option>
            <option value="extra-rounded">Extra Rounded</option>
            <option value="dot">Dot</option>
          </select>
        </div>
        <div className="control-group">
          <label className="control-label">Corner Inner Dot Shape</label>
          <select className="input-text" value={settings.cornersDotType} onChange={(e) => handleChange('cornersDotType', e.target.value)}>
            <option value="square">Square</option>
            <option value="dot">Dot</option>
          </select>
        </div>
      </Section>

      <Section title="Colors & Gradients" icon={Palette}>
        <div className="color-picker-row">
          <input type="color" className="color-input" value={settings.backgroundColor} onChange={(e) => handleChange('backgroundColor', e.target.value)} />
          <span className="control-label" style={{marginBottom: 0}}>Background</span>
        </div>
        <div className="color-picker-row">
          <input type="color" className="color-input" value={settings.dotsColor} onChange={(e) => handleChange('dotsColor', e.target.value)} />
          <span className="control-label" style={{marginBottom: 0}}>{settings.gradientEnabled ? 'Gradient Start' : 'Module Foreground'}</span>
        </div>
        
        <label className="checkbox-label" style={{margin: '12px 0 8px 0'}}>
          <input type="checkbox" checked={settings.gradientEnabled} onChange={(e) => handleChange('gradientEnabled', e.target.checked)} />
          Use Linear Gradient (Experimental)
        </label>
        
        {settings.gradientEnabled && (
          <div className="color-picker-row">
            <input type="color" className="color-input" value={settings.gradientColor1} onChange={(e) => handleChange('gradientColor1', e.target.value)} />
            <span className="control-label" style={{marginBottom: 0}}>Gradient End</span>
          </div>
        )}

        <div className="color-picker-row" style={{marginTop: '12px'}}>
          <input type="color" className="color-input" value={settings.cornersColor} onChange={(e) => handleChange('cornersColor', e.target.value)} />
          <span className="control-label" style={{marginBottom: 0}}>Corner Frame Color</span>
        </div>
        <div className="color-picker-row">
          <input type="color" className="color-input" value={settings.cornersDotColor} onChange={(e) => handleChange('cornersDotColor', e.target.value)} />
          <span className="control-label" style={{marginBottom: 0}}>Corner Inner Dot Color</span>
        </div>
      </Section>

      <Section title="Logo Options" icon={ImageIcon}>
        <input type="file" accept="image/*" className="file-input" ref={fileInputRef} onChange={handleLogoUpload} />
        <div className="slider-container">
          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} /> {settings.logoUrl ? 'Change Logo' : 'Upload Logo'}
          </button>
          {settings.logoUrl && (
            <button className="btn btn-danger" onClick={removeLogo} title="Remove Logo">
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {settings.logoUrl && (
          <>
            <div className="control-group" style={{marginTop: '1rem'}}>
              <label className="control-label">Logo Mask Shape</label>
              <select className="input-text" value={settings.logoShape} onChange={(e) => updateLogoSettings(e.target.value as LogoShape, settings.logoPadding)}>
                <option value="original">Original (No Mask)</option>
                <option value="square">Square</option>
                <option value="rounded">Rounded Square</option>
                <option value="circle">Circle</option>
              </select>
            </div>
            <label className="checkbox-label">
              <input type="checkbox" checked={settings.logoPadding} onChange={(e) => updateLogoSettings(settings.logoShape, e.target.checked)} />
              Force White Background Padding Area
            </label>
            <div className="warning-box" style={{ padding: '8px', background: '#fff3cd', color: '#856404', borderRadius: '4px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '1rem' }}>
              <AlertTriangle size={16} /> Max recommended logo size is 25%.
            </div>
            <div className="control-group" style={{marginTop: '0.5rem'}}>
              <label className="control-label">Logo Size ({Math.round(settings.logoSize * 100)}%)</label>
              <input type="range" min="0.1" max="0.25" step="0.01" value={settings.logoSize} onChange={(e) => handleChange('logoSize', parseFloat(e.target.value))} className="slider" />
            </div>
          </>
        )}
      </Section>

      <Section title="Advanced & Export" icon={Briefcase}>
        <div className="control-group">
          <label className="control-label">Quiet Zone Margin ({settings.margin}px)</label>
          <input type="range" min="5" max="50" step="5" value={settings.margin} onChange={(e) => handleChange('margin', parseInt(e.target.value))} className="slider" />
        </div>
        <div className="control-group">
          <label className="control-label">Export Resolution</label>
          <select className="input-text" value={settings.outputSize} onChange={(e) => handleChange('outputSize', parseInt(e.target.value))}>
            <option value={256}>Small (256x256)</option>
            <option value={512}>Medium (512x512)</option>
            <option value={1024}>Large (1024x1024)</option>
            <option value={2048}>Maximum (2048x2048)</option>
          </select>
        </div>
      </Section>
    </div>
  );
};
