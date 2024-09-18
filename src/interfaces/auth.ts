export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isActive: boolean;
}
export interface StockRecord {
  id: string;
  userId: string;
  tickerId: string;
  buyDate: Date;
  buyPrice: string;
  quantity: string;
  brokerName: string;
  createdAt: Date;
  updatedAt: Date;
  basketId?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  exp: any;
}

export interface Migration {
  up: (db: any) => Promise<void>;
  down: (db: any) => Promise<void>;
}
