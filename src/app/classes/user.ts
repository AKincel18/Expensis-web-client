export interface User {
    id: number;
    email: string; 
    gender: 'F' | 'M';
    birth_date: Date;
    monthly_limit: number;
    income_range: number;
    date_joined: Date;
}
