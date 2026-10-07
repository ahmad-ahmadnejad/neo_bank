export interface TransactionType {
  id: string;
  card_id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: string;
  description?: string;
  created_at: string;
}
