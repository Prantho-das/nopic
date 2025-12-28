
import React, { useRef, useState } from 'react';
import { BackgroundStyle } from '../types';

interface UploaderProps {
  onUpload: (file: File, style: BackgroundStyle, watermark?: string) => void;
  isLoading: boolean;
  t: any;
}

const Uploader: React.FC<UploaderProps> = ({ onUpload, isLoading, t }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedStyle, setSelectedStyle] = useState<BackgroundStyle>('studio');
  const [watermark, setWatermark] = useState('');

  const styles: { id: BackgroundStyle; label: string; icon: string; desc: string }[] = [
    { id: 'studio', label: 'Studio', icon: 'fa-camera-retro', desc: 'Standard E-com' },
    { id: 'marble', label: 'Marble', icon: 'fa-gem', desc: 'Modern/Beauty' },
    { id: 'wood', label: 'Wood', icon: 'fa-tree', desc: 'Organic/Handmade' },
    { id: 'nature', label: 'Garden', icon: 'fa-leaf', desc: 'Fresh/Eco' },
    { id: 'home', label: 'Lifestyle', icon: 'fa-house-user', desc: 'Home Setup' },
    { id: 'luxury', label: 'Premium', icon: 'fa-crown', desc: 'High-end/Gold' },
    { id: 'tech', label: 'Electronics', icon: 'fa-microchip', desc: 'Cyber/Digital' },
    { id: 'urban', label: 'Street', icon: 'fa-city', desc: 'Urban/Casual' },
    { id: 'baby', label: 'Soft', icon: 'fa-baby', desc: 'Pastel/Care' },
    { id: 'tool', label: 'Workshop', icon: 'fa-screwdriver-wrench', desc: 'Industrial' },
    { id: 'summer', label: 'Beach', icon: 'fa-umbrella-beach', desc: 'Seasonal' },
    { id: 'office', label: 'Office', icon: 'fa-briefcase', desc: 'Professional' },
  ];

  const handleStart = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, selectedStyle, watermark.trim() || undefined);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8">
      {/* 12 Filters Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {styles.map((s) => (
          <button
            key={s.id}
            disabled={isLoading}
            onClick={() => setSelectedStyle(s.id)}
            className={`p-3 rounded-xl border-2 transition-all text-center flex flex-col items-center gap-1 ${
              selectedStyle === s.id 
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100 scale-105 shadow-sm' 
                : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
            }`}
          >
            <i className={`fa-solid ${s.icon} text-lg ${selectedStyle === s.id ? 'text-indigo-600' : 'text-slate-400'}`}></i>
            <p className={`font-bold text-xs ${selectedStyle === s.id ? 'text-indigo-900' : 'text-slate-700'}`}>{s.label}</p>
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">{s.desc}</span>
          </button>
        ))}
      </div>

      {/* Watermark and Upload Section */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 space-y-6">
        <div className="max-w-md mx-auto">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
            {t.watermarkPlaceholder.split(':')[0]}
          </label>
          <div className="relative">
            <i className="fa-solid fa-font absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
            <input 
              type="text" 
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
              placeholder={t.watermarkPlaceholder}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div 
          onClick={!isLoading ? handleStart : undefined}
          className={`relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer group
            ${isLoading ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-500 hover:bg-slate-50'}
          `}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onFileSelected} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-200 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">{t.uploadBtn}</h3>
          <p className="text-slate-500 mt-1 font-medium text-sm">{t.uploadHint}</p>
          
          {isLoading && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-[2rem] flex items-center justify-center z-20">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-xs font-black text-indigo-600 uppercase tracking-widest animate-pulse">{t.processing}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Uploader;
