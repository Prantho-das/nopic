
import React, { useState } from 'react';
import { ProductListing, ImageData } from '../types';

interface ResultViewProps {
  listing: ProductListing;
  images: ImageData;
  onReset: () => void;
  t: any;
  lang: 'en' | 'bn';
}

const ResultView: React.FC<ResultViewProps> = ({ listing, images, onReset, t, lang }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeMarketplace, setActiveMarketplace] = useState<'shopify' | 'amazon' | 'etsy'>('shopify');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const download = (url: string, name: string, style: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}-${style.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    images.variants.forEach((v, i) => {
      setTimeout(() => {
        download(v.url, 'snapsell-catalog', v.styleLabel);
      }, i * 300);
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in duration-700">
      
      {/* Top Header & Global Actions */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Sales Ready Catalog</h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-chart-line"></i> BD Market Optimized
            </span>
            <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-layer-group"></i> {images.variants.length} Atmospheres
            </span>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={downloadAll}
            className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-file-export"></i> Download All Images
          </button>
          <button onClick={onReset} className="flex-1 md:flex-none px-6 py-3 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-sm border border-slate-200 hover:bg-slate-50 transition-all">
            <i className="fa-solid fa-plus mr-2"></i> New Item
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Left Column: Visual Assets & Individual Downloads */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 group relative">
            <img src={images.variants[activeImageIdx].url} className="w-full aspect-square object-cover" alt="Active Atmosphere" />
            <div className="absolute top-6 left-6 flex gap-2">
               <span className="px-4 py-2 glass-effect rounded-2xl text-[9px] font-black text-slate-900 uppercase tracking-widest shadow-xl border-white/50">
                Current: {images.variants[activeImageIdx].styleLabel}
               </span>
            </div>
            <button 
              onClick={() => download(images.variants[activeImageIdx].url, 'snapsell', images.variants[activeImageIdx].styleLabel)}
              className="absolute bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
            >
              <i className="fa-solid fa-download text-lg group-hover:animate-bounce"></i>
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Generated Atmosphere Gallery</h3>
            <div className="grid grid-cols-2 gap-4">
              {images.variants.map((v, i) => (
                <div key={i} className="group relative">
                  <button 
                    onClick={() => setActiveImageIdx(i)}
                    className={`w-full rounded-[2rem] overflow-hidden border-2 transition-all ${activeImageIdx === i ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-lg' : 'border-white grayscale hover:grayscale-0 hover:border-slate-200'}`}
                  >
                    <img src={v.url} className="w-full aspect-square object-cover" alt={v.styleLabel} />
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                      <span className="text-[7px] font-black text-white uppercase">{v.styleLabel}</span>
                    </div>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); download(v.url, 'variant', v.styleLabel); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-md text-slate-900 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white"
                  >
                    <i className="fa-solid fa-download text-[10px]"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Deep Sales Content & Localized SEO */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Sales Hook Spotlight - Dual Language */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 text-white/5 text-8xl font-black rotate-12">EN</div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-fire text-amber-400"></i> English Hook
              </h4>
              <p className="text-xl font-black italic leading-tight">"{listing.salesHookEN}"</p>
              <button 
                onClick={() => copyToClipboard(listing.salesHookEN, 'hook-en')}
                className="mt-6 text-[9px] font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-all"
              >
                {copyStatus === 'hook-en' ? 'Copied' : 'Copy Hook'}
              </button>
            </div>

            <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 text-white/5 text-8xl font-black rotate-12">BN</div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-bolt text-yellow-300"></i> বাংলা সেলস হুক
              </h4>
              <p className="text-xl font-bold italic leading-tight">"{listing.salesHookBN}"</p>
              <button 
                onClick={() => copyToClipboard(listing.salesHookBN, 'hook-bn')}
                className="mt-6 text-[9px] font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-all"
              >
                {copyStatus === 'hook-bn' ? 'কপি করুন' : 'কপি হুক'}
              </button>
            </div>
          </div>

          {/* Core Content - Side by Side Descriptions */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 space-y-8">
             <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Master Product Descriptions</h3>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {(['shopify', 'amazon', 'etsy'] as const).map(m => (
                    <button 
                      key={m}
                      onClick={() => setActiveMarketplace(m)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeMarketplace === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">English (Global)</span>
                    <button onClick={() => copyToClipboard(`${listing.titleEN}\n\n${listing.descriptionEN}`, 'desc-en')} className="text-[9px] font-black text-slate-400 hover:text-indigo-600">
                      {copyStatus === 'desc-en' ? 'COPIED' : 'COPY ALL'}
                    </button>
                 </div>
                 <h4 className="text-lg font-black text-slate-900">{listing.titleEN}</h4>
                 <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line border-l-2 border-indigo-100 pl-4">{listing.descriptionEN}</p>
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Engage CTA</p>
                    <p className="text-xs font-bold text-indigo-600">{listing.ctaEN}</p>
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg">বাংলা (Local)</span>
                    <button onClick={() => copyToClipboard(`${listing.titleBN}\n\n${listing.descriptionBN}`, 'desc-bn')} className="text-[9px] font-black text-slate-400 hover:text-emerald-600">
                      {copyStatus === 'desc-bn' ? 'কপি হয়েছে' : 'সব কপি করুন'}
                    </button>
                 </div>
                 <h4 className="text-lg font-bold text-slate-900">{listing.titleBN}</h4>
                 <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line border-l-2 border-emerald-100 pl-4">{listing.descriptionBN}</p>
                 <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <p className="text-[9px] font-black text-emerald-400 uppercase mb-2">কল টু অ্যাকশন</p>
                    <p className="text-xs font-bold text-emerald-700">{listing.ctaBN}</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Professional SEO Toolkit */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bangla Search Strategy (SEO)</h4>
                <button onClick={() => copyToClipboard(listing.seoKeywordsBN.join(', '), 'bn-tags')} className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                  {copyStatus === 'bn-tags' ? 'COPIED' : 'COPY ALL TAGS'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {listing.seoKeywordsBN.map((k, i) => (
                  <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-emerald-300 font-bold">#{k}</span>
                ))}
              </div>
              <p className="text-[8px] text-slate-500 uppercase tracking-widest font-black opacity-50">Targeted for Daraz, Bikroy, FB Marketplace</p>
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 space-y-6">
               <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant JSON-LD Schema</h4>
                 <button onClick={() => copyToClipboard(listing.jsonLd, 'json')} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                   {copyStatus === 'json' ? 'COPIED' : 'COPY SCRIPT'}
                 </button>
               </div>
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[8px] h-32 overflow-y-auto text-slate-400 leading-tight">
                  {listing.jsonLd}
               </div>
               <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                   <i className="fa-brands fa-google"></i>
                 </div>
                 <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Rich Snippet Ready</p>
                   <p className="text-[8px] text-slate-400 font-bold uppercase">Optimized for Google Shopping</p>
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
