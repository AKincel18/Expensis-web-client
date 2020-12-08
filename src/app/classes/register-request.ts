export interface RegisterRequest {
  //TODO: incomeScopesId
  email: string;
  password: string;
  gender: 'F' | 'M';
  birth_date: Date;
  monthly_limit: number;
  income_range: number;
  username: string;
}
