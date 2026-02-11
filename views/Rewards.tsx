
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinancial } from '../context/FinancialContext';
import { generateNewDeals } from '../services/geminiService';
import { Reward } from '../types';

const Rewards: React.FC = () => {
  const { user, rewards, claimReward, addNewRewards } = useFinancial();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const filteredRewards = useMemo(() => {
    return rewards.filter(r => 
      r.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.deal.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rewards, searchTerm]);

  const handleDiscoverDeals = async () => {
    setIsDiscovering(true);
    const newDeals = await generateNewDeals();
    if (newDeals && newDeals.length > 0) {
      addNewRewards(newDeals);
    }
    setIsDiscovering(false);
  };

  const handleClaim = (reward: Reward) => {
    if (reward.claimed || user.rewardPoints < reward.cost) return;
    
    setClaimingId(reward.id);
    setTimeout(() => {
      claimReward(reward.id);
      setClaimingId(null);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-32"
    >
      {/* Points Card */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Global Reward Balance</p>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-4xl font-black text-white tracking-tighter">
              {user.rewardPoints.toLocaleString()}
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Points</span>
          </div>
          <p className="text-blue-400 text-[10px] mt-2 font-black uppercase tracking-widest">
            ≈ ${(user.rewardPoints / 100).toFixed(2)} Liquid Value
          </p>
        </div>
        
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="w-32 h-32 border border-blue-500/10 rounded-full flex items-center justify-center"
          >
             <svg className="w-12 h-12 text-blue-500/20" fill="currentColor" viewBox="0 0 20 20">
               <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13 16v-1a1 1 0 112 0v1a1 1 0 11-2 0z" />
             </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Search & Discovery */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search active deals..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-xs text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner"
            />
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleDiscoverDeals}
            disabled={isDiscovering}
            className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-400 hover:bg-blue-600/20 transition-all flex items-center justify-center"
          >
            {isDiscovering ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.477 2.387a2 2 0 001.414 1.96l2.387.477a2 2 0 001.96-1.414l.477-2.387a2 2 0 00-1.414-1.96l-2.387-.477z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 9a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </motion.button>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-sm uppercase tracking-[0.2em] text-slate-500">Curated Opportunities</h3>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{filteredRewards.length} Active Node(s)</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredRewards.map((reward, idx) => (
              <motion.div 
                key={reward.id} 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] flex items-center justify-between group transition-all hover:border-blue-500/20 shadow-xl"
              >
                <div className="flex items-center space-x-5">
                  <div className={`w-14 h-14 ${reward.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/5`}>
                    {reward.logo}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm uppercase tracking-tight">{reward.brand}</h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 max-w-[140px] leading-tight uppercase tracking-widest">
                      {reward.deal}
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-black text-white">{reward.cost}</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase">PTS</span>
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClaim(reward)}
                    disabled={reward.claimed || user.rewardPoints < reward.cost || !!claimingId}
                    className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      reward.claimed
                        ? 'bg-slate-800 text-slate-600 cursor-default'
                        : user.rewardPoints < reward.cost
                        ? 'bg-slate-800/50 text-slate-700 cursor-not-allowed border border-slate-800'
                        : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500'
                    }`}
                  >
                    {claimingId === reward.id ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />
                    ) : reward.claimed ? (
                      'CLAIMED'
                    ) : (
                      'REDEEM'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredRewards.length === 0 && (
            <div className="text-center py-20 bg-slate-900/30 rounded-[2rem] border border-dashed border-slate-800">
               <p className="text-slate-500 text-xs font-black uppercase tracking-widest">No matching signals found</p>
               <button onClick={() => setSearchTerm('')} className="mt-4 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Clear Filter</button>
            </div>
          )}
        </div>
      </section>

      {/* Referral Section */}
      <motion.section 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }}
        className="pt-4"
      >
        <div className="p-8 bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-slate-800 rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-20 h-20 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
          <div className="relative z-10">
            <h4 className="font-black text-white text-sm uppercase tracking-[0.2em] mb-1">Referral Node</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              Earn 5,000 PTS for every verified <br/> node connection.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          </motion.button>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Rewards;
