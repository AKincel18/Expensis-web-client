export interface EditUserRequest {
    email: string;
    gender: 'F' | 'M';
    birth_date: Date;
    monthly_limit: number;
    income_range: number;
  }