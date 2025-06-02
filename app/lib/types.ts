export interface UserDTO {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface AccountDTO {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT';
  balance: number;
  status: 'ACTIVE' | 'INACTIVE' | 'FROZEN';
  interestRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionDTO {
  id: string;
  accountId: string;
  transactionType: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  category?: string;
  transactionDate: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserDTO;
}