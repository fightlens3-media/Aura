
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FAQS } from '../constants';

interface Message {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  timestamp: string;
}

const Support: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const stepsText = ["Initializing Secure Handshake", "Bypassing Proxy Nodes", "Verifying Protocol V4.1", "Connecting to Customer Care Node..."];

  useEffect(() => {
    if (showChat && messages.length === 0) {
      const timer = setTimeout(() => {
        const welcomeMessage: Message = {
          id: 'welcome',
          sender: 'agent',
          text: "Aura System: Customer Care Node [ID-992] ACTIVE. \n\nTargeting Request: Technical Audit / Ledger Inquiry. \n\nInstruction: Provide Node Identifier or query immediately. No human emotional markers accepted. Awaiting data packets.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([welcomeMessage]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showChat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConnectAgent = () => {
    setIsConnecting(true);
    setConnectionStep(0);
    
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < stepsText.length) {
        setConnectionStep(current);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsConnecting(false);
          setShowChat(true);
        }, 800);
      }
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    // Simple robotic echo for the support view (non-AI side)
    setTimeout(() => {
      const roboticResponse: Message = {
        id: Date.now().toString() + "-robot",
        sender: 'agent',
        text: "Data packet received. Status: Processing. Refer to Global System Intel for primary logic matches.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, roboticResponse]);
    }, 1000);
  };

  if (showChat) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-slate-950 flex flex-col max-w-md mx-auto border-x border-slate-900"
      >
        {/* Chat Header */}
        <div className="p-6 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowChat(false)} className="text-slate-500 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="relative">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs">992</div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">Customer Care Node 992</h3>
              <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Aura Verified Node</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-[1.5rem] p-4 text-xs leading-relaxed ${
                msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none shadow-xl'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-[8px] font-black uppercase mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-6 bg-slate-950 border-t border-slate-900">
          <div className="flex space-x-3">
            <input 
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Transmit technical data..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-xs text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </motion.button>
          </div>
          <p className="text-center text-[8px] text-slate-700 font-black uppercase tracking-widest mt-4">End-to-End Encryption: VERIFIED (V4.1)</p>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-20 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-xl py-4 z-20 border-b border-slate-900/50">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </motion.button>
        <h2 className="text-lg font-black tracking-tight text-white uppercase">Customer Care</h2>
        <div className="w-12" />
      </div>

      {/* Hero Action */}
      <section className="px-1">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
             <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Customer Care Node</h3>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest leading-relaxed mb-6">
              Establish secure bridge to <br/> Aura Superior Care Node.
            </p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnectAgent}
              disabled={isConnecting}
              className="w-full py-4 bg-white rounded-2xl text-blue-600 font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center space-x-3"
            >
              {isConnecting ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                  <span className="text-[10px]">{stepsText[connectionStep]}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  <span>Request Node Override</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </section>

      {/* Quick Channels */}
      <div className="px-1">
        <motion.div whileTap={{ scale: 0.98 }} className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 cursor-pointer hover:border-blue-500/30 transition-all shadow-xl">
          <div className="w-16 h-16 bg-purple-500/10 rounded-[1.5rem] flex items-center justify-center text-purple-500 border border-purple-500/20 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Customer Care Node</span>
          <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
             <p className="text-[10px] text-blue-400 font-mono tracking-tighter">aurafinancialcustomercare@gmail.com</p>
          </div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Global Dispatch Protocol</p>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <section className="space-y-4 px-1">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Global System Intel (FAQ)</h3>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <span className="text-[11px] font-black text-slate-300 uppercase tracking-tight">{faq.q}</span>
                <motion.div animate={{ rotate: activeFaq === i ? 180 : 0 }}>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </motion.div>
              </button>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed border-t border-slate-800 pt-3">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Message */}
      <div className="text-center pt-4">
        <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.4em] leading-loose">
          Customer Care Infrastructure V4.1 <br/> All data packets are E2E verified.
        </p>
      </div>
    </motion.div>
  );
};

export default Support;
