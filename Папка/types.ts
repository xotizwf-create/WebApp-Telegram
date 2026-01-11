export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO date string
  note: string;
  type: TransactionType;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export type Period = 'week' | 'month' | 'year' | 'all';

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

// Telegram WebApp Global Types
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
          showProgress: (leaveActive: boolean) => void;
          hideProgress: () => void;
        };
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
      };
    };
  }
}