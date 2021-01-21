export interface RegisterRequest {
  email: string;
  password: string;
  gender: 'F' | 'M';
  birth_date: Date;
  monthly_limit: number;
  income_range: number;
  username: string;
  allow_data_collection: Boolean;
}
