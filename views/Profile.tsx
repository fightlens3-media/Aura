
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFinancial } from '../context/FinancialContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

const Profile: React.FC = () => {
  const { user } = useFinancial();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showSensitive, setShowSensitive] = useState(false);

  if (!user) return null;

  const DataItem = ({ label, value, sensitive = false }: { label: string, value: string | undefined, sensitive?: boolean }) => (
    <div className="p-6 bg-[#0f172a] border border-slate-800/60 rounded-[2rem] relative overflow-hidden group shadow-lg">
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">{label}</p>
      <div className="flex items-center justify-between">
        <p className={`text-[15px] font-black text-white tracking-tight ${sensitive && !showSensitive ? 'blur-lg select-none' : ''}`}>
          {value || 'DATA UNAVAILABLE'}
        </p>
        {sensitive && !showSensitive && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">TAP GLOBAL UNLOCK</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-32">
      {/* Profile Header */}
      <div className="flex items-center justify-between sticky top-0 bg-[#020617]/80 backdrop-blur-xl py-6 z-20 border-b border-slate-900/50">
        <button onClick={() => navigate('/')} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 active:scale-95 transition-transform">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-xl font-black tracking-tighter text-white uppercase italic">Private Vault</h2>
        <button 
          onClick={() => setShowSensitive(!showSensitive)} 
          className={`p-4 border rounded-2xl transition-all active:scale-95 ${showSensitive ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </button>
      </div>

      {/* Identity Summary */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute -inset-4 border border-dashed border-blue-500/20 rounded-full" 
          />
          <div className="w-36 h-36 rounded-[3rem] overflow-hidden border-4 border-[#0f172a] shadow-2xl relative z-10">
            <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
          </div>
        </div>
        <h3 className="text-4xl font-black text-white tracking-tighter mt-8">{user.name}</h3>
        <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.5em] mt-3 italic">Master Node Profile</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-2 gap-4">
           <DataItem label="Terminal Handle" value={user.username} />
           <DataItem label="Access Class" value="LEVEL 4 PRIVATE" />
        </div>
        
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Authorized Registry</h4>
          <DataItem label="Digital Identifier" value={user.email} />
          <DataItem label="Secure Comms" value={user.phone} />
          <DataItem label="Geospatial Hub" value={user.address} />
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Encryption Keys</h4>
          <div className="grid grid-cols-2 gap-4">
            <DataItem label="Social Index" value={user.ssn} sensitive />
            <DataItem label="Maternal ID" value={user.maidenName} sensitive />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DataItem label="Origin Date" value={user.birthday} />
            <DataItem label="Maturity Cycle" value={user.age} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DataItem label="Astro Vector" value={user.zodiac} />
            <DataItem label="Grid Coordinates" value={user.geo} sensitive />
          </div>
        </div>
      </div>

      <div className="pt-10">
        <button 
          onClick={() => { logout(); navigate('/auth'); }} 
          className="w-full py-6 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-500/10 transition-all flex items-center justify-center space-x-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span>Purge Session Data</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Profile;
