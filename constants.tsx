
import React from 'react';
import { Wallet, Currency, Transaction, Investment, Card } from './types';

export const MOCK_WALLETS: Wallet[] = [
  { id: 'usd-wallet', currency: Currency.USD, balance: 12450.50, symbol: '$', color: 'bg-blue-600' },
  { id: 'gbp-wallet', currency: Currency.GBP, balance: 850.25, symbol: '£', color: 'bg-purple-600' },
  { id: 'crypto-wallet', currency: Currency.BTC, balance: 0.12, symbol: '₿', color: 'bg-orange-500' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Apple Store', amount: -1299.00, currency: Currency.USD, date: '2024-05-15', category: 'Shopping', type: 'debit' },
  { id: '2', title: 'Starbucks Coffee', amount: -5.50, currency: Currency.USD, date: '2024-05-14', category: 'Food', type: 'debit' },
  { id: '3', title: 'Salary Deposit', amount: 4500.00, currency: Currency.USD, date: '2024-05-01', category: 'Transfer', type: 'credit' },
  { id: '4', title: 'Netflix Subscription', amount: -15.99, currency: Currency.USD, date: '2024-05-10', category: 'Subscription', type: 'debit' },
  { id: '5', title: 'Uber Trip', amount: -24.50, currency: Currency.USD, date: '2024-05-12', category: 'Transport', type: 'debit' },
];

export const MOCK_INVESTMENTS: Investment[] = [
  { id: '1', name: 'Nvidia Corp', symbol: 'NVDA', holdings: 10, currentValue: 9200.00, change24h: 2.4, type: 'Stock' },
  { id: '2', name: 'Bitcoin', symbol: 'BTC', holdings: 0.12, currentValue: 7800.00, change24h: -1.2, type: 'Crypto' },
  { id: '3', name: 'Tesla Inc', symbol: 'TSLA', holdings: 15, currentValue: 2500.00, change24h: 0.8, type: 'Stock' },
  { id: '4', name: 'Ethereum', symbol: 'ETH', holdings: 2, currentValue: 6000.00, change24h: 1.5, type: 'Crypto' },
];

export const MOCK_CARDS: Card[] = [
  { id: '1', cardNumber: '4291 5562 1190 4291', lastFour: '4291', expiry: '08/27', type: 'Virtual', status: 'active', color: 'from-blue-500 to-indigo-600' },
  { id: '2', cardNumber: '8812 3344 0098 8812', lastFour: '8812', expiry: '12/26', type: 'Physical', status: 'frozen', color: 'from-slate-700 to-slate-900' },
];

export const FAQS = [
  { q: "How do I obtain a Developer Coupon?", a: "Developer Coupons are unique 10-digit identifiers provided by authorized Aura Node Suppliers. Redirect to 'Customer Care' node for manual ledger audit." },
  { q: "Is my biometric data stored?", a: "Negative. Aura utilizes local device enclaves for biometric hashing. Raw data is never transmitted to central nodes." },
  { q: "What are the transfer limits?", a: "Standard daily threshold: $50,000. Verified high-liquidity nodes may request expansion via Superior Care Node." },
  { q: "Why is my transaction in 'Syncing' state?", a: "Cross-ledger validation in progress. Processing time: 2-5 seconds. Protocol requirement for node synchronization." }
];

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Shopping: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  Food: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Transport: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  Subscription: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Transfer: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  Investment: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  )
};
