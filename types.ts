
export interface Listing {
  id: number;
  title: string;
  price: number;
  unit: string;
}

export interface Service {
  id: number;
  title: string;
  location: string;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export enum ModalType {
  Login = 'login',
  AddListing = 'addListing',
  Services = 'services',
  MarketPrices = 'marketPrices',
  HowToBuy = 'howToBuy',
  GlandMeasure = 'glandMeasure',
  Payment = 'payment',
  Inactivity = 'inactivity',
}

export enum ViewType {
  Dashboard = 'dashboard',
  Transactions = 'transactions',
}
