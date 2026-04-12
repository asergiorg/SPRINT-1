import { Component, EventEmitter, Output } from '@angular/core';
import { Header } from '../../components/header/header';
import { Activity2 } from '../../components/activity2/activity2';
import { Activity } from '../../models/activity.model';
import { FilterBar } from '../../components/filter-bar/filter-bar';

@Component({
  selector: 'app-activicties-catalog',
  imports: [ Header, Activity2, FilterBar ],
  templateUrl: './activicties-catalog.html',
  styleUrl: './activicties-catalog.css',
})
export class ActivictiesCatalog {
  @Output() filterClicked = new EventEmitter<boolean>();

  blockedFilters = false;

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
    }, {
      id: 2,
      name: 'Activity 2',
      description: 'Description for Activity 2',
      image: 'https://via.placeholder.com/150',
      price: 150,
      category: 'Relaxation',
      duration: 3,
      difficulty: 'Easy',
      language: ['English'],
      rating: 4.0
    }];

  onActivityClicked(activityId: number) {
    console.log('Activity clicked:', activityId);
  }

  showFilters() {
    this.blockedFilters = !this.blockedFilters;
  }
}
