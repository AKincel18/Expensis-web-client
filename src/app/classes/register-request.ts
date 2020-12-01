export interface RegisterRequest {
  //TODO: incomeScopesId
  email: string;
  password: string;
  gender: 'F' | 'M';
  birthDate: Date;
  monthlyLimit: number;
}
