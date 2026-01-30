export enum AppState {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  ADD_PHONE = 'ADD_PHONE',
  TRANSFER = 'TRANSFER',
  TRACK = 'TRACK',
  VERIFY = 'VERIFY'
}

export interface PhoneRecord {
  id: string;
  imei: string;
  model: string;
  manufacturer: string;
  currentOwner: string;
  status: 'Manufactured' | 'Distributed' | 'In-Retail' | 'Customer-Owned';
  history: Transaction[];
  timestamp: string;
}

export interface Transaction {
  from: string;
  to: string;
  action: string;
  timestamp: string;
  txHash: string;
}

export interface User {
  address: string | null;
  isConnected: boolean;
  role: 'Manufacturer' | 'Distributor' | 'Retailer' | 'Customer' | 'Guest';
}
