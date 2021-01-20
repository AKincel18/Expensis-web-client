export interface Expense {
    id: number;
    user: number;
    date: Date;
    title: string;
    description: string;
    category: string;
    value: number;
}