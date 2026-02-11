
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinancial } from '../context/FinancialContext';
import { Card } from '../types';

// Properly type CardItem as a React Functional Component to accept standard props like 'key'
const CardItem: React.FC<{ card: Card }> = ({ card }) => {
  const { toggleCardStatus, user } = useFinancial();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleStatus = () => {
    setIsProcessing(true);
    setTimeout(() => {
      toggleCardStatus(card.id);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      layout
      className="space-y-4"
    >
      <div className="relative h-56 w-full perspective-1000">
        <motion.div 
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="relative w-full h-full preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of Card */}
          <div 
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${card.color} rounded-[2.5rem] p-8 flex flex-col justify-between shadow-2xl backface-hidden border border-white/20`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-10 bg-amber-400/80 rounded-lg shadow-inner border border-white/10" />
              <div className="text-white italic font-black text-2xl opacity-90 tracking-tighter">VISA</div>
            </div>
            
            <div>
              <p className="text-white/40 text-[9px] tracking-[0.3em] mb-2 font-black uppercase">Secure Vault Card</p>
              <p className="text-white text-xl font-mono tracking-[0.1em] drop-shadow-lg overflow-hidden whitespace-nowrap">
                {card.cardNumber}
              </p>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mt-3 truncate">
                {user.name}
              </p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/40 text-[8px] tracking-[0.2em] font-black uppercase">Valid Thru</p>
                <p className="text-white text-sm font-black">{card.expiry}</p>
              </div>
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/80 backdrop-blur-sm" />
                <div className="w-10 h-10 rounded-full bg-amber-500/80 backdrop-blur-sm" />
              </div>
            </div>

            {/* Frozen Overlay */}
            <AnimatePresence>
              {card.status === 'frozen' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] rounded-[2.5rem] flex flex-col items-center justify-center z-10 border-2 border-rose-500/50"
                >
                  <motion.div 
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-2xl mb-2"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </motion.div>
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Vault Locked</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Back of Card (Details) */}
          <div 
            className={`absolute inset-0 w-full h-full bg-slate-900 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-2xl border border-slate-700`}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="h-12 w-full bg-slate-950 -mx-8 mt-2 shadow-inner" />
            
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="space-y-1">
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Security CVV</p>
                <p className="text-white font-mono text-lg tracking-widest">492</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Authorized Signature</p>
                <p className="text-blue-400 italic font-medium text-xs truncate max-w-[120px]">{user.name}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[7px] text-slate-600 leading-tight">
                This card is property of Aura. 24/7 Support: aurafinancialcustomercare@gmail.com. Subject to account agreement.
              </p>
              <div className="flex justify-center">
                <div className="px-4 py-1 bg-slate-800 rounded-full border border-slate-700">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Aura Node V4.1</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex space-x-3">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex-1 py-4 bg-slate-900 border border-slate-800 rounded-[1.5rem] text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          <span>{isFlipped ? 'Show Face' : 'Card Details'}</span>
        </motion.button>
        
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleStatus}
          disabled={isProcessing}
          className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-2 border ${
            card.status === 'active' 
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20' 
              : 'bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20'
          }`}
        >
          {isProcessing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <>
              {card.status === 'active' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              )}
              <span>{card.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

const Cards: React.FC = () => {
  const { cards, createCard } = useFinancial();
  const [isIssuing, setIsIssuing] = useState(false);
  const [issuingStep, setIssuingStep] = useState(0);

  const handleIssueNode = () => {
    setIsIssuing(true);
    setIssuingStep(0);
    
    // Multi-stage animation for issuance
    const stages = ["Establishing Secure Tunnel", "Generating Cryptographic Keys", "Synchronizing Ledger Nodes", "Issuance Confirmed"];
    
    let currentStage = 0;
    const interval = setInterval(() => {
      currentStage++;
      if (currentStage < stages.length) {
        setIssuingStep(currentStage);
      } else {
        clearInterval(interval);
        createCard();
        setIsIssuing(false);
      }
    }, 800);
  };

  const issuingStages = ["Establishing Tunnel", "Generating Keys", "Syncing Ledger", "Success"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-32"
    >
      <div className="flex flex-col space-y-1">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Active Issuance</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Payment Network Status: Operational</p>
      </div>

      <div className="space-y-10">
        <AnimatePresence mode="popLayout">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </AnimatePresence>
      </div>

      <motion.button 
        disabled={isIssuing}
        whileHover={{ scale: isIssuing ? 1 : 1.02, backgroundColor: isIssuing ? '#1e293b' : '#2563eb' }}
        whileTap={{ scale: isIssuing ? 1 : 0.98 }}
        onClick={handleIssueNode}
        className={`w-full py-5 rounded-[1.5rem] font-black shadow-2xl transition-all duration-300 text-xs uppercase tracking-widest flex items-center justify-center space-x-3 border ${
          isIssuing 
          ? 'bg-slate-900 border-slate-800 text-blue-400' 
          : 'bg-blue-600 text-white border-blue-400 shadow-blue-500/30'
        }`}
      >
        {isIssuing ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
            <AnimatePresence mode="wait">
              <motion.span
                key={issuingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {issuingStages[issuingStep]}
              </motion.span>
            </AnimatePresence>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            <span>Issue Virtual Node</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default Cards;
