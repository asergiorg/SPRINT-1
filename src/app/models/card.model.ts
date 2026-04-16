export interface Card {
    id: string;
    price: number;
    type: 'activity' | 'reservation';
}