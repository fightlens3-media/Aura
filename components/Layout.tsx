
import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFinancial } from '../context/FinancialContext.tsx';

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className="flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-colors"
    >
      <motion.div
        animate={{ 
          scale: isActive ? 1.2 : 1,
          color: isActive ? '#3b82f6' : '#94a3b8' 
        }}
        className="z-10"
      >
        {icon}
      </motion.div>
      <motion.span 
        animate={{ 
          opacity: isActive ? 1 : 0.6,
          y: isActive ? 0 : 2
        }}
        className={`text-[10px] font-medium z-10 ${isActive ? 'text-blue-500' : 'text-slate-400'}`}
      >
        {label}
      </motion.span>
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute inset-0 bg-blue-500/10 rounded-2xl"
          transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
        />
      )}
    </NavLink>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useFinancial();
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  // If user data hasn't loaded or isn't available, render children minimally to avoid crashes
  if (!user) {
    return <div className="min-h-screen bg-slate-950 max-w-md mx-auto relative overflow-hidden shadow-2xl border-x border-slate-900">{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 max-w-md mx-auto relative overflow-hidden shadow-2xl border-x border-slate-900">
      {/* Header */}
      {!isProfilePage && (
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">A</div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Aura</h1>
            </Link>
          </motion.div>
          <Link to="/profile">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-700 hover:border-blue-500 transition-colors"
            >
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            </motion.div>
          </Link>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${isProfilePage ? 'pb-0' : 'pb-24'} px-6 py-4 overflow-x-hidden`}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {!isProfilePage && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 h-20 flex items-center justify-around px-2 z-50">
          <NavItem 
            to="/" 
            label="Home"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          />
          <NavItem 
            to="/wallets" 
            label="Wallets"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <NavItem 
            to="/invest" 
            label="Invest"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
          />
          <NavItem 
            to="/cards" 
            label="Cards"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
          <NavItem 
            to="/rewards" 
            label="Rewards"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>}
          />
        </nav>
      )}
    </div>
  );
};

export default Layout;
