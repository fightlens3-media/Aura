
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_ICONS, MOCK_INVESTMENTS } from '../constants';
import { getFinancialInsight } from '../services/geminiService';
import { Currency, Transaction, Wallet } from '../types';
import { useFinancial } from '../context/FinancialContext';
import AddMoneyModal from '../components/AddMoneyModal';
import SendMoneyModal from '../components/SendMoneyModal';
import TransactionReceiptModal from '../components/TransactionReceiptModal';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const WalletCard = ({ wallet, onClick }: { wallet: Wallet; onClick: () => void }) => {
  const nameMap: Record<string, string> = {
    'usd-wallet': 'USD Wallet',
    'gbp-wallet': 'Pounds Wallet',
    'crypto-wallet': 'Crypto Wallet'
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${wallet.color} p-5 rounded-[2rem] shadow-xl flex flex-col justify-between cursor-pointer min-w-[200px] flex-shrink-0 relative overflow-hidden group`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <span className="text-xl font-bold text-white">{wallet.symbol}</span>
          </div>
          <svg className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">
            {nameMap[wallet.id] || wallet.currency}
          </p>
          <h3 className="text-2xl font-black text-white tracking-tighter">
            {wallet.symbol}{wallet.balance.toLocaleString(undefined, { minimumFractionDigits: wallet.currency === Currency.BTC ? 4 : 2 })}
          </h3>
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
    </motion.div>
  );
};

const Home: React.FC = () => {
  const { wallets, transactions } = useFinancial();
  const navigate = useNavigate();
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const fetchInsight = async () => {
    setLoadingInsight(true);
    const text = await getFinancialInsight(transactions, MOCK_INVESTMENTS);
    setInsight(text);
    setLoadingInsight(false);
  };

  const currencySymbols: Record<Currency, string> = {
    [Currency.USD]: '$',
    [Currency.EUR]: '€',
    [Currency.GBP]: '£',
    [Currency.BTC]: '₿',
    [Currency.ETH]: 'Ξ',
  };

  const handleTransactionClick = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setIsReceiptOpen(true);
  };

  const handleWalletClick = (id: string) => {
    // Navigate to wallets view which shows the details
    navigate('/wallets');
  };

  const displayedTransactions = showAllTransactions ? transactions : transactions.slice(0, 5);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <AddMoneyModal isOpen={isAddMoneyOpen} onClose={() => setIsAddMoneyOpen(false)} />
      <SendMoneyModal isOpen={isSendMoneyOpen} onClose={() => setIsSendMoneyOpen(false)} currentCurrency={Currency.USD} />
      
      <TransactionReceiptModal 
        isOpen={isReceiptOpen} 
        onClose={() => setIsReceiptOpen(false)} 
        transaction={selectedTransaction} 
      />

      {/* Hero Wallets Section */}
      <motion.section variants={itemVariants} className="relative">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">My Global Vaults</h3>
          <div className="flex space-x-2">
             <motion.button onClick={() => setIsAddMoneyOpen(true)} whileTap={{ scale: 0.9 }} className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
             </motion.button>
             <motion.button onClick={() => setIsSendMoneyOpen(true)} whileTap={{ scale: 0.9 }} className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
             </motion.button>
          </div>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 snap-x">
          {wallets.map(wallet => (
            <div key={wallet.id} className="snap-center">
              <WalletCard 
                wallet={wallet} 
                onClick={() => handleWalletClick(wallet.id)} 
              />
            </div>
          ))}
        </div>
      </motion.section>

      {/* AI Insights Section */}
      <motion.section variants={itemVariants} className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
           <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-[1.25rem] flex items-center justify-center text-blue-500 border border-blue-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-black text-white uppercase tracking-wider text-sm">Vault Analytics</h3>
          </div>
          <AnimatePresence mode="wait">
            {!insight && (
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={fetchInsight}
                disabled={loadingInsight}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 uppercase tracking-widest"
              >
                {loadingInsight ? 'Synchronizing...' : 'Sync Insight'}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        <AnimatePresence mode="wait">
          {insight ? (
            <motion.div 
              key="insight-text"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap overflow-hidden"
            >
              {insight}
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setInsight(null)} 
                className="block mt-4 text-[10px] text-blue-500 font-black uppercase tracking-widest hover:underline"
              >
                Refresh analysis
              </motion.button>
            </motion.div>
          ) : (
            <motion.p 
              key="insight-placeholder"
              className="text-xs text-slate-500 font-medium italic opacity-60"
            >
              Tap Sync Insight to generate encrypted financial projections based on your vault activity.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Recent Transactions */}
      <motion.section variants={itemVariants} layout className="pb-8">
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="font-black text-sm text-slate-500 uppercase tracking-[0.2em]">Live Ledger</h3>
          {transactions.length > 5 && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className="text-[10px] font-black text-blue-500 uppercase tracking-widest"
            >
              {showAllTransactions ? 'Minimize' : 'Expand All'}
            </motion.button>
          )}
        </div>
        <motion.div className="space-y-4" layout>
          <AnimatePresence mode="popLayout">
            {displayedTransactions.map((tx) => (
              <motion.div 
                key={tx.id} 
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ x: 5, backgroundColor: 'rgba(30, 41, 59, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTransactionClick(tx)}
                className="flex items-center justify-between p-4 bg-slate-900/30 rounded-[1.5rem] border border-slate-900/50 hover:border-blue-500/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-800/80 rounded-[1rem] flex items-center justify-center text-slate-400 group-hover:text-blue-400 border border-slate-700/50 transition-colors">
                    {CATEGORY_ICONS[tx.category] || CATEGORY_ICONS['Transfer']}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm tracking-tight">{tx.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm tracking-tighter ${tx.type === 'debit' ? 'text-white' : 'text-emerald-500'}`}>
                    {tx.type === 'debit' ? '-' : '+'}{currencySymbols[tx.currency] || '$'}{Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.1em] mt-0.5">{tx.category}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.section>

      {/* Quick Support Link */}
      <motion.button 
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/support')}
        className="fixed bottom-40 right-6 w-12 h-12 bg-slate-800/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-slate-400 border border-slate-700 z-40"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      </motion.button>
    </motion.div>
  );
};

export default Home;
