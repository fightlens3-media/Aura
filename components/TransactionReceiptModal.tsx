
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction, Currency } from '../types';
import { CATEGORY_ICONS } from '../constants';
import html2canvas from 'html2canvas';

interface TransactionReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({ isOpen, onClose, transaction }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!transaction) return null;

  const currencySymbols: Record<Currency, string> = {
    [Currency.USD]: '$',
    [Currency.EUR]: '€',
    [Currency.GBP]: '£',
    [Currency.BTC]: '₿',
    [Currency.ETH]: 'Ξ',
  };

  const transactionId = `FT-${transaction.id.slice(0, 8).toUpperCase()}`;
  const displayTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleCopyLink = () => {
    try {
      // Robust UTF-8 aware Base64 encoding
      const jsonStr = JSON.stringify(transaction);
      const encodedData = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => 
        String.fromCharCode(parseInt(p1, 16))
      ));
      
      const shareableLink = `${window.location.origin}${window.location.pathname}#/receipt/${encodedData}`;
      
      navigator.clipboard.writeText(shareableLink).then(() => {
        triggerToast('Cloud link copied successfully!');
        setShowShareOptions(false);
      });
    } catch (e) {
      triggerToast('Error creating share link.');
    }
  };

  const handleExportPDF = () => {
    setIsProcessing(true);
    triggerToast('Preparing PDF for download...');
    setTimeout(() => {
      setIsProcessing(false);
      window.print();
    }, 1000);
  };

  const handleSaveImage = async () => {
    if (!receiptRef.current) return;
    
    setIsProcessing(true);
    triggerToast('Capturing local receipt...');
    
    try {
      // Small pause to let UI settle
      await new Promise(r => setTimeout(r, 300));
      
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#0f172a',
        scale: 3, // Very high quality for desktop viewing
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('receipt-container');
          if (el) {
            el.style.boxShadow = 'none';
            el.style.border = '1px solid #1e293b';
          }
        }
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `FP-Receipt-${transactionId}.png`;
      link.href = image;
      link.click();
      
      triggerToast('PNG saved to your computer!');
    } catch (err) {
      console.error('Capture failed:', err);
      triggerToast('Failed to save image.');
    } finally {
      setIsProcessing(false);
      setShowShareOptions(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          id="receipt-overlay-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center px-4 pb-4 sm:items-center sm:p-0"
        >
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md print-hide" onClick={onClose} />
          
          <motion.div 
            ref={receiptRef}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl print:shadow-none print:border-0 print:bg-white"
            id="receipt-container"
          >
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mt-4 mb-2 opacity-30 print-hide" />

            <div className="p-8 pt-4">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-3xl shadow-xl border border-slate-700 relative print:bg-slate-100 print:border-slate-200">
                  {CATEGORY_ICONS[transaction.category] || CATEGORY_ICONS['Transfer']}
                  {/* Fix: Move delay into transition prop for correct Framer Motion API usage */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center print:border-white"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 print:text-slate-500">Transaction Value</h4>
                <div className="flex items-center justify-center space-x-1">
                  <span className={`text-4xl font-bold tracking-tighter ${transaction.type === 'debit' ? 'text-white print:text-black' : 'text-emerald-500'}`}>
                    {transaction.type === 'debit' ? '-' : '+'}{currencySymbols[transaction.currency]}{Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 print:bg-emerald-50 print:border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Secure Payment Confirmed</span>
                </div>
              </div>

              <div className="bg-slate-950/50 rounded-3xl border border-slate-800/50 p-6 space-y-5 relative overflow-hidden print:bg-white print:border-slate-200 print:text-black shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500 print:text-slate-400">Recipient / Service</span>
                  <span className="text-xs font-bold text-white print:text-black">{transaction.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500 print:text-slate-400">Date & Time</span>
                  <span className="text-xs font-bold text-white print:text-black">{transaction.date} • {displayTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500 print:text-slate-400">Transaction ID</span>
                  <span className="text-xs font-bold text-slate-300 font-mono tracking-tight print:text-slate-600 uppercase">{transactionId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500 print:text-slate-400">Category</span>
                  <span className="text-xs font-bold text-white px-2 py-0.5 bg-slate-800 rounded-lg print:text-black print:bg-slate-100">{transaction.category}</span>
                </div>
                {transaction.narrative && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500 print:text-slate-400">Narrative</span>
                    <span className="text-xs italic text-slate-300 print:text-slate-600 max-w-[60%] text-right truncate">{transaction.narrative}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center print:border-slate-100">
                  <span className="text-xs font-medium text-slate-500 print:text-slate-400">Payment Channel</span>
                  <span className="text-xs font-bold text-white flex items-center print:text-black">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    Fintech Pro Vault
                  </span>
                </div>
              </div>

              <div className="mt-6 px-4 py-3 bg-slate-800/20 rounded-2xl border border-slate-800/30 flex items-center justify-between print:bg-slate-50 print:border-slate-100 shadow-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest print:text-slate-500">Seal Verified</span>
                </div>
                <div className="text-[10px] font-mono text-slate-600 print:text-slate-300">
                  SEC-{transaction.id.slice(-6).toUpperCase()}
                </div>
              </div>

              <div className="mt-8 space-y-3 print-hide">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isProcessing}
                  onClick={() => setShowShareOptions(true)}
                  className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  <span>Share / Download</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full py-4 bg-slate-800 rounded-2xl font-bold text-slate-400 hover:text-white transition-all"
                >
                  Close
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {showShareOptions && (
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="absolute inset-x-0 bottom-0 bg-slate-800 border-t border-slate-700 rounded-t-[2.5rem] z-20 p-6 pt-10 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] share-sheet"
                >
                  <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mb-8 opacity-40" />
                  
                  <div className="flex justify-between items-center mb-8 px-4">
                    <h5 className="text-xl font-bold text-white tracking-tight">Save Receipt</h5>
                    <button onClick={() => setShowShareOptions(false)} className="text-slate-400 p-2 hover:bg-white/5 rounded-full transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-10">
                    <motion.button onClick={handleSaveImage} whileTap={{ scale: 0.9 }} className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-slate-700/50 rounded-3xl flex items-center justify-center text-white border border-slate-700 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all shadow-lg">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Save PNG</span>
                    </motion.button>

                    <motion.button onClick={handleExportPDF} whileTap={{ scale: 0.9 }} className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-slate-700/50 rounded-3xl flex items-center justify-center text-white border border-slate-700 group-hover:bg-emerald-600 group-hover:border-emerald-500 transition-all shadow-lg">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Save PDF</span>
                    </motion.button>

                    <motion.button onClick={handleCopyLink} whileTap={{ scale: 0.9 }} className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-slate-700/50 rounded-3xl flex items-center justify-center text-white border border-slate-700 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all shadow-lg">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Copy URL</span>
                    </motion.button>
                  </div>

                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowShareOptions(false)}
                    className="w-full py-5 bg-slate-700 rounded-2xl font-bold text-white text-sm hover:bg-slate-600 transition-colors shadow-lg"
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showToast && (
                <motion.div 
                  initial={{ y: 50, opacity: 0, x: "-50%" }}
                  animate={{ y: -20, opacity: 1, x: "-50%" }}
                  exit={{ y: 50, opacity: 0, x: "-50%" }}
                  className="fixed bottom-24 left-1/2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold text-xs shadow-2xl z-[100] whitespace-nowrap border border-white/20 flex items-center space-x-3 pointer-events-none"
                >
                  {isProcessing && (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  )}
                  <span>{showToast}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionReceiptModal;
