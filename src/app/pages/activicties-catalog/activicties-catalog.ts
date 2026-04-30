import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Header } from '../../components/header/header';
import { Activity2 } from '../../components/activity2/activity2';
import { Activity } from '../../models/activity.model';
import { FilterBar } from '../../components/filter-bar/filter-bar';
import { ActivityService } from '../../services/activities';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-activicties-catalog',
  imports: [ Header, Activity2, FilterBar, FormsModule, RouterLink],
  templateUrl: './activicties-catalog.html',
  styleUrl: './activicties-catalog.css',
})
export class ActivictiesCatalog implements OnInit {
  @Output() filterClicked = new EventEmitter<boolean>();

  blockedFilters = false;
  searchText: string = '';

  activities: Activity[] = [];

  constructor(private activitiesService: ActivityService){}

  ngOnInit(): void {
    this.activitiesService.getActivities().subscribe(data => {
      this.activities = data;
    });
  }

  onActivityClicked(activityId: number) {
    console.log('Activity clicked:', activityId);
  }

  showFilters() {
    this.blockedFilters = !this.blockedFilters;
  }

  onSearchChange(search: string) {
    this.searchText = search;
  }

  get filteredActivities() {
    const text = this.searchText.toLowerCase();
    return this.activities.filter(a =>
      a.name.toLowerCase().includes(text)
    );
  }
}
