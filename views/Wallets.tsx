
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Currency, Wallet } from '../types';
import { useFinancial } from '../context/FinancialContext';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

const WalletAuditModal = ({ wallet, isOpen, onClose }: { wallet: Wallet; isOpen: boolean; onClose: () => void }) => {
  const [auditStep, setAuditStep] = useState(0);
  const [securityScore, setSecurityScore] = useState(0);
  
  const steps = [
    "Initializing Secure Handshake...",
    "Verifying Blockchain Integrity...",
    "Scanning Cold Storage Vaults...",
    "Validating P2P Encryption Keys...",
    "Audit Complete. Status: 100% Secure"
  ];

  useEffect(() => {
    if (isOpen) {
      setAuditStep(0);
      setSecurityScore(0);
      const interval = setInterval(() => {
        setAuditStep((prev) => {
          if (prev < steps.length - 1) {
            setSecurityScore(s => Math.min(100, s + Math.floor(Math.random() * 20) + 10));
            return prev + 1;
          }
          setSecurityScore(100);
          return prev;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[3rem] p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Progress Bar Background */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((auditStep + 1) / steps.length) * 100}%` }}
                className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
              />
            </div>

            <div className="flex flex-col items-center text-center space-y-6 pt-4">
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="w-28 h-28 border-2 border-dashed border-blue-500/20 rounded-full flex items-center justify-center"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    animate={auditStep === steps.length - 1 ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : { scale: [1, 1.05, 1] }}
                    transition={{ repeat: auditStep === steps.length - 1 ? 0 : Infinity, duration: 2 }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-blue-500 transition-colors duration-500 ${auditStep === steps.length - 1 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-600/10'}`}
                  >
                    {auditStep === steps.length - 1 ? (
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    )}
                  </motion.div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Security Audit</h3>
                <div className="flex items-center justify-center space-x-2 mt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{wallet.symbol} {wallet.id.toUpperCase()}</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full" />
                  <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Score: {securityScore}%</span>
                </div>
              </div>

              <div className="w-full bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 min-h-[80px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={auditStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`text-xs font-mono text-center tracking-tight ${auditStep === steps.length - 1 ? 'text-emerald-400' : 'text-blue-400'}`}
                  >
                    {steps[auditStep]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                disabled={auditStep < steps.length - 1}
                className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                  auditStep === steps.length - 1 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                  : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                }`}
              >
                Continue to Dashboard
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Wallets: React.FC = () => {
  const { wallets, updateWallets } = useFinancial();
  const [swappingId, setSwappingId] = useState<string | null>(null);
  const [auditingWallet, setAuditingWallet] = useState<Wallet | null>(null);
  const [marketRates, setMarketRates] = useState([
    { pair: 'EUR/USD', rate: 1.0824, change: 0.12 },
    { pair: 'GBP/USD', rate: 1.2510, change: -0.05 },
    { pair: 'BTC/USD', rate: 65210.40, change: 2.40 },
  ]);

  // Reactive Market Fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketRates(prev => prev.map(item => ({
        ...item,
        rate: item.rate + (Math.random() - 0.5) * (item.rate * 0.0001),
        change: item.change + (Math.random() - 0.5) * 0.01
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nameMap: Record<string, string> = {
    'usd-wallet': 'USD Wallet',
    'gbp-wallet': 'Pounds Wallet',
    'crypto-wallet': 'Crypto Wallet'
  };

  const handleSwapToEuro = (id: string) => {
    setSwappingId(id);
    setTimeout(() => {
      const updated = wallets.map(w => {
        if (w.id === id && w.currency !== Currency.EUR) {
          const rateToEuro = w.currency === Currency.USD ? 0.92 : (w.currency === Currency.GBP ? 1.17 : 62000);
          return {
            ...w,
            currency: Currency.EUR,
            symbol: '€',
            balance: w.balance * rateToEuro,
            color: 'bg-indigo-600'
          };
        }
        return w;
      });
      updateWallets(updated);
      setSwappingId(null);
    }, 1500);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <AnimatePresence>
        {auditingWallet && (
          <WalletAuditModal 
            wallet={auditingWallet} 
            isOpen={!!auditingWallet} 
            onClose={() => setAuditingWallet(null)} 
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col space-y-1">
        <motion.h2 variants={itemVariants} className="text-3xl font-black text-white uppercase tracking-tight">Vault Management</motion.h2>
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">3 Active Nodes • Encrypted Sync</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {wallets.map((wallet) => (
          <motion.div 
            key={wallet.id} 
            variants={itemVariants}
            layout
            className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] relative overflow-hidden group shadow-2xl transition-all hover:border-blue-500/30"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-5">
                <motion.div 
                  layoutId={`icon-${wallet.id}`}
                  className={`w-16 h-16 ${wallet.color} rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-2xl border border-white/10`}
                >
                  {wallet.symbol}
                </motion.div>
                <div>
                  <h3 className="font-black text-white text-lg tracking-tight uppercase leading-none mb-1">{nameMap[wallet.id] || wallet.currency}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black opacity-60">Master Vault Index</p>
                </div>
              </div>
              <div className="text-right">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={`${wallet.id}-${wallet.balance}`}
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="text-2xl font-black text-white tracking-tighter"
                  >
                    {wallet.symbol}{wallet.balance.toLocaleString(undefined, { 
                      minimumFractionDigits: wallet.currency === 'BTC' ? 4 : 2, 
                      maximumFractionDigits: wallet.currency === 'BTC' ? 4 : 2 
                    })}
                  </motion.p>
                </AnimatePresence>
                <div className="flex items-center justify-end space-x-1.5 mt-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Liquid State</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                disabled={wallet.currency === Currency.EUR || swappingId === wallet.id}
                onClick={() => handleSwapToEuro(wallet.id)}
                className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 border shadow-sm ${
                  wallet.currency === Currency.EUR 
                    ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-default' 
                    : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border-blue-500/20'
                }`}
              >
                {swappingId === wallet.id ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </motion.div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                )}
                <span>{wallet.currency === Currency.EUR ? 'EUR ACTIVE' : 'Swap Asset'}</span>
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuditingWallet(wallet)}
                className="py-4 bg-slate-800/50 border border-slate-800 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span>Full Audit</span>
              </motion.button>
            </div>
            
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none scale-150 rotate-12">
              <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button 
        variants={itemVariants}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.01, backgroundColor: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.3)' }}
        className="w-full py-6 border-2 border-dashed border-slate-800 rounded-[2.5rem] text-slate-500 font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center space-x-3 bg-slate-900/10"
      >
        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </div>
        <span>Initialize Global Node</span>
      </motion.button>

      <motion.section variants={itemVariants} className="mt-12 pb-12">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="font-black text-sm uppercase tracking-[0.2em] text-slate-500">Global Signal Index</h3>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Feed</span>
          </div>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl">
          {marketRates.map((item, i) => (
            <motion.div 
              key={item.pair} 
              layout
              className="flex justify-between items-center p-6 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-xs font-black text-slate-400 border border-slate-700">
                  {item.pair.split('/')[0]}
                </div>
                <div>
                  <span className="font-black text-white text-xs uppercase tracking-widest">{item.pair}</span>
                  <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">Inter-Market Spot Rate</p>
                </div>
              </div>
              <div className="text-right">
                <motion.p 
                  animate={{ color: item.change >= 0 ? ['#f8fafc', '#10b981', '#f8fafc'] : ['#f8fafc', '#f43f5e', '#f8fafc'] }}
                  transition={{ duration: 0.5 }}
                  className="font-black text-white text-sm tracking-tight"
                >
                  {item.rate.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                </motion.p>
                <div className={`text-[10px] font-black uppercase mt-1 ${item.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Wallets;
