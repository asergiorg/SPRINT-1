import { Card } from './card.model';

export interface Activity extends Card {
  name: string;
  description: string;
  type:'activity';
  image: string[];
  category: string;
  duration: number;
  languages: string[];
  dificulty: string;
  rating: number;
}
