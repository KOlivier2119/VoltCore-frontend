import api from '../api';
import { TransactionDTO } from '../types';

export const transactionsApi = {
  getTransactions: async (accountId?: string): Promise<TransactionDTO[]> => {
    const url = accountId ? `/accounts/${accountId}/transactions` : '/transactions';
    const response = await api.get<TransactionDTO[]>(url);
    return response.data;
  },

  getTransaction: async (id: string): Promise<TransactionDTO> => {
    const response = await api.get<TransactionDTO>(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (data: Omit<TransactionDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<TransactionDTO> => {
    const response = await api.post<TransactionDTO>('/transactions', data);
    return response.data;
  },

  updateTransaction: async (id: string, data: Partial<TransactionDTO>): Promise<TransactionDTO> => {
    const response = await api.patch<TransactionDTO>(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  }
}; 