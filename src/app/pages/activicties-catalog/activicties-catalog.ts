import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Header } from '../../components/header/header';
import { Activity2 } from '../../components/activity2/activity2';
import { Activity } from '../../models/activity.model';
import { FilterBar } from '../../components/filter-bar/filter-bar';
import { ActivitiesService } from '../../services/activities.service';

@Component({
  selector: 'app-activicties-catalog',
  imports: [ Header, Activity2, FilterBar ],
  templateUrl: './activicties-catalog.html',
  styleUrl: './activicties-catalog.css',
})
export class ActivictiesCatalog implements OnInit {
  @Output() filterClicked = new EventEmitter<boolean>();

  blockedFilters = false;

  activities: Activity[] = [];

  constructor(private activitiesService: ActivitiesService){}

  ngOnInit(): void {
    this.activitiesService.getActivities().subscribe(data => {
      this.activities = data;
      console.log('data:', data);
    });
  }

  onActivityClicked(activityId: number) {
    console.log('Activity clicked:', activityId);
  }

  showFilters() {
    this.blockedFilters = !this.blockedFilters;
  }
}
