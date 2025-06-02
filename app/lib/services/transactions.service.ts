import api from '../api';
import { TransactionDTO } from '../types';

class TransactionsService {
  async getTransactions(accountId?: string): Promise<TransactionDTO[]> {
    const url = accountId ? `/accounts/${accountId}/transactions` : '/transactions';
    const response = await api.get<TransactionDTO[]>(url);
    return response.data;
  }

  async getTransaction(id: string): Promise<TransactionDTO> {
    const response = await api.get<TransactionDTO>(`/transactions/${id}`);
    return response.data;
  }

  async createTransaction(data: Omit<TransactionDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<TransactionDTO> {
    const response = await api.post<TransactionDTO>('/transactions', data);
    return response.data;
  }

  async updateTransaction(id: string, data: Partial<TransactionDTO>): Promise<TransactionDTO> {
    const response = await api.patch<TransactionDTO>(`/transactions/${id}`, data);
    return response.data;
  }

  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  }
}

export const transactionsService = new TransactionsService(); 