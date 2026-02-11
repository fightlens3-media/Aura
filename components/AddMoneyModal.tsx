
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinancial } from '../context/FinancialContext.tsx';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'bank_details' | 'amount' | 'processing' | 'success';

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ isOpen, onClose }) => {
  const { addMoney } = useFinancial();
  const [step, setStep] = useState<Step>('bank_details');
  const [bankInfo, setBankInfo] = useState({ name: '', bank: '', account: '' });
  const [amount, setAmount] = useState('0');

  const handleNextFromBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (bankInfo.name && bankInfo.bank && bankInfo.account) {
      setStep('amount');
    }
  };

  const handleKeyPress = (val: string) => {
    if (val === 'C') {
      setAmount('0');
    } else if (val === '⌫') {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setAmount(prev => prev === '0' ? val : prev + val);
    }
  };

  const handleConfirm = () => {
    setStep('processing');
    
    // Mandatory 2 second processing delay
    setTimeout(() => {
      addMoney(parseFloat(amount), `Deposit via ${bankInfo.bank}`);
      setStep('success');
      setTimeout(() => {
        onClose();
        setTimeout(() => resetState(), 300);
      }, 2500);
    }, 2000);
  };

  const resetState = () => {
    setStep('bank_details');
    setBankInfo({ name: '', bank: '', account: '' });
    setAmount('0');
  };

  const inputClass = "w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner";
  const labelClass = "block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-4 sm:items-center sm:p-0">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} className="relative w-full max-w-md bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {step === 'bank_details' && 'Deposit Source'}
                  {step === 'amount' && 'Secure Amount'}
                  {step === 'processing' && 'Syncing Vault'}
                  {step === 'success' && 'Deposit Success'}
                </h3>
                {step !== 'processing' && (
                  <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {step === 'bank_details' && (
                  <motion.form key="bank" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} onSubmit={handleNextFromBank} className="space-y-4">
                    <div>
                      <label className={labelClass}>Account Holder Name</label>
                      <input required type="text" placeholder="John Doe" value={bankInfo.name} onChange={e => setBankInfo({...bankInfo, name: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Originating Bank</label>
                      <input required type="text" placeholder="Chase, Wells Fargo, etc." value={bankInfo.bank} onChange={e => setBankInfo({...bankInfo, bank: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>External Account Number</label>
                      <input required type="text" placeholder="0000000000" value={bankInfo.account} onChange={e => setBankInfo({...bankInfo, account: e.target.value})} className={inputClass} />
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-5 bg-blue-600 rounded-[1.5rem] text-white font-black uppercase tracking-widest text-xs mt-4">
                      Authorize Transfer
                    </motion.button>
                  </motion.form>
                )}

                {step === 'amount' && (
                  <motion.div key="amount" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                    <div className="text-center py-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Deposit Value</p>
                      <span className="text-5xl font-black text-white tracking-tighter">$<span className="text-blue-500">{amount}</span></span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map(k => (
                        <motion.button key={k} whileTap={{ scale: 0.9 }} onClick={() => handleKeyPress(k)} className="h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-xl font-black text-slate-200 border border-slate-800/50">{k}</motion.button>
                      ))}
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleConfirm} disabled={amount === '0'} className="w-full py-5 bg-blue-600 rounded-[1.5rem] font-black text-white shadow-2xl shadow-blue-500/30 text-xs uppercase tracking-widest">Confirm Deposit</motion.button>
                  </motion.div>
                )}

                {step === 'processing' && (
                  <motion.div key="processing" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="relative w-32 h-32 mb-8">
                       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-slate-800 border-l-transparent rounded-full" />
                       <div className="absolute inset-0 flex items-center justify-center text-3xl">🔄</div>
                    </div>
                    <p className="text-xl font-black text-white mb-2 uppercase tracking-tight">Syncing Transaction</p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Processing external node request...</p>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div key="success" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-12">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mb-6 shadow-2xl shadow-emerald-500/30">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                    </motion.div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Vault Updated</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 text-center leading-relaxed">
                      ${amount} has been securely synchronized <br/> to your master ledger.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMoneyModal;
