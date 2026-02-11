
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinancial } from '../context/FinancialContext.tsx';
import { Currency } from '../types.ts';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: Currency;
}

const PARTNER_CODES: Record<string, { name: string; icon: string; color: string }> = {
  '1122334455': { name: 'Aura Dynamics', icon: '💎', color: 'bg-blue-600' },
  '2233445566': { name: 'Nexus Global', icon: '🌐', color: 'bg-indigo-600' },
  '3344556677': { name: 'Zenith Assets', icon: '🏔️', color: 'bg-emerald-600' },
  '4455667788': { name: 'Stellar Holdings', icon: '✨', color: 'bg-amber-500' },
  '5566778899': { name: 'Orion Systems', icon: '🛰️', color: 'bg-purple-600' },
  '6677889900': { name: 'Vortex Capital', icon: '🌪️', color: 'bg-rose-600' },
  '7788990011': { name: 'Apollo Ventures', icon: '🚀', color: 'bg-orange-500' },
  '8899001122': { name: 'Titan Industries', icon: '🏗️', color: 'bg-slate-700' },
  '9900112233': { name: 'Nova Solutions', icon: '🧪', color: 'bg-cyan-500' },
  '0011223344': { name: 'Globo Finance', icon: '🌍', color: 'bg-green-600' },
};

type Step = 'bank_details' | 'coupon_choice' | 'purchase_info' | 'coupon_input' | 'amount' | 'processing' | 'success';

const SendMoneyModal: React.FC<SendMoneyModalProps> = ({ isOpen, onClose, currentCurrency }) => {
  const { sendMoney, wallets } = useFinancial();
  const [step, setStep] = useState<Step>('bank_details');
  const [bankInfo, setBankInfo] = useState({ recipient: '', bank: '', account: '' });
  const [couponCode, setCouponCode] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<typeof PARTNER_CODES[string] | null>(null);
  const [amount, setAmount] = useState('0');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const availableBalance = useMemo(() => {
    return wallets.find(w => w.currency === currentCurrency)?.balance || 0;
  }, [wallets, currentCurrency]);

  const handleNextFromBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (bankInfo.recipient && bankInfo.bank && bankInfo.account) {
      setStep('coupon_choice');
    }
  };

  const handleValidateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Explicit length check for clearer user feedback
    if (couponCode.length < 10) {
      setError(`INVALID: Code requires 10 digits. (Currently ${couponCode.length}/10)`);
      return;
    }

    setIsValidating(true);

    // Secure node discovery handshake
    await new Promise(r => setTimeout(r, 1200));

    const partner = PARTNER_CODES[couponCode];
    if (partner) {
      setSelectedPartner(partner);
      setStep('amount');
    } else {
      setError('ACCESS DENIED: Unrecognized Node Identifier.');
    }
    setIsValidating(false);
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
    const numAmount = parseFloat(amount);
    if (selectedPartner && numAmount <= availableBalance) {
      setStep('processing');
      
      setTimeout(() => {
        sendMoney(numAmount, `${selectedPartner.name} Node`, currentCurrency, `To: ${bankInfo.bank} - ${bankInfo.recipient}`);
        setStep('success');
        
        setTimeout(() => {
          onClose();
          setTimeout(() => resetState(), 300);
        }, 3000);
      }, 2000);
    }
  };

  const resetState = () => {
    setStep('bank_details');
    setBankInfo({ recipient: '', bank: '', account: '' });
    setCouponCode('');
    setSelectedPartner(null);
    setAmount('0');
    setError('');
  };

  const inputClass = "w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner disabled:opacity-50";
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
                  {step === 'bank_details' && 'Withdrawal Vault'}
                  {step === 'coupon_choice' && 'Security Protocol'}
                  {step === 'purchase_info' && 'Supplier Network'}
                  {step === 'coupon_input' && 'Node Authentication'}
                  {step === 'amount' && 'Transfer Amount'}
                  {step === 'processing' && 'Securing Link'}
                  {step === 'success' && 'Withdrawal Success'}
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
                      <label className={labelClass}>Recipient Full Name</label>
                      <input required type="text" placeholder="Recipient Name" value={bankInfo.recipient} onChange={e => setBankInfo({...bankInfo, recipient: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Destination Bank</label>
                      <input required type="text" placeholder="Chase, Revolut, etc." value={bankInfo.bank} onChange={e => setBankInfo({...bankInfo, bank: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Target Account Number</label>
                      <input required type="text" placeholder="0000000000" value={bankInfo.account} onChange={e => setBankInfo({...bankInfo, account: e.target.value})} className={inputClass} />
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-5 bg-rose-600 rounded-[1.5rem] text-white font-black uppercase tracking-widest text-xs mt-4">
                      Initial Handshake
                    </motion.button>
                  </motion.form>
                )}

                {step === 'coupon_choice' && (
                  <motion.div key="choice" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mx-auto border border-amber-500/20 mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <p className="text-lg font-black text-white leading-tight uppercase tracking-tight">Authentication Required</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">
                      This transaction needs a secure developer coupon <br/> to complete the withdrawal bridge.
                    </p>
                    <div className="space-y-3 pt-4">
                      <motion.button 
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('coupon_input')}
                        className="w-full py-5 bg-blue-600 rounded-[1.5rem] text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20"
                      >
                        Enter coupon to continue
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('purchase_info')}
                        className="w-full py-5 bg-slate-800 rounded-[1.5rem] text-slate-400 font-black uppercase tracking-widest text-[10px] border border-slate-700 hover:text-white"
                      >
                        Purchase coupon from a supplier
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {step === 'purchase_info' && (
                  <motion.div key="purchase" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6 text-center">
                    <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800">
                      <p className="text-xl font-black text-blue-500 mb-2 uppercase tracking-tighter">Authorized Network</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed mb-6">
                        Contact an authorized Aura Supplier <br/> to obtain a transaction-specific node coupon.
                      </p>
                      <div className="space-y-2 text-left">
                        <div className="p-3 bg-slate-900 rounded-xl flex justify-between items-center">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Supplier 1:</span>
                          <span className="text-[9px] font-black text-white">@AuraDevSupport</span>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl flex justify-between items-center">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Node Merchant:</span>
                          <span className="text-[9px] font-black text-white">#AURA-MERCH-01</span>
                        </div>
                      </div>
                    </div>
                    <motion.button 
                      onClick={() => setStep('coupon_choice')}
                      className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
                    >
                      Back to Gateway
                    </motion.button>
                  </motion.div>
                )}

                {step === 'coupon_input' && (
                  <motion.div key="coupon" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center mb-4 leading-relaxed">
                      Enter the secure 10-digit Developer Coupon <br/> to authorize node communication.
                    </p>
                    <form onSubmit={handleValidateCoupon} className="space-y-4">
                      <input autoFocus type="text" maxLength={10} placeholder="Developer Key" value={couponCode} onChange={e => { setCouponCode(e.target.value.replace(/\D/g, '')); setError(''); }} className={`${inputClass} text-center font-mono tracking-[0.5em] text-lg`} />
                      
                      {error && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                          <p className="text-rose-500 text-[9px] font-black uppercase tracking-widest text-center">{error}</p>
                        </motion.div>
                      )}

                      <motion.button disabled={isValidating} className="w-full py-5 bg-indigo-600 rounded-[1.5rem] text-white font-black uppercase tracking-widest text-xs flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        {isValidating ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : 'Authenticate Tunnel'}
                      </motion.button>
                      <button type="button" onClick={() => setStep('coupon_choice')} className="w-full text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 hover:text-white">Change Auth Method</button>
                    </form>
                  </motion.div>
                )}

                {step === 'amount' && (
                  <motion.div key="amount" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                      <div className={`w-12 h-12 ${selectedPartner?.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>{selectedPartner?.icon}</div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Routing via Node</p>
                        <h4 className="text-white font-black">{selectedPartner?.name}</h4>
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-[10px] text-slate-500 mb-2 font-black uppercase tracking-widest">Available: {availableBalance.toLocaleString()} {currentCurrency}</p>
                      <span className="text-5xl font-black text-white tracking-tighter">$<span className="text-blue-500">{amount}</span></span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map(k => (
                        <motion.button key={k} whileTap={{ scale: 0.9 }} onClick={() => handleKeyPress(k)} className="h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-xl font-black text-slate-200 border border-slate-800/50">{k}</motion.button>
                      ))}
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleConfirm} disabled={amount === '0' || parseFloat(amount) > availableBalance} className="w-full py-5 bg-blue-600 rounded-[1.5rem] font-black text-white shadow-2xl shadow-blue-500/30 text-xs uppercase tracking-widest">
                      {parseFloat(amount) > availableBalance ? 'Balance Exceeded' : 'Initiate Withdrawal'}
                    </motion.button>
                  </motion.div>
                )}

                {step === 'processing' && (
                  <motion.div key="processing" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="relative w-32 h-32 mb-8">
                       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-slate-800 border-l-transparent rounded-full" />
                       <div className="absolute inset-0 flex items-center justify-center text-3xl">🛡️</div>
                    </div>
                    <p className="text-xl font-black text-white mb-2 uppercase tracking-tight">Encrypting Handshake</p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Bridging secure connection to {bankInfo.bank}...</p>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div key="success" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-24 h-24 bg-blue-500 rounded-[2.5rem] flex items-center justify-center text-white mb-6 shadow-2xl shadow-blue-500/40">
                       <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </motion.div>
                    <p className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Withdrawal Success</p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 leading-relaxed">
                      ${amount} securely routed to <br/> {bankInfo.bank} account via {selectedPartner?.name}.
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

export default SendMoneyModal;
