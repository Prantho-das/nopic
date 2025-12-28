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
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const download = (url: string, name: string, style: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}-${style.toLowerCase()}.png`;
    link.click();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const titlePreview = lang === 'en' ? listing.titleEN : listing.titleBN;
  const descPreview = lang === 'en' ? listing.descriptionEN : listing.descriptionBN;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-500">
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left: Variants Selection */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.variantsTitle}</h3>
            <button onClick={onReset} className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors">
              <i className="fa-solid fa-arrow-left mr-1"></i> {t.backHome}
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {images.variants.map((v, i) => (
              <div 
                key={i} 
                className={`relative group cursor-pointer rounded-2xl overflow-hidden border-4 transition-all duration-300 ${activeImageIdx === i ? 'border-indigo-600 ring-4 ring-indigo-50 scale-95 shadow-lg' : 'border-white shadow-md hover:border-slate-100'}`} 
                onClick={() => setActiveImageIdx(i)}
              >
                <img src={v.url} alt={v.styleLabel} className="aspect-square object-cover w-full" />
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[8px] font-black text-white uppercase tracking-widest">
                  {v.styleLabel}
                </div>
                <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); download(v.url, 'product', v.styleLabel); }}
                    className="w-10 h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                  >
                    <i className="fa-solid fa-download"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Hero Live Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-4 px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.livePreview}</h3>
            <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-indigo-100">
              Style: {images.variants[activeImageIdx].styleLabel}
            </span>
          </div>
          
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 w-full transform hover:scale-[1.01] transition-all duration-700 group">
            <div className="aspect-[4/5] overflow-hidden relative">
              <img src={images.variants[activeImageIdx].url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Selected Style" />
              
              {/* Product Label Overlay */}
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                 <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20 shadow-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">AUTHENTICITY VERIFIED</span>
                 </div>
              </div>

              {/* Bottom Style Badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-effect p-4 rounded-2xl flex items-center justify-between border-white/40 shadow-2xl">
                   <div>
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Visual Mode</p>
                     <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.15em]">{images.variants[activeImageIdx].styleLabel} LIGHTING</p>
                   </div>
                   <button 
                      onClick={() => download(images.variants[activeImageIdx].url, 'listing', images.variants[activeImageIdx].styleLabel)}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2"
                   >
                     <i className="fa-solid fa-floppy-disk"></i> {t.download}
                   </button>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-4 text-left bg-gradient-to-b from-white to-slate-50">
              <h4 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{titlePreview}</h4>
              <p className="text-3xl font-black text-indigo-600">{listing.suggestedPrice || '$29.99'}</p>
              
              <div className="pt-4 border-t border-slate-200/50 space-y-3">
                <div className="flex items-center gap-2">
                   <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded uppercase">Organic Choice</div>
                   <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded uppercase">Free Delivery</div>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed font-medium">{descPreview}</p>
              </div>
              
              <button className="w-full mt-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 group">
                <i className="fa-solid fa-cart-shopping transition-transform group-hover:translate-x-1"></i> ADD TO STOREFRONT
              </button>
            </div>
          </div>
        </div>

        {/* Right: Content Management */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center justify-between">
              {t.listingTitle}
              <i className="fa-solid fa-pen-nib text-slate-300"></i>
            </h3>
            
            {/* Bilingual Content Blocks */}
            <div className="space-y-8">
              {/* EN */}
              <div className="space-y-4 group">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">English (Global)</label>
                  <button onClick={() => copyToClipboard(`${listing.titleEN}\n\n${listing.descriptionEN}`, 'en-copy')} className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1">
                    <i className="fa-solid fa-copy"></i> {copyStatus === 'en-copy' ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:border-indigo-100 transition-colors">
                  <h4 className="font-black text-slate-900 text-base">{listing.titleEN}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-2">{listing.descriptionEN}</p>
                </div>
              </div>

              {/* BN */}
              <div className="space-y-4 group">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg">বাংলা (Local)</label>
                  <button onClick={() => copyToClipboard(`${listing.titleBN}\n\n${listing.descriptionBN}`, 'bn-copy')} className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1">
                    <i className="fa-solid fa-copy"></i> {copyStatus === 'bn-copy' ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:border-emerald-100 transition-colors">
                  <h4 className="font-black text-slate-900 text-base">{listing.titleBN}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-2">{listing.descriptionBN}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => copyToClipboard(`${listing.titleEN}\n${listing.descriptionEN}\n\n${listing.titleBN}\n${listing.descriptionBN}`, 'all')}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all"
            >
              {copyStatus === 'all' ? <><i className="fa-solid fa-check"></i> {t.copySuccess}</> : <><i className="fa-solid fa-copy"></i> {t.copyAll}</>}
            </button>
          </div>
          
          {/* SEO Metadata Box */}
          <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <i className="fa-solid fa-magnifying-glass-chart text-7xl"></i>
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-4">SEO POWER PACK</h4>
            <div className="space-y-6">
               <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Primary Keywords</span>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.seoKeywordsEN.map((k, i) => <span key={i} className="text-[9px] bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded-lg border border-indigo-500/20 font-bold uppercase">#{k}</span>)}
                  </div>
               </div>
               <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Local SEO (BN)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.seoKeywordsBN.map((k, i) => <span key={i} className="text-[9px] bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded-lg border border-emerald-500/20 font-bold">#{k}</span>)}
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
