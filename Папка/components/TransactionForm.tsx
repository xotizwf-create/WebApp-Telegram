import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { Button } from './Button';
import { X } from 'lucide-react';

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const expenseCategories = ['Еда', 'Транспорт', 'Жилье', 'Развлечения', 'Здоровье', 'Покупки', 'Другое'];
  const incomeCategories = ['Зарплата', 'Фриланс', 'Подарки', 'Инвестиции', 'Другое'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSubmit({
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date).toISOString(),
      note,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Новая операция</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                type === 'expense' 
                  ? 'bg-rose-500/10 text-rose-500 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Расходы
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                type === 'income' 
                  ? 'bg-emerald-500/10 text-emerald-500 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Доходы
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Сумма</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Категория</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
            >
              <option value="" disabled>Выберите категорию</option>
              {(type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Дата</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Заметка (опционально)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Комментарий..."
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" size="lg">
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};