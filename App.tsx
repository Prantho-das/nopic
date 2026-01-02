
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import Uploader from './components/Uploader';
import ResultView from './components/ResultView';
import AdminPanel from './components/AdminPanel';
import { ProductListing, ImageData, ProcessingStatus, BackgroundStyle, BrandVoice, UserProfile } from './types';
import { enhanceProductImage, generateProductCopy } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { uploadToCloudinary } from './services/cloudinaryService';

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
    variantsTitle: 'Atmosphere Catalog'
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
    variantsTitle: 'অ্যাসেট ক্যাটালগ'
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

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email!, role: session.user.email === 'admin@gmail.com' ? 'admin' : 'user' });
      }
    };
    checkSession();
  }, []);

  const handleUpload = async (file: File, styles: BackgroundStyle[], brandName: string, voice: BrandVoice) => {
    try {
      setStatus({ step: 'analyzing', message: t.processing });
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
      });
      
      const originalUrl = URL.createObjectURL(file);
      setImages({ original: originalUrl, variants: [], mimeType: file.type });

      // Parallel Generation
      const [copy, ...variantUrls] = await Promise.all([
        generateProductCopy(base64Data, file.type, brandName, voice),
        ...styles.map(s => enhanceProductImage(base64Data, file.type, s, brandName))
      ]);

      setStatus({ step: 'storing', message: t.storing });
      
      setListing(copy);
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
      setStatus({ step: 'error', message: error.message || t.error });
    }
  };

  const reset = () => { 
    setImages(null); 
    setListing(null); 
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
              <div className="max-w-md mx-auto mt-10 p-10 bg-white rounded-[3rem] text-center shadow-xl border border-red-50">
                <i className="fa-solid fa-circle-xmark text-red-500 text-4xl mb-4"></i>
                <h3 className="text-xl font-black text-slate-900">{t.error}</h3>
                <p className="text-slate-500 text-sm mb-6">{status.message}</p>
                <button onClick={reset} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">{t.tryAgain}</button>
              </div>
            )}
          </div>
        } />
        <Route path="/result" element={
          listing && images ? <ResultView t={t} listing={listing} images={images} onReset={reset} lang={lang} /> : <Navigate to="/" />
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
