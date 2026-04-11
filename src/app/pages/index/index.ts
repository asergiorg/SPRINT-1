import { Component } from '@angular/core';
import { Activity1 } from '../../components/activity1/activity1';
import { Header } from '../../components/header/header';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [Activity1, Header],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {
  activities: Activity[] = [{
    id: 1,
    name: 'Activity 1',
    description: 'Description for Activity 1',
    image: 'https://via.placeholder.com/150',
    price: 100,
    category: 'Adventure',
    duration: 2,
    difficulty: 'Medium',
    language: ['English'],
    rating: 4.5
  }];

  onActivityClicked(activityId: number) {
    console.log('Activity clicked:', activityId);
  }
}
