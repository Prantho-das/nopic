
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Uploader from './components/Uploader';
import ResultView from './components/ResultView';
import AdminPanel from './components/AdminPanel';
import { ProductListing, ImageData, ProcessingStatus, BackgroundStyle, BrandVoice, UserProfile } from './types';
import { enhanceProductImage, generateProductCopy, refineProductImage } from './services/geminiService';
import { supabase } from './services/supabaseClient';

export const TRANSLATIONS = {
  en: {
    title: 'SNAPSELL',
    subtitle: 'Workspace AI',
    uploadBtn: 'Generate Catalog',
    processing: 'Enhancing Visuals & Local SEO...',
    storing: 'Optimizing for BD Marketplace...',
    completed: 'Catalog Assets Ready',
    error: 'Processing Fault',
    tryAgain: 'Recalibrate',
    footer: 'SnapSell Workspace • High-Conversion E-commerce AI',
    backHome: 'Exit Studio',
    variantsTitle: 'Atmosphere Catalog',
    errFile: 'Could not read the image file. Please try a different photo.',
    errAI: 'The AI Studio is currently busy or the image was rejected. Please try again.',
    errCopy: 'Failed to generate sales copy. Please check your brand name and try again.',
    errGeneral: 'An unexpected error occurred in our studio.'
  },
  bn: {
    title: 'স্ন্যাপসেল',
    subtitle: 'ওয়ার্কস্পেস এআই',
    uploadBtn: 'ক্যাটালগ তৈরি করুন',
    processing: 'এনালাইসিস এবং এসইও চলছে...',
    storing: 'মার্কেটপ্লেস অপ্টিমাইজেশন চলছে...',
    completed: 'সব অ্যাসেট তৈরি হয়েছে!',
    error: 'ব্যর্থ হয়েছে',
    tryAgain: 'আবার চেষ্টা করুন',
    footer: 'স্ন্যাপসেল ওয়ার্কস্পেস • হাই-কনভার্সন ই-কমার্স এআই',
    backHome: 'ফিরে যান',
    variantsTitle: 'অ্যাসেট ক্যাটালগ',
    errFile: 'ছবিটি পড়া সম্ভব হয়নি। অন্য একটি ছবি চেষ্টা করুন।',
    errAI: 'এআই স্টুডিও এখন ব্যস্ত অথবা ছবিটি গ্রহণ করেনি। আবার চেষ্টা করুন।',
    errCopy: 'সেলস কপি তৈরি করা সম্ভব হয়নি। আপনার ব্র্যান্ডের নাম চেক করে আবার চেষ্টা করুন।',
    errGeneral: 'একটি অপ্রত্যাশিত সমস্যা হয়েছে।'
  }
};

const MainLayout: React.FC<{
  user: UserProfile | null;
  lang: 'en' | 'bn';
  setLang: (l: 'en' | 'bn') => void;
  children: React.ReactNode;
}> = ({ user, lang, setLang, children }) => {
  const t = (TRANSLATIONS as any)[lang];
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="p-6 md:p-10 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200">
            <i className="fa-solid fa-camera text-white text-xl"></i>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter block leading-none">{t.title}</span>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">{t.subtitle}</span>
          </div>
        </Link>
        <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">
          {lang === 'en' ? 'বাংলা' : 'English'}
        </button>
      </nav>
      <main className="flex-1 pb-20">{children}</main>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const t = (TRANSLATIONS as any)[lang];
  const navigate = useNavigate();
  const [status, setStatus] = useState<ProcessingStatus>({ step: 'idle', message: '' });
  const [images, setImages] = useState<ImageData | null>(null);
  const [listing, setListing] = useState<ProductListing | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentBrandName, setCurrentBrandName] = useState('');
  const [currentMimeType, setCurrentMimeType] = useState('image/png');
  const [originalBase64, setOriginalBase64] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({ 
            id: session.user.id, 
            email: session.user.email!, 
            role: session.user.email === 'admin@gmail.com' ? 'admin' : 'user' 
          });
        }
      } catch (e) {
        console.warn("Supabase session check skipped or failed.");
      }
    };
    checkSession();
  }, []);

  const handleUpload = async (file: File, styles: BackgroundStyle[], brandName: string, voice: BrandVoice) => {
    try {
      setCurrentBrandName(brandName);
      setCurrentMimeType(file.type);
      setStatus({ step: 'analyzing', message: t.processing });
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = () => reject(new Error(t.errFile));
      });
      setOriginalBase64(base64Data);
      
      const originalUrl = URL.createObjectURL(file);
      setImages({ original: originalUrl, variants: [], mimeType: file.type });

      // Performance Optimization: Parallelize Copy Generation and all Image Enhancements
      setStatus({ step: 'enhancing', message: 'Generating Catalog Assets Simultaneously...' });
      
      const [copyResult, variantUrls] = await Promise.all([
        generateProductCopy(base64Data, file.type, brandName, voice).catch(() => { throw new Error(t.errCopy); }),
        Promise.all(styles.map(s => enhanceProductImage(base64Data, file.type, s, brandName))).catch(() => { throw new Error(t.errAI); })
      ]);

      setStatus({ step: 'storing', message: 'Finalizing Localized Catalog...' });
      setListing(copyResult);
      setImages({ 
        original: originalUrl, 
        mimeType: file.type, 
        variants: variantUrls.map((url, i) => ({ 
          url, 
          styleLabel: styles[i].toUpperCase().replace('_', ' ') 
        })) 
      });

      setStatus({ step: 'completed', message: t.completed });
      navigate('/result');
    } catch (error: any) {
      console.error("Studio Processing Error:", error);
      setStatus({ 
        step: 'error', 
        message: error.message || t.errGeneral 
      });
    }
  };

  const handleRefine = async (idx: number, prompt: string) => {
    if (!images || !originalBase64) return;
    try {
      const newUrl = await refineProductImage(originalBase64, currentMimeType, images.variants[idx].styleLabel, prompt, currentBrandName);
      const newVariants = [...images.variants];
      newVariants[idx] = { ...newVariants[idx], url: newUrl };
      setImages({ ...images, variants: newVariants });
    } catch (err) {
      console.error("Refinement error:", err);
      throw err;
    }
  };

  const reset = () => { 
    setImages(null); 
    setListing(null); 
    setOriginalBase64('');
    setStatus({ step: 'idle', message: '' }); 
    navigate('/');
  };

  return (
    <MainLayout user={user} lang={lang} setLang={setLang}>
      <Routes>
        <Route path="/" element={
          <div className="animate-in fade-in duration-700">
            <Uploader t={t} onUpload={handleUpload} isLoading={status.step !== 'idle' && status.step !== 'completed' && status.step !== 'error'} />
            {status.step === 'error' && (
              <div className="max-w-md mx-auto mt-10 p-10 bg-white rounded-[3rem] text-center shadow-xl border border-red-100 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
                </div>
                <h3 className="text-xl font-black text-slate-900">{t.error}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{status.message}</p>
                <button onClick={reset} className="w-full mt-4 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all">
                  <i className="fa-solid fa-rotate-right mr-2"></i> {t.tryAgain}
                </button>
              </div>
            )}
          </div>
        } />
        <Route path="/result" element={
          listing && images ? <ResultView t={t} listing={listing} images={images} onReset={reset} onRefine={handleRefine} lang={lang} /> : <Navigate to="/" />
        } />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel t={t} onBack={() => navigate('/')} /> : <Navigate to="/" />} />
      </Routes>
    </MainLayout>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
