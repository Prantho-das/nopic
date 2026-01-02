
import React, { useRef, useState } from 'react';
import { BackgroundStyle, BrandVoice } from '../types';

interface UploaderProps {
  onUpload: (file: File, styles: BackgroundStyle[], brandName: string, voice: BrandVoice) => void;
  isLoading: boolean;
  t: any;
}

const Uploader: React.FC<UploaderProps> = ({ onUpload, isLoading, t }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedStyles, setSelectedStyles] = useState<BackgroundStyle[]>(['studio']);
  const [selectedVoice, setSelectedVoice] = useState<BrandVoice>('professional');
  const [brandName, setBrandName] = useState('');

  const styles: { id: BackgroundStyle; label: string; icon: string }[] = [
    { id: 'studio', label: 'Studio', icon: 'fa-camera-retro' },
    { id: 'minimalist', label: 'Minimal', icon: 'fa-square' },
    { id: 'luxury', label: 'Luxury', icon: 'fa-crown' },
    { id: 'marble', label: 'Marble', icon: 'fa-gem' },
    { id: 'wood', label: 'Wood', icon: 'fa-tree' },
    { id: 'nature', label: 'Garden', icon: 'fa-leaf' },
    { id: 'home', label: 'Lifestyle', icon: 'fa-house-user' },
    { id: 'cozy', label: 'Cozy', icon: 'fa-mug-hot' },
    { id: 'tech', label: 'Tech', icon: 'fa-microchip' },
    { id: 'urban', label: 'Street', icon: 'fa-city' },
    { id: 'autumn', label: 'Autumn', icon: 'fa-leaf-maple' },
    { id: 'neon', label: 'Neon', icon: 'fa-bolt' },
    { id: 'cyberpunk', label: 'Cyber', icon: 'fa-robot' },
    { id: 'vintage', label: 'Retro', icon: 'fa-radio' },
    { id: 'popart', label: 'Pop Art', icon: 'fa-palette' },
    { id: 'dark_moody', label: 'Moody', icon: 'fa-moon' },
    { id: 'summer', label: 'Beach', icon: 'fa-umbrella-beach' },
    { id: 'office', label: 'Office', icon: 'fa-briefcase' },
    { id: 'baby', label: 'Baby', icon: 'fa-baby' },
    { id: 'tool', label: 'Workshop', icon: 'fa-wrench' },
  ];

  const voices: { id: BrandVoice; label: string }[] = [
    { id: 'professional', label: 'Professional' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'playful', label: 'Playful' },
    { id: 'minimalist', label: 'Minimal' },
    { id: 'urgent', label: 'Urgent' },
  ];

  const toggleStyle = (styleId: BackgroundStyle) => {
    if (selectedStyles.includes(styleId)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter(s => s !== styleId));
      }
    } else {
      if (selectedStyles.length < 4) {
        setSelectedStyles([...selectedStyles, styleId]);
      }
    }
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, selectedStyles, brandName || 'My Store', selectedVoice);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-10">
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">SNAPSELL PRO STUDIO</h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">Transform one photo into a complete professional multi-atmosphere product catalog.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <div>
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 block">1. Brand Identity</label>
              <input 
                type="text" 
                placeholder="Brand Name" 
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 block">2. Brand Voice</label>
              <div className="grid grid-cols-2 gap-2">
                {voices.map(v => (
                  <button 
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${selectedVoice === v.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">3. Visual Atmospheres (Max 4)</label>
            <p className="text-[9px] text-slate-400 mb-4 font-bold uppercase">Select multiple for variety</p>
            <div className="grid grid-cols-4 gap-2">
              {styles.map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleStyle(s.id)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${selectedStyles.includes(s.id) ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-50' : 'border-slate-50 bg-white hover:border-slate-200'}`}
                >
                  <i className={`fa-solid ${s.icon} text-[10px] ${selectedStyles.includes(s.id) ? 'text-indigo-600' : 'text-slate-400'}`}></i>
                  <span className="text-[7px] font-black uppercase text-slate-700 truncate w-full text-center">{s.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <div 
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={`h-full min-h-[450px] relative border-4 border-dashed rounded-[3rem] p-12 text-center transition-all cursor-pointer group flex flex-col items-center justify-center
              ${isLoading ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-500 hover:bg-white bg-slate-50/30'}
            `}
          >
            <input type="file" ref={fileInputRef} onChange={onFileSelected} accept="image/*" className="hidden" />
            
            <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-indigo-200 group-hover:rotate-6 transition-transform">
              <i className="fa-solid fa-camera text-3xl"></i>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.uploadBtn}</h3>
            <p className="text-slate-500 mt-2 font-medium">Auto-enhancement & Localized SEO Processing</p>

            {isLoading && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-[3rem] flex items-center justify-center z-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-center">
                    <p className="text-xs font-black text-indigo-600 uppercase tracking-widest animate-pulse">Generating {selectedStyles.length} Visual Versions...</p>
                    <p className="text-[9px] text-slate-400 uppercase mt-2 font-black tracking-widest">Optimizing for Bangladesh Market...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
