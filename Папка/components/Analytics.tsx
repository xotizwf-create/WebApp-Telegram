import React, { useMemo, useState } from 'react';
import { Transaction, Period } from '../types';
import { Card } from './Card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface AnalyticsProps {
  transactions: Transaction[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const [period, setPeriod] = useState<Period>('month');

  const expenseTransactions = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);

  // Data for Pie Chart (Expenses by Category)
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    expenseTransactions.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.keys(categories).map(key => ({
      name: key,
      value: categories[key]
    })).sort((a, b) => b.value - a.value);
  }, [expenseTransactions]);

  // Data for Bar Chart (Dynamics)
  const timelineData = useMemo(() => {
    const grouped: Record<string, { income: number, expense: number }> = {};
    
    // Sort chronologically first
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach(t => {
      const date = new Date(t.date);
      let key = '';
      
      // Simple grouping logic based on period selection
      // Ideally this would be more robust with date ranges
      if (period === 'year') {
         key = date.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
      } else {
         key = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      }

      if (!grouped[key]) grouped[key] = { income: 0, expense: 0 };
      if (t.type === 'income') grouped[key].income += t.amount;
      else grouped[key].expense += t.amount;
    });

    // Take last 7 entries for cleaner view if there are too many
    const keys = Object.keys(grouped);
    const slicedKeys = keys.length > 10 ? keys.slice(keys.length - 10) : keys;

    return slicedKeys.map(key => ({
      name: key,
      ...grouped[key]
    }));
  }, [transactions, period]);

  const COLORS = ['#6366f1', '#14b8a6', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Аналитика расходов</h2>
        <div className="flex bg-slate-800 p-1 rounded-lg">
          {(['week', 'month', 'year'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                period === p ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Структура расходов">
          <div className="h-[300px] w-full">
             {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                    formatter={(value: number) => `${value.toLocaleString('ru-RU')} ₽`}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-500">Нет данных о расходах</div>
             )}
          </div>
        </Card>

        <Card title="Динамика доходов и расходов">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timelineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Legend />
                <Bar name="Доходы" dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar name="Расходы" dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};