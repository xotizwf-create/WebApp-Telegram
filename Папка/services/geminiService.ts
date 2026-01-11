import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (transactions: Transaction[], summary: { totalIncome: number, totalExpense: number, balance: number }) => {
  try {
    const transactionSummary = transactions.slice(0, 50).map(t => 
      `- ${t.date.split('T')[0]}: ${t.type === 'expense' ? 'Трата' : 'Доход'} ${t.amount} руб. (${t.category})`
    ).join('\n');

    const prompt = `
      Ты — элитный финансовый консультант. Проанализируй данные пользователя.
      
      Текущее состояние:
      - Общий доход: ${summary.totalIncome} руб.
      - Общий расход: ${summary.totalExpense} руб.
      - Баланс: ${summary.balance} руб.

      Последние транзакции:
      ${transactionSummary}

      Дай 3 конкретных, кратких и полезных совета на русском языке по улучшению финансового положения, основанных на этих данных. 
      Формат: JSON массив строк. Пример: ["Совет 1", "Совет 2", "Совет 3"]
      Не используй markdown разметку, просто верни чистый JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return ["Не удалось получить советы от AI."];

    return JSON.parse(text) as string[];

  } catch (error) {
    console.error("Error fetching AI advice:", error);
    return ["Произошла ошибка при соединении с AI консультантом."];
  }
};