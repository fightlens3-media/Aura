
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    const result = await login(email.trim(), password);
    
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 800);
    } else {
      setError(result.error || 'AUTHENTICATION FAILED.');
    }
  };

  const handleFastTrack = () => {
    setEmail('RobertJWhite@dayrep.com');
    setPassword('quoong9Aox');
    // Instant login feel
    setTimeout(() => {
      handleLogin();
    }, 400);
  };

  const inputClass = "w-full bg-[#111827]/80 border border-slate-800 rounded-2xl px-6 py-5 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner disabled:opacity-50 font-medium";

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs to match screenshot aesthetic */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] bg-indigo-900/20 rounded-full blur-[140px]" />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="w-full max-w-sm z-10 space-y-10"
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6">
              <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Access Granted</h2>
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em]">Synchronizing Master Node...</p>
            </motion.div>
          ) : (
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#2563eb] rounded-3xl flex items-center justify-center font-black text-white italic text-4xl mx-auto shadow-2xl border border-blue-400/20">A</div>
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Aura</h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em]">Authorized Access Only</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative border-2 border-blue-500/20 rounded-3xl p-1 bg-[#111827]/30 backdrop-blur-sm">
                  <div className="space-y-1">
                    <input 
                      required 
                      type="email" 
                      placeholder="Email Identifier" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className={inputClass} 
                      disabled={isLoading} 
                    />
                    <input 
                      required 
                      type="password" 
                      placeholder="Access Key" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className={inputClass} 
                      disabled={isLoading} 
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4"
                    >
                      <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  disabled={isLoading} 
                  className="w-full py-5 bg-[#2563eb] rounded-3xl text-white font-black uppercase tracking-widest text-sm shadow-[0_15px_40px_rgba(37,99,235,0.3)] flex items-center justify-center space-x-3"
                >
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <span>Synchronize Node</span>
                  )}
                </motion.button>
              </form>

              <button 
                onClick={handleFastTrack} 
                className="w-full text-[9px] text-slate-700 font-black uppercase tracking-[0.4em] hover:text-blue-500 transition-colors"
              >
                Request Manual Node Override
              </button>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="absolute bottom-10 text-slate-800 text-[9px] font-black uppercase tracking-[0.6em]">
        Private Infrastructure Node V4.1.2
      </div>
    </div>
  );
};

export default Auth;
