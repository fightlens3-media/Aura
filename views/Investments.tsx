
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Investment } from '../types';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { getAssetAnalysis } from '../services/geminiService';
import { useFinancial } from '../context/FinancialContext';

const chartData = [
  { name: 'Jan', value: 12000 },
  { name: 'Feb', value: 15000 },
  { name: 'Mar', value: 14000 },
  { name: 'Apr', value: 18000 },
  { name: 'May', value: 25700 },
];

const generateSimulatedHistory = () => {
  const data = [];
  let current = 100 + Math.random() * 50;
  for (let i = 0; i < 20; i++) {
    current += (Math.random() - 0.45) * 10;
    data.push({ time: i, price: current });
  }
  return data;
};

const AssetDetail = ({ asset, onClose }: { asset: Investment; onClose: () => void }) => {
  const { buyAsset, sellAsset, wallets } = useFinancial();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [history] = useState(generateSimulatedHistory());
  
  // Buy/Sell UI State
  const [actionType, setActionType] = useState<'buy' | 'sell' | null>(null);
  const [amount, setAmount] = useState('0');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const usdBalance = wallets.find(w => w.id === 'usd-wallet')?.balance || 0;
  const currentPrice = asset.currentValue / asset.holdings;

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoadingAnalysis(true);
      const res = await getAssetAnalysis(asset.symbol, asset.name, asset.type);
      setAnalysis(res || "Analysis unavailable.");
      setLoadingAnalysis(false);
    };
    fetchAnalysis();
  }, [asset]);

  const handleKeyPress = (val: string) => {
    if (val === 'C') {
      setAmount('0');
    } else if (val === '⌫') {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setAmount(prev => prev === '0' ? val : prev + val);
    }
  };

  const handleExecuteAction = () => {
    const numAmount = parseFloat(amount);
    if (numAmount <= 0) return;

    setStatus('processing');
    
    setTimeout(() => {
      if (actionType === 'buy') {
        buyAsset(asset.id, numAmount);
      } else {
        sellAsset(asset.id, numAmount);
      }
      setStatus('success');
      
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-0 z-[60] bg-slate-950 flex flex-col"
    >
      <div className="flex items-center justify-between p-6 border-b border-slate-900 sticky top-0 bg-slate-950/80 backdrop-blur-md z-10">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </motion.button>
        <div className="text-center">
          <h3 className="font-black text-white uppercase tracking-tight">{asset.name}</h3>
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{asset.symbol} • {asset.type}</p>
        </div>
        <div className="w-11" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        {status === 'idle' && !actionType && (
          <>
            {/* Real-time Price Header */}
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Market Price</p>
              <h2 className="text-5xl font-black text-white tracking-tighter">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <div className={`text-sm font-bold ${asset.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {asset.change24h >= 0 ? '▲' : '▼'} {Math.abs(asset.change24h)}% (24h)
              </div>
            </div>

            {/* Detailed Chart */}
            <div className="h-64 w-full bg-slate-900/50 rounded-3xl p-4 border border-slate-800 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={asset.change24h >= 0 ? "#10b981" : "#f43f5e"} 
                    strokeWidth={3} 
                    dot={false}
                    animationDuration={1500}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                    itemStyle={{ color: '#f8fafc' }}
                    labelStyle={{ display: 'none' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-900 rounded-[1.5rem] border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Holdings</p>
                <p className="text-lg font-black text-white">{asset.holdings.toFixed(4)} {asset.symbol}</p>
                <p className="text-[10px] text-slate-600 font-bold mt-1">Value: ${asset.currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
              <div className="p-5 bg-slate-900 rounded-[1.5rem] border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Market Cap</p>
                <p className="text-lg font-black text-white">$1.24T</p>
                <p className="text-[10px] text-slate-600 font-bold mt-1">Global Rank: #1</p>
              </div>
            </div>

            {/* ProBot Analysis */}
            <div className="bg-blue-600/5 border border-blue-500/20 rounded-[2rem] p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <h4 className="font-black text-white uppercase tracking-tight text-sm">ProBot Deep Dive</h4>
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">AI Financial Researcher</p>
                </div>
              </div>
              
              <div className="text-sm text-slate-300 leading-relaxed max-w-none">
                {loadingAnalysis ? (
                  <div className="flex flex-col space-y-3 py-4">
                    <div className="h-4 bg-slate-800 rounded-full w-3/4 animate-pulse" />
                    <div className="h-4 bg-slate-800 rounded-full w-full animate-pulse" />
                    <div className="h-4 bg-slate-800 rounded-full w-2/3 animate-pulse" />
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{analysis}</div>
                )}
              </div>
            </div>
          </>
        )}

        {(actionType && status === 'idle') && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 pt-10"
          >
            <div className="text-center py-6 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                {actionType === 'buy' ? 'Purchasing Amount (USD)' : 'Selling Amount (USD)'}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-5xl font-black text-white tracking-tighter">
                  $<span className="text-blue-500">{amount}</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-600 mt-2 font-bold uppercase tracking-widest">
                ≈ {(parseFloat(amount) / currentPrice).toFixed(6)} {asset.symbol}
              </p>
              {actionType === 'buy' && (
                <p className="text-[9px] text-slate-700 mt-1 uppercase tracking-widest">Balance: ${usdBalance.toLocaleString()}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 px-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                <motion.button 
                  key={k} 
                  whileTap={{ scale: 0.9 }} 
                  onClick={() => handleKeyPress(k)} 
                  className="h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-xl font-black text-slate-200 hover:bg-slate-800 transition-colors border border-slate-800/50"
                >
                  {k}
                </motion.button>
              ))}
            </div>

            <div className="flex space-x-4 pt-4">
               <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setActionType(null)}
                className="flex-1 py-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] text-slate-400 font-black uppercase tracking-widest text-[10px]"
              >
                Back
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleExecuteAction}
                disabled={amount === '0' || (actionType === 'buy' && parseFloat(amount) > usdBalance)}
                className={`flex-1 py-5 rounded-[1.5rem] text-white font-black uppercase tracking-widest text-[10px] shadow-2xl ${
                  actionType === 'buy' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-rose-600 shadow-rose-600/20'
                } disabled:opacity-50`}
              >
                Confirm {actionType.toUpperCase()}
              </motion.button>
            </div>
          </motion.div>
        )}

        {status === 'processing' && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-24 h-24 border-4 border-t-blue-500 border-r-transparent border-b-slate-800 border-l-transparent rounded-full mb-8"
             />
             <h3 className="text-2xl font-black text-white uppercase tracking-tight">Syncing Transaction...</h3>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Securing Ledger Assets</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-2xl shadow-emerald-500/30"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
            </motion.div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Position Updated</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Vault Successfully Synchronized</p>
          </div>
        )}
      </div>

      {/* Action Bar (Only visible in idle state) */}
      {!actionType && status === 'idle' && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/90 backdrop-blur-xl border-t border-slate-900 flex space-x-4 z-20">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setActionType('buy')}
            className="flex-1 py-5 bg-emerald-600 rounded-[1.5rem] text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-600/20"
          >
            Buy Asset
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setActionType('sell')}
            className="flex-1 py-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] text-slate-400 font-black uppercase tracking-widest text-xs"
          >
            Sell
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

const Investments: React.FC = () => {
  const { investments } = useFinancial();
  const [range, setRange] = useState('1M');
  const [selectedAsset, setSelectedAsset] = useState<Investment | null>(null);

  const totalPortfolioValue = investments.reduce((acc, i) => acc + i.currentValue, 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {selectedAsset && (
          <AssetDetail 
            asset={investments.find(i => i.id === selectedAsset.id) || selectedAsset} 
            onClose={() => setSelectedAsset(null)} 
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end px-1">
        <motion.div initial={{ x: -20 }} animate={{ x: 0 }}>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Consolidated Portfolio</p>
          <h2 className="text-4xl font-black text-white tracking-tighter">${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">+12.4% Performance Index</span>
        </motion.div>
        <div className="flex space-x-2">
          {['1D', '1M', '1Y'].map((r) => (
            <motion.button 
              key={r}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRange(r)}
              className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest ${
                range === r ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {r}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="h-64 w-full bg-slate-900 rounded-[2.5rem] p-6 border border-slate-800 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={9} axisLine={false} tickLine={false} tick={{ fontWeight: 'bold' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
              itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="space-y-4">
        <h3 className="font-black text-sm text-slate-500 uppercase tracking-[0.2em] px-1">My Global Positions</h3>
        {investments.map((asset, idx) => (
          <motion.div 
            key={asset.id} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ x: 5, backgroundColor: 'rgba(30, 41, 59, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedAsset(asset)}
            className="p-5 bg-slate-900/30 border border-slate-900/50 rounded-[2rem] flex items-center justify-between cursor-pointer group transition-all hover:border-blue-500/20 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-12 h-12 bg-slate-800/80 rounded-[1.25rem] flex items-center justify-center font-black text-blue-500 group-hover:bg-blue-600 group-hover:text-white border border-slate-700/50 transition-colors"
              >
                {asset.symbol[0]}
              </motion.div>
              <div>
                <h4 className="font-black text-white text-sm tracking-tight">{asset.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                  {asset.holdings.toFixed(2)} {asset.symbol} • {asset.type}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-white text-sm tracking-tight">${asset.currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <div className={`flex items-center justify-end space-x-1 text-[10px] font-black uppercase mt-0.5 ${asset.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                <span>{asset.change24h >= 0 ? '+' : ''}{asset.change24h}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="py-12" />
    </motion.div>
  );
};

export default Investments;
