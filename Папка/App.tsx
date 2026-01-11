import React, { useState, useEffect, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { TransactionForm } from './components/TransactionForm';
import { AIAdvisor } from './components/AIAdvisor';
import { Transaction, FinancialSummary } from './types';
import { LayoutDashboard, PieChart, Plus, List, TrendingUp, Menu, X, User } from 'lucide-react';
import { Button } from './components/Button';
import { Card } from './components/Card';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'history' | 'advisor'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tgUser, setTgUser] = useState<{firstName: string} | null>(null);

  // Initialize Telegram Web App
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      webApp.expand(); // Expand to full height
      
      // Get user data
      if (webApp.initDataUnsafe?.user) {
        setTgUser({ firstName: webApp.initDataUnsafe.user.first_name });
      }
      
      // Optional: Set header color to match app
      // webApp.setHeaderColor('#0f172a'); 
    }
  }, []);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    } else {
        // Seed dummy data if empty
        const dummyData: Transaction[] = [
            { id: '1', amount: 85000, category: 'Зарплата', type: 'income', date: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Аванс' },
            { id: '2', amount: 1200, category: 'Еда', type: 'expense', date: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Обед' },
            { id: '3', amount: 3500, category: 'Развлечения', type: 'expense', date: new Date().toISOString(), note: 'Кино и ужин' },
        ];
        setTransactions(dummyData);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: crypto.randomUUID() };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
      setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const summary: FinancialSummary = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [transactions]);

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static
      `}>
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">F</div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white leading-none">FinTrack <span className="text-indigo-500 text-xs uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded ml-1 align-middle">Pro</span></h1>
            {tgUser && <p className="text-xs text-slate-400 mt-1">Привет, {tgUser.firstName}</p>}
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Обзор" />
          <NavItem id="analytics" icon={PieChart} label="Аналитика" />
          <NavItem id="history" icon={List} label="История" />
          <NavItem id="advisor" icon={TrendingUp} label="AI Советник" />
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <Card className="bg-gradient-to-br from-indigo-900/40 to-slate-800 p-4 border-none">
            <p className="text-xs text-indigo-300 font-medium mb-1">Ваш баланс</p>
            <p className="text-xl font-bold text-white mb-3">
              {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(summary.balance)}
            </p>
            <Button size="sm" className="w-full text-xs" onClick={() => setIsModalOpen(true)}>
              <Plus size={14} className="mr-1" /> Добавить
            </Button>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header (Mobile) */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur z-30">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold">F</div>
             <div className="flex flex-col">
                <span className="font-bold leading-none">FinTrack</span>
                {tgUser && <span className="text-xs text-slate-400 leading-none mt-1">{tgUser.firstName}</span>}
             </div>
           </div>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-200">
             {isMobileMenuOpen ? <X /> : <Menu />}
           </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {activeTab === 'dashboard' && <Dashboard transactions={transactions} summary={summary} />}
            
            {activeTab === 'analytics' && <Analytics transactions={transactions} />}
            
            {activeTab === 'advisor' && <AIAdvisor transactions={transactions} summary={summary} />}
            
            {activeTab === 'history' && (
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">История операций</h2>
                    <Button onClick={() => setIsModalOpen(true)} size="sm"><Plus size={16} className="mr-1"/> Добавить</Button>
                 </div>
                 <div className="space-y-2">
                    {transactions.length === 0 ? <p className="text-slate-500">История пуста</p> : 
                     [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
                        <div key={t.id} className="group flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {t.category.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-200">{t.category}</p>
                                    <p className="text-sm text-slate-500">{new Date(t.date).toLocaleDateString()} <span className="mx-1">•</span> {t.note || 'Нет заметки'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                                    {t.type === 'income' ? '+' : '-'}{Math.abs(t.amount).toLocaleString()} ₽
                                </span>
                                <button 
                                    onClick={() => deleteTransaction(t.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-500 transition-all"
                                    title="Удалить"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 z-40 active:scale-95 transition-transform"
      >
        <Plus size={28} />
      </button>

      {isModalOpen && (
        <TransactionForm onClose={() => setIsModalOpen(false)} onSubmit={addTransaction} />
      )}
    </div>
  );
}

export default App;