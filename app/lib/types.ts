export interface UserDTO {
  id?: number;
  username: string;
  password?: string;
  role: string;
  email?: string;
}

export interface AccountDTO {
  id?: number;
  accountNumber?: string;
  accountHolderName: string;
  balance?: number;
  accountType: string;
  status?: string;
  interestRate?: number;
  email?: string;
}

export interface TransactionDTO {
  id?: number;
  accountId?: number;
  transactionType: string;
  amount: number;
  transactionDate?: string;
  description?: string;
  paymentMethod?: string;
  relatedTransactionId?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}