import React, { useState } from 'react';
import { Transaction, FinancialSummary } from '../types';
import { Card } from './Card';
import { Button } from './Button';
import { getFinancialAdvice } from '../services/geminiService';
import { Sparkles, BrainCircuit } from 'lucide-react';

interface AIAdvisorProps {
  transactions: Transaction[];
  summary: FinancialSummary;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions, summary }) => {
  const [advice, setAdvice] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const tips = await getFinancialAdvice(transactions, summary);
    setAdvice(tips);
    setLoading(false);
  };

  return (
    <Card className="relative overflow-hidden border-indigo-500/30">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Финансовый Советник</h3>
            <p className="text-slate-400 text-sm">Персональные рекомендации на основе ваших данных</p>
          </div>
        </div>

        {advice.length === 0 && !loading ? (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-6 max-w-lg mx-auto">
              Используйте мощь искусственного интеллекта для анализа ваших трат и поиска возможностей для экономии.
            </p>
            <Button onClick={handleAnalyze} size="lg" className="shadow-indigo-500/25">
              <Sparkles className="mr-2" size={18} />
              Получить анализ
            </Button>
          </div>
        ) : loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
             <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
             <p className="text-slate-400 animate-pulse">Анализирую ваши финансы...</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
             {advice.map((tip, index) => (
               <div key={index} className="flex gap-4 p-4 bg-slate-800/80 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all">
                 <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-sm">
                   {index + 1}
                 </div>
                 <p className="text-slate-200 leading-relaxed">{tip}</p>
               </div>
             ))}
             <div className="flex justify-center mt-6">
                <Button variant="ghost" onClick={handleAnalyze} disabled={loading}>
                  Обновить рекомендации
                </Button>
             </div>
          </div>
        )}
      </div>
    </Card>
  );
};