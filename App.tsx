import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import Uploader from './components/Uploader';
import ResultView from './components/ResultView';
import AdminPanel from './components/AdminPanel';
import { ProductListing, ImageData, ProcessingStatus, BackgroundStyle, UserProfile } from './types';
import { enhanceProductImage, generateProductCopy } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { uploadToCloudinary } from './services/cloudinaryService';

export const TRANSLATIONS = {
  en: {
    title: 'SNAPSELL',
    subtitle: 'Workspace AI',
    heroTitle: 'Studio Quality. High SEO.',
    heroDesc: 'Professional e-commerce photography for your shop.',
    uploadBtn: 'Transform Product Photo',
    uploadHint: 'Upload clear photo & choose style',
    watermarkPlaceholder: 'Optional: Watermark Text',
    processing: 'Enhancing Visuals...',
    storing: 'Saving to Cloud...',
    completed: 'Saved Successfully!',
    error: 'Generation Failed',
    tryAgain: 'Try Again',
    footer: 'SnapSell Workspace • Enterprise Grade E-commerce AI',
    backHome: 'Back',
    variantsTitle: 'Selected Style & Variants',
    livePreview: 'Storefront Preview',
    listingTitle: 'Listing Content',
    copyAll: 'Copy Complete Listing',
    desc: 'Description (EN)',
    descBN: 'Description (BN)',
    features: 'Highlights (EN)',
    featuresBN: 'Highlights (BN)',
    seoTitle: 'SEO Metadata',
    enTags: 'Keywords (EN)',
    bnTags: 'এসইও ট্যাগ',
    copySuccess: 'Copied!',
    download: 'Download Image',
    langToggle: 'বাংলা',
    login: 'Continue with Google',
    emailLogin: 'Sign In',
    emailSignup: 'Create Account',
    logout: 'Logout',
    admin: 'Command Center',
    password: 'Password',
    email: 'Email Address',
    authSwitchLogin: 'Already have an account? Sign In',
    authSwitchSignup: "Don't have an account? Sign Up",
    authError: 'Authentication failed',
    authSuccess: 'Success! Please check your email or sign in.',
    adminPortal: 'Admin Secure Access',
    guestNotice: 'Guest Mode: Sign in to save your history permanently.'
  },
  bn: {
    title: 'স্ন্যাপসেল',
    subtitle: 'ওয়ার্কস্পেস এআই',
    heroTitle: 'স্টুডিও কোয়ালিটি। হাই এসইও।',
    heroDesc: 'আপনার দোকানের জন্য পেশাদার ফটোগ্রাফি।',
    uploadBtn: 'প্রোডাক্ট ফটো রুপান্তর করুন',
    uploadHint: 'পরিষ্কার ফটো আপলোড করুন এবং স্টাইল বেছে নিন',
    watermarkPlaceholder: 'ঐচ্ছিক: ওয়াটারমার্ক টেক্সট',
    processing: 'ভিউ্যুয়াল উন্নত করা হচ্ছে...',
    storing: 'ক্লাউড স্টোরেজে সেভ হচ্ছে...',
    completed: 'সফলভাবে সেভ হয়েছে!',
    error: 'ব্যর্থ হয়েছে',
    tryAgain: 'আবার চেষ্টা করুন',
    footer: 'স্ন্যাপসেল ওয়ার্কস্পেস • এন্টারপ্রাইজ গ্রেড এআই',
    backHome: 'পিছনে',
    variantsTitle: 'নির্বাচিত স্টাইল এবং অন্যান্য',
    livePreview: 'স্টোরফ্রন্ট প্রিভিউ',
    listingTitle: 'লিস্টিং কন্টেন্ট',
    copyAll: 'সব কপি করুন',
    desc: 'পণ্যের বিবরণ (EN)',
    descBN: 'পণ্যের বিবরণ (BN)',
    features: 'বৈশিষ্ট্যসমূহ (EN)',
    featuresBN: 'বৈশিষ্ট্যসমূহ (BN)',
    seoTitle: 'সার্চ ইঞ্জিন মেটাডেটা',
    enTags: 'এসইও কিওয়ার্ড (EN)',
    bnTags: 'এসইও কিওয়ার্ড (BN)',
    copySuccess: 'কপি হয়েছে!',
    download: 'ডাউনলোড',
    langToggle: 'English',
    login: 'গুগল দিয়ে চালিয়ে যান',
    emailLogin: 'লগইন করুন',
    emailSignup: 'অ্যাকাউন্ট তৈরি করুন',
    logout: 'লগআউট',
    admin: 'কমান্ড সেন্টার',
    password: 'পাসওয়ার্ড',
    email: 'ইমেইল',
    authSwitchLogin: 'অ্যাকাউন্ট আছে? লগইন করুন',
    authSwitchSignup: 'অ্যাকাউন্ট নেই? নতুন তৈরি করুন',
    authError: 'অথেনটিকেশন ব্যর্থ হয়েছে',
    authSuccess: 'সফল হয়েছে! অনুগ্রহ করে আপনার ইমেল চেক করুন বা সাইন ইন করুন।',
    adminPortal: 'অ্যাডমিন সিকিউর অ্যাক্সেস',
    guestNotice: 'গেস্ট মোড: আপনার হিস্ট্রি সেভ করতে লগইন করুন।'
  }
};

const MainLayout: React.FC<{
  user: UserProfile | null;
  lang: 'en' | 'bn';
  setLang: (l: 'en' | 'bn') => void;
  handleLogout: () => void;
  handleGoogleLogin: () => void;
  children: React.ReactNode;
}> = ({ user, lang, setLang, handleLogout, handleGoogleLogin, children }) => {
  const t = TRANSLATIONS[lang];
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-x-hidden">
      <nav className="p-6 md:p-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-4 cursor-pointer">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-bolt-lightning text-white text-xl"></i>
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tighter leading-none block">{t.title}</span>
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{t.subtitle}</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} className="px-4 py-2 bg-white rounded-full shadow-sm border text-[10px] font-black hover:bg-slate-50 transition-all uppercase tracking-widest">
            {t.langToggle}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <Link 
                  to={location.pathname === '/admin' ? '/' : '/admin'}
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-all ${location.pathname === '/admin' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                >
                  <i className="fa-solid fa-gauge-high mr-1"></i> {t.admin}
                </Link>
              )}
              <button onClick={handleLogout} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors ml-2">
                {t.logout}
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-sm">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="avatar" />
              </div>
            </div>
          ) : (
            <button 
              onClick={handleGoogleLogin} 
              className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg flex items-center gap-2"
            >
              <i className="fa-brands fa-google text-xs"></i> {t.login.split(' ')[2] || 'Login'}
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 pb-20">
        {children}
      </main>
      
      <footer className="p-8 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.5em] border-t border-slate-100/50 bg-white/30 backdrop-blur-sm">
        {t.footer}
      </footer>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const t = TRANSLATIONS[lang];
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<ProcessingStatus>({ step: 'idle', message: '' });
  const [images, setImages] = useState<ImageData | null>(null);
  const [listing, setListing] = useState<ProductListing | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userEmail = session.user.email?.toLowerCase() || '';
        const isAdmin = userEmail === 'admin@gmail.com';
        setUser({ id: session.user.id, email: userEmail, role: isAdmin ? 'admin' : 'user' });
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userEmail = session.user.email?.toLowerCase() || '';
        const isAdmin = userEmail === 'admin@gmail.com';
        setUser({ id: session.user.id, email: userEmail, role: isAdmin ? 'admin' : 'user' });
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: window.location.origin }
        });
        if (error) throw error;
        setAuthSuccess(t.authSuccess);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (e: any) {
      setAuthError(e.message || t.authError);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const handleUpload = async (file: File, style: BackgroundStyle, watermark?: string) => {
    try {
      setStatus({ step: 'analyzing', message: t.processing });
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
      });
      
      const originalUrl = URL.createObjectURL(file);
      setImages({ original: originalUrl, variants: [], mimeType: file.type });

      // Always prioritize user selected style as first variant
      const stylesToGen: BackgroundStyle[] = Array.from(new Set([style, 'studio', 'nature', 'luxury']));
      
      const [copy, ...variantUrls] = await Promise.all([
        generateProductCopy(base64Data, file.type),
        ...stylesToGen.map(s => enhanceProductImage(base64Data, file.type, s, watermark))
      ]);

      setStatus({ step: 'storing', message: t.storing });
      
      let finalUrls = variantUrls;
      if (user) {
        try {
          finalUrls = await Promise.all(variantUrls.map(u => uploadToCloudinary(u)));
          await supabase.from('products').insert({
            user_id: user.id,
            user_email: user.email,
            title: copy.titleEN,
            description: copy.descriptionEN,
            image_urls: finalUrls,
            listing_data: copy
          });
        } catch (e) { 
          console.warn('Persistence failed, continuing in guest mode', e); 
        }
      }

      setListing(copy);
      setImages({ 
        original: originalUrl, 
        mimeType: file.type, 
        variants: variantUrls.map((url, i) => ({ 
          url, 
          styleLabel: stylesToGen[i].toUpperCase() 
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
    <MainLayout user={user} lang={lang} setLang={setLang} handleLogout={handleLogout} handleGoogleLogin={handleGoogleLogin}>
      <Routes>
        <Route path="/" element={
          <div className="animate-in fade-in duration-1000 px-4">
            <Uploader t={t} onUpload={handleUpload} isLoading={status.step !== 'idle' && status.step !== 'completed' && status.step !== 'error'} />
            
            {status.step === 'error' && (
              <div className="text-center p-12 max-w-md mx-auto mt-10 bg-white rounded-3xl border border-red-50 shadow-lg">
                <i className="fa-solid fa-circle-xmark text-4xl text-red-500 mb-4"></i>
                <h3 className="text-xl font-black text-slate-900">{t.error}</h3>
                <p className="text-slate-500 text-sm mb-6">{status.message}</p>
                <button onClick={reset} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs">{t.tryAgain}</button>
              </div>
            )}

            {!user && status.step === 'idle' && (
              <div className="text-center mt-12 py-8 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-white/50 max-w-lg mx-auto shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-8">{t.guestNotice}</p>
                <button 
                  onClick={handleGoogleLogin} 
                  className="px-8 py-3 bg-white border border-slate-100 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-md flex items-center gap-2 mx-auto"
                >
                  <i className="fa-brands fa-google"></i> Login to Sync History
                </button>
              </div>
            )}
          </div>
        } />
        
        <Route path="/result" element={
          listing && images ? (
            <ResultView t={t} listing={listing} images={images} onReset={reset} lang={lang} />
          ) : (
            <Navigate to="/" />
          )
        } />

        <Route path="/admin/login" element={
          user?.role === 'admin' ? <Navigate to="/admin" /> : (
            <div className="max-w-md mx-auto p-10 bg-slate-900 rounded-[3rem] shadow-2xl mt-20 text-white border border-white/5">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <i className="fa-solid fa-shield-halved text-2xl"></i>
                </div>
                <h3 className="text-2xl font-black tracking-tight">{t.adminPortal}</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Secure Gateway</p>
              </div>

              {authError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400">
                  <i className="fa-solid fa-circle-exclamation mt-1"></i>
                  <p className="text-xs font-medium leading-relaxed">{authError}</p>
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block px-1">{t.email}</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-white/20 outline-none transition-all text-white" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block px-1">{t.password}</label>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-white/20 outline-none transition-all text-white" />
                </div>
                <button disabled={authLoading} className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-slate-100 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {authLoading ? 'Authenticating...' : t.emailLogin}
                </button>
              </form>
            </div>
          )
        } />

        <Route path="/admin" element={
          user?.role === 'admin' ? <AdminPanel t={t} onBack={() => navigate('/')} /> : <Navigate to="/admin/login" />
        } />
      </Routes>
    </MainLayout>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
