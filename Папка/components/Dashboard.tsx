import React from 'react';
import { Transaction, FinancialSummary } from '../types';
import { Card } from './Card';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  summary: FinancialSummary;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, summary }) => {
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-900/50 to-slate-800 border-indigo-500/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Текущий баланс</p>
              <h2 className="text-3xl font-bold text-white mt-2">{formatCurrency(summary.balance)}</h2>
            </div>
            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
              <Wallet size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Доходы</p>
              <h2 className="text-2xl font-bold text-emerald-400 mt-2">+{formatCurrency(summary.totalIncome)}</h2>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <ArrowUpRight size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Расходы</p>
              <h2 className="text-2xl font-bold text-rose-400 mt-2">-{formatCurrency(summary.totalExpense)}</h2>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
              <ArrowDownRight size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">Последние операции</h3>
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-10 text-slate-500 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
              Нет операций
            </div>
          ) : (
            recentTransactions.map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-full ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{t.category}</p>
                    <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`font-semibold ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};