import api from '../api';
import { AccountDTO } from '../types';

class AccountsService {
  async getAccounts(): Promise<AccountDTO[]> {
    const response = await api.get<AccountDTO[]>('/accounts');
    return response.data;
  }

  async getAccount(id: string): Promise<AccountDTO> {
    const response = await api.get<AccountDTO>(`/accounts/${id}`);
    return response.data;
  }

  async createAccount(data: Omit<AccountDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<AccountDTO> {
    const response = await api.post<AccountDTO>('/accounts', data);
    return response.data;
  }

  async updateAccount(id: string, data: Partial<AccountDTO>): Promise<AccountDTO> {
    const response = await api.patch<AccountDTO>(`/accounts/${id}`, data);
    return response.data;
  }

  async deleteAccount(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`);
  }
}

export const accountsService = new AccountsService(); 