
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import Home from './views/Home.tsx';
import Wallets from './views/Wallets.tsx';
import Investments from './views/Investments.tsx';
import Cards from './views/Cards.tsx';
import Rewards from './views/Rewards.tsx';
import ReceiptDetail from './views/ReceiptDetail.tsx';
import Profile from './views/Profile.tsx';
import Support from './views/Support.tsx';
import Auth from './views/Auth.tsx';
import { FinancialProvider } from './context/FinancialContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  );
  
  if (!currentUser) return <Navigate to="/auth" />;
  
  return <>{children}</>;
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Standalone views that shouldn't show the standard Layout
  const isReceiptView = location.pathname.startsWith('/receipt/');
  const isAuthView = location.pathname === '/auth';

  const routes = (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={
          <ProtectedRoute>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Home />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/wallets" element={
          <ProtectedRoute>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Wallets />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/invest" element={
          <ProtectedRoute>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Investments />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/cards" element={
          <ProtectedRoute>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Cards />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/rewards" element={
          <ProtectedRoute>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Rewards />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <Profile />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/support" element={
          <ProtectedRoute>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <Support />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/receipt/:encodedData" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ReceiptDetail />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );

  // If we are on an auth/receipt view OR there is no user logged in, 
  // don't wrap with Layout (which depends on the user object)
  if (isReceiptView || isAuthView || !currentUser) return routes;

  return (
    <Layout>
      {routes}
      <AIAssistant />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FinancialProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </FinancialProvider>
    </AuthProvider>
  );
};

export default App;
