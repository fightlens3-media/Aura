
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Transaction, Currency } from '../types';
import { CATEGORY_ICONS } from '../constants';

const ReceiptDetail: React.FC = () => {
  const { encodedData } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    try {
      if (encodedData) {
        // Robust UTF-8 aware Base64 decoding
        const decodedString = decodeURIComponent(atob(encodedData).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decoded = JSON.parse(decodedString);
        setTransaction(decoded);
      }
    } catch (e) {
      console.error("Failed to decode receipt data", e);
    }
  }, [encodedData]);

  if (!transaction) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 text-slate-500 shadow-xl border border-slate-800"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </motion.div>
        <h1 className="text-2xl font-bold text-white mb-2">Invalid Document Link</h1>
        <p className="text-slate-500 text-sm mb-8 max-w-xs leading-relaxed">This receipt link may be incomplete or the secure signature has expired.</p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-lg"
        >
          Return to Dashboard
        </motion.button>
      </div>
    );
  }

  const currencySymbols: Record<Currency, string> = {
    [Currency.USD]: '$',
    [Currency.EUR]: '€',
    [Currency.GBP]: '£',
    [Currency.BTC]: '₿',
    [Currency.ETH]: 'Ξ',
  };

  const transactionId = `FT-${transaction.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-12 relative overflow-hidden print:bg-white print:p-0">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30 print:hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -45, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl relative z-10 print:bg-white print:border-0 print:shadow-none print:max-w-none"
        id="receipt-container"
      >
        <div className="p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white italic text-xl mb-4 shadow-lg print:hidden">FP</div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] print:hidden">Digital Vault Document</p>
          </div>

          <div className="flex justify-center mb-8">
             <div className="w-24 h-24 bg-slate-800 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl border border-slate-700 relative print:bg-slate-100 print:border-slate-200">
                {CATEGORY_ICONS[transaction.category] || CATEGORY_ICONS['Transfer']}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center print:border-white">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
             </div>
          </div>

          <div className="text-center mb-10">
            <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3 print:text-slate-500">Transaction Value</h4>
            <div className="flex items-center justify-center">
              <span className={`text-5xl font-bold tracking-tighter ${transaction.type === 'debit' ? 'text-white print:text-black' : 'text-emerald-500'}`}>
                {transaction.type === 'debit' ? '-' : '+'}{currencySymbols[transaction.currency]}{Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 print:bg-emerald-50 print:border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Verified Secure</span>
            </div>
          </div>

          <div className="bg-slate-950/50 rounded-[2rem] border border-slate-800/50 p-8 space-y-6 relative overflow-hidden print:bg-white print:border-slate-200 print:text-black shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Merchant / User</span>
              <span className="text-sm font-black text-white print:text-black">{transaction.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</span>
              <span className="text-sm font-bold text-white print:text-black">{transaction.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ref ID</span>
              <span className="text-xs font-bold text-slate-300 font-mono tracking-widest print:text-slate-600 uppercase bg-slate-800/50 px-2 py-1 rounded-md">{transactionId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</span>
              <span className="text-xs font-black text-white px-3 py-1 bg-slate-800 rounded-xl print:text-black print:bg-slate-100">{transaction.category}</span>
            </div>
            <div className="pt-6 border-t border-slate-800/80 flex justify-between items-center print:border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Network</span>
              <span className="text-xs font-black text-blue-400 flex items-center print:text-black uppercase tracking-widest">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                Pro Vault
              </span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 print:hidden">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.print()}
              className="py-5 bg-blue-600 rounded-2xl font-black text-white shadow-xl text-sm"
            >
              Save as PDF
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="py-5 bg-slate-800 rounded-2xl font-black text-slate-400 hover:text-white transition-all text-sm"
            >
              Back to App
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-12 text-center print:hidden">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Fintech Pro Global Secure Document Service</p>
      </div>
    </div>
  );
};

export default ReceiptDetail;
