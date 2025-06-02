import api from '../api';
import { AccountDTO } from '../types';

export const accountsApi = {
  getAccounts: async (): Promise<AccountDTO[]> => {
    const response = await api.get<AccountDTO[]>('/accounts');
    return response.data;
  },

  getAccount: async (id: string): Promise<AccountDTO> => {
    const response = await api.get<AccountDTO>(`/accounts/${id}`);
    return response.data;
  },

  createAccount: async (data: Omit<AccountDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<AccountDTO> => {
    const response = await api.post<AccountDTO>('/accounts', data);
    return response.data;
  },

  updateAccount: async (id: string, data: Partial<AccountDTO>): Promise<AccountDTO> => {
    const response = await api.patch<AccountDTO>(`/accounts/${id}`, data);
    return response.data;
  },

  deleteAccount: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  }
}; 