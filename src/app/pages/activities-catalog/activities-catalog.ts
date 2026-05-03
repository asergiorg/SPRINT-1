import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Activity2 } from '../../components/activity2/activity2';
import { Activity } from '../../models/activity.model';
import { FilterBar } from '../../components/filter-bar/filter-bar';
import { ActivityService } from '../../services/activity.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ActivityFilters } from '../../models/filter.model';

@Component({
  selector: 'app-activities-catalog',
  imports: [ Activity2, FilterBar, FormsModule, RouterLink],
  templateUrl: './activities-catalog.html',
  styleUrl: './activities-catalog.css',
})
export class ActivitiesCatalog implements OnInit {
  @Output() filterClicked = new EventEmitter<boolean>();

  blockedFilters = false;
  searchText: string = '';
  activeFilters: ActivityFilters = {
    price_min: null, price_max: null,
    duration_min: null, duration_max: null,
    language: 'all', stars: 'all', difficulty: 'all'
  };

  activities: Activity[] = [];

  constructor(private activitiesService: ActivityService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.activitiesService.getActivities().subscribe(data => {
      this.activities = data;
    });


    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchText = params['search'];
      }
    });
  }

  showFilters() {
    this.blockedFilters = !this.blockedFilters;
  }

  onSearchChange(search: string) {
    this.searchText = search;
  }

  onFiltersApplied(filters: ActivityFilters) {
    this.activeFilters = filters;
  }

  get filteredActivities() {
    const text = this.searchText.toLowerCase();
    const f = this.activeFilters;

    const toNumber = (value: unknown): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
      return 0;
    };

    return this.activities.filter(a => {
      if (!a.name.toLowerCase().includes(text)) return false;

      const price = toNumber(a.price);
      if (f.price_min !== null && price < f.price_min) return false;
      if (f.price_max !== null && price > f.price_max) return false;

      const duration = toNumber(a.duration);
      if (f.duration_min !== null && duration < f.duration_min) return false;
      if (f.duration_max !== null && duration > f.duration_max) return false;

      if (f.language !== 'all' && !a.languages.includes(f.language)) return false;
      if (f.stars !== 'all' && a.rating < Number(f.stars)) return false;
      if (f.difficulty !== 'all' && a.difficulty !== f.difficulty) return false;

      return true;
    });
  }
}