import { create } from "zustand";

export interface tokenType {
  name: string;
  symbol: string;
  publicKey: string;
  privateKey: string;
  balance: number;
}

export interface AccountType {
  name: string;
  tokens: tokenType[];
}

export interface WalletState {
  mnemonic: string | null;
  setMnemonic: (mnemonic: string | null) => void;
  accounts: AccountType[];
  setAccounts: (accounts: AccountType[]) => void;
}

const useWalletStore = create<WalletState>((set) => ({
  mnemonic: null,
  accounts: [],
  setAccounts: (accounts) => set({ accounts }),
  setMnemonic: (mnemonic) => set({ mnemonic }),
}));

export default useWalletStore;
