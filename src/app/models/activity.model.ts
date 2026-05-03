import { Card } from './card.model';

export interface Activity extends Card {
  name: string;
  description: string;
  type:'activity';
  image: string[];
  category: string;
  duration: string;
  languages: string[];
  hours: string[];
  difficulty: string;
  rating: number;
}
