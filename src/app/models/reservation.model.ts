import { Card } from "./card.model";

export interface Reservation extends Card{
    type: 'reservation';
    activity: string;
    date: string;
    time: string;
    participants: number;
    holder: string;
    status: 'Pending' | 'Paid' | 'Confirmed' | 'Cancelled';
}