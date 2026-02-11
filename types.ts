
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  BTC = 'BTC',
  ETH = 'ETH'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  isAddressVerified: boolean;
  rewardPoints: number;
  password?: string;
  // Specific profile metadata for Robert J. White
  maidenName?: string;
  ssn?: string;
  geo?: string;
  birthday?: string;
  age?: string;
  zodiac?: string;
  username?: string;
}

export interface Wallet {
  id: string;
  currency: Currency;
  balance: number;
  symbol: string;
  color: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  currency: Currency;
  date: string;
  category: 'Shopping' | 'Food' | 'Transport' | 'Subscription' | 'Transfer' | 'Investment';
  type: 'debit' | 'credit';
  narrative?: string;
}

export interface Investment {
  id: string;
  name: string;
  symbol: string;
  holdings: number;
  currentValue: number;
  change24h: number;
  type: 'Stock' | 'Crypto' | 'Metal';
}

export interface Card {
  id: string;
  cardNumber: string;
  lastFour: string;
  expiry: string;
  type: 'Virtual' | 'Physical';
  status: 'active' | 'frozen';
  color: string;
}

export interface Reward {
  id: string;
  brand: string;
  deal: string;
  logo: string;
  color: string;
  cost: number;
  claimed: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UserDataStore {
  user: User;
  wallets: Wallet[];
  transactions: Transaction[];
  investments: Investment[];
  cards: Card[];
  rewards: Reward[];
}
