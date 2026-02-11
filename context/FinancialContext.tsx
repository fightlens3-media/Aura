
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Wallet, Transaction, Currency, User, Investment, Card, Reward, UserDataStore } from '../types.ts';
import { MOCK_WALLETS, MOCK_TRANSACTIONS, MOCK_INVESTMENTS, MOCK_CARDS } from '../constants.tsx';
import { useAuth } from './AuthContext.tsx';

interface FinancialContextType {
  user: User | null;
  wallets: Wallet[];
  transactions: Transaction[];
  investments: Investment[];
  cards: Card[];
  rewards: Reward[];
  addMoney: (amount: number, method: string) => void;
  sendMoney: (amount: number, method: string, currency: Currency, narrative?: string) => void;
  buyAsset: (assetId: string, usdAmount: number) => void;
  sellAsset: (assetId: string, usdAmount: number) => void;
  toggleCardStatus: (cardId: string) => void;
  createCard: () => void;
  claimReward: (rewardId: string) => boolean;
  addNewRewards: (newRewards: any[]) => void;
  updateWallets: (updatedWallets: Wallet[]) => void;
  updateUser: (updates: Partial<User>) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const INITIAL_REWARDS: Reward[] = [
  { id: 'r1', brand: 'Apple', deal: '5% Cashback on Macs', logo: '🍎', color: 'bg-slate-800', cost: 2500, claimed: false },
  { id: 'r2', brand: 'Airbnb', deal: 'Up to 10% back on bookings', logo: '🏠', color: 'bg-rose-500', cost: 1200, claimed: false },
  { id: 'r3', brand: 'Uber', deal: 'Free delivery for 3 months', logo: '🚗', color: 'bg-black', cost: 800, claimed: false },
  { id: 'r4', brand: 'Amazon', deal: '2% back on all orders', logo: '📦', color: 'bg-orange-400', cost: 500, claimed: false },
  { id: 'r5', brand: 'Spotify', deal: '6 months Premium Free', logo: '🎵', color: 'bg-emerald-500', cost: 1500, claimed: false },
];

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, updateUser: authUpdateUser } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);

  // Load User Specific Data reliably using email as a secondary key for lookup
  useEffect(() => {
    if (!currentUser) return;

    const storageKey = `aura_data_${currentUser.email.toLowerCase()}`;
    const cloudData = localStorage.getItem(storageKey);
    
    if (cloudData) {
      const parsed: UserDataStore = JSON.parse(cloudData);
      setWallets(parsed.wallets || []);
      setTransactions(parsed.transactions || []);
      setInvestments(parsed.investments || []);
      setCards(parsed.cards || []);
      setRewards(parsed.rewards || INITIAL_REWARDS);
    } else {
      // Seed data for the master identity
      if (currentUser.id === 'master-robert') {
        setWallets(MOCK_WALLETS);
        setTransactions(MOCK_TRANSACTIONS);
        setInvestments(MOCK_INVESTMENTS);
        setCards(MOCK_CARDS);
        setRewards(INITIAL_REWARDS);
      } else {
        // Fallback for any other identity
        setWallets([
          { id: 'usd-wallet', currency: Currency.USD, balance: 2500, symbol: '$', color: 'bg-blue-600' },
          { id: 'gbp-wallet', currency: Currency.GBP, balance: 100, symbol: '£', color: 'bg-purple-600' },
          { id: 'crypto-wallet', currency: Currency.BTC, balance: 0, symbol: '₿', color: 'bg-orange-500' },
        ]);
        setTransactions([]);
        setInvestments(MOCK_INVESTMENTS.map(i => ({ ...i, holdings: 0, currentValue: 0 })));
        setCards([]);
        setRewards(INITIAL_REWARDS);
      }
    }
  }, [currentUser]);

  // Save to LocalStorage on every change
  useEffect(() => {
    if (!currentUser || wallets.length === 0) return;
    
    const dataToSave: UserDataStore = {
      user: currentUser,
      wallets,
      transactions,
      investments,
      cards,
      rewards
    };
    localStorage.setItem(`aura_data_${currentUser.email.toLowerCase()}`, JSON.stringify(dataToSave));
  }, [wallets, transactions, investments, cards, rewards, currentUser]);

  const addMoney = (amount: number, method: string) => {
    setWallets(prev => prev.map(w => 
      w.currency === Currency.USD 
        ? { ...w, balance: w.balance + amount }
        : w
    ));

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Deposit via ${method}`,
      amount: amount,
      currency: Currency.USD,
      date: new Date().toISOString().split('T')[0],
      category: 'Transfer',
      type: 'credit'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const sendMoney = (amount: number, method: string, currency: Currency, narrative?: string) => {
    setWallets(prev => prev.map(w => 
      w.currency === currency 
        ? { ...w, balance: Math.max(0, w.balance - amount) }
        : w
    ));

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Sent via ${method}`,
      amount: -amount,
      currency: currency,
      date: new Date().toISOString().split('T')[0],
      category: 'Transfer',
      type: 'debit',
      narrative: narrative
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const buyAsset = (assetId: string, usdAmount: number) => {
    const asset = investments.find(i => i.id === assetId);
    if (!asset) return;
    const price = 150 + Math.random() * 50; 
    const unitsBought = usdAmount / price;
    setWallets(prev => prev.map(w => w.currency === Currency.USD ? { ...w, balance: w.balance - usdAmount } : w));
    setInvestments(prev => prev.map(i => i.id === assetId ? { ...i, holdings: i.holdings + unitsBought, currentValue: i.currentValue + usdAmount } : i));
  };

  const sellAsset = (assetId: string, usdAmount: number) => {
    const asset = investments.find(i => i.id === assetId);
    if (!asset) return;
    const price = 150 + Math.random() * 50;
    const unitsSold = usdAmount / price;
    setWallets(prev => prev.map(w => w.currency === Currency.USD ? { ...w, balance: w.balance + usdAmount } : w));
    setInvestments(prev => prev.map(i => i.id === assetId ? { ...i, holdings: Math.max(0, i.holdings - unitsSold), currentValue: Math.max(0, i.currentValue - usdAmount) } : i));
  };

  const toggleCardStatus = (cardId: string) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, status: c.status === 'active' ? 'frozen' : 'active' } : c));
  };

  const createCard = () => {
    const randomNum = () => Math.floor(1000 + Math.random() * 9000).toString();
    const fullNum = `${randomNum()} ${randomNum()} ${randomNum()} ${randomNum()}`;
    const newCard: Card = {
      id: Math.random().toString(36).substr(2, 9),
      cardNumber: fullNum,
      lastFour: fullNum.slice(-4),
      expiry: '05/29',
      type: 'Virtual',
      status: 'active',
      color: 'from-blue-500 to-indigo-600'
    };
    setCards(prev => [...prev, newCard]);
  };

  const claimReward = (rewardId: string): boolean => {
    if (!currentUser) return false;
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && !reward.claimed && currentUser.rewardPoints >= reward.cost) {
      setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, claimed: true } : r));
      authUpdateUser({ rewardPoints: currentUser.rewardPoints - reward.cost });
      return true;
    }
    return false;
  };

  const addNewRewards = (newDeals: any[]) => {
    const formatted = newDeals.map(d => ({
      ...d,
      id: Math.random().toString(36).substr(2, 9),
      claimed: false,
      color: 'bg-slate-800'
    }));
    setRewards(prev => [...formatted, ...prev]);
  };

  const updateWallets = (updatedWallets: Wallet[]) => setWallets(updatedWallets);
  
  const updateUser = (updates: Partial<User>) => {
    authUpdateUser(updates);
  };

  return (
    <FinancialContext.Provider value={{ 
      user: currentUser, wallets, transactions, investments, cards, rewards,
      addMoney, sendMoney, buyAsset, sellAsset, toggleCardStatus, createCard,
      claimReward, addNewRewards, updateWallets, updateUser 
    }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) throw new Error('useFinancial must be used within a FinancialProvider');
  return context;
};
