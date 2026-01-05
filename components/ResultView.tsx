
import React, { useState } from 'react';
import { ProductListing, ImageData } from '../types';

interface ResultViewProps {
  listing: ProductListing;
  images: ImageData;
  onReset: () => void;
  onRefine: (idx: number, prompt: string) => Promise<void>;
  t: any;
  lang: 'en' | 'bn';
}

const ResultView: React.FC<ResultViewProps> = ({ listing, images, onReset, onRefine, t, lang }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeMarketplace, setActiveMarketplace] = useState<'shopify' | 'amazon' | 'etsy' | 'facebook'>('facebook');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const download = (url: string, name: string, style: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}-${style.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefineClick = async () => {
    if (!refinePrompt.trim()) return;
    setIsRefining(true);
    try {
      await onRefine(activeImageIdx, refinePrompt);
      setRefinePrompt('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefining(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in duration-700">
      
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Omni-Channel Catalog</h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest flex items-center gap-2">
              <i className="fa-brands fa-facebook-f"></i> Facebook Ready
            </span>
            <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-location-dot"></i> Localized Bangla
            </span>
            <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-image"></i> {images.variants.length} Atmospheres
            </span>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={onReset} className="flex-1 md:flex-none px-6 py-3 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-sm border border-slate-200 hover:bg-slate-50 transition-all">
            <i className="fa-solid fa-plus mr-2"></i> New Transformation
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Left Column: Gallery */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 group relative">
            {isRefining ? (
              <div className="w-full aspect-square flex flex-col items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 animate-pulse">Applying Refinements...</p>
              </div>
            ) : (
              <img src={images.variants[activeImageIdx].url} className="w-full aspect-square object-cover" alt="Selected variant" />
            )}
            <div className="absolute top-6 left-6 flex gap-2">
               <span className="px-4 py-2 glass-effect rounded-2xl text-[9px] font-black text-slate-900 uppercase tracking-widest shadow-xl border-white/50">
                {images.variants[activeImageIdx].styleLabel}
               </span>
            </div>
          </div>

          {/* Refinement UI */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-indigo-600 text-sm"></i>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Refine This Image</h3>
            </div>
            <textarea 
              placeholder="e.g. 'Make it brighter', 'Add more contrast'..."
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] outline-none focus:ring-2 focus:ring-indigo-500/20 h-20 resize-none"
            />
            <button 
              onClick={handleRefineClick}
              disabled={isRefining || !refinePrompt.trim()}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:grayscale"
            >
              {isRefining ? 'Processing...' : 'Apply Change'}
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Atmosphere Selection</h3>
            <div className="grid grid-cols-2 gap-4">
              {images.variants.map((v, i) => (
                <div key={i} className="group relative">
                  <button onClick={() => setActiveImageIdx(i)} className={`w-full rounded-[2rem] overflow-hidden border-2 transition-all ${activeImageIdx === i ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-lg' : 'border-white hover:border-slate-200'}`}>
                    <img src={v.url} className="w-full aspect-square object-cover" alt={v.styleLabel} />
                  </button>
                  <div className="mt-1 text-center">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{v.styleLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Marketplace Copy & SEO */}
        <div className="lg:col-span-7 space-y-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-4">English Hook</p>
              <p className="text-xl font-black italic">"{listing.salesHookEN}"</p>
              <button onClick={() => copyToClipboard(listing.salesHookEN, 'hook-en')} className="mt-6 w-full py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest">
                {copyStatus === 'hook-en' ? 'COPIED' : 'COPY HOOK'}
              </button>
            </div>
            <div className="bg-emerald-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-4">বাংলা সেলস হুক</p>
              <p className="text-xl font-bold italic">"{listing.salesHookBN}"</p>
              <button onClick={() => copyToClipboard(listing.salesHookBN, 'hook-bn')} className="mt-6 w-full py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest">
                {copyStatus === 'hook-bn' ? 'কপি হয়েছে' : 'কপি করুন'}
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Marketplace Strategy</h3>
               <div className="flex flex-wrap bg-slate-100 p-1 rounded-2xl gap-1">
                 {(['facebook', 'shopify', 'amazon', 'etsy'] as const).map(m => (
                   <button key={m} onClick={() => setActiveMarketplace(m)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMarketplace === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
                     {m}
                   </button>
                 ))}
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-lg font-black text-slate-900 leading-tight">{listing.titleEN}</h4>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
                  {listing.marketplaces[activeMarketplace]}
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-slate-900 leading-tight">{listing.titleBN}</h4>
                <div className="bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100 text-xs text-slate-600 leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
                  {listing.descriptionBN}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
