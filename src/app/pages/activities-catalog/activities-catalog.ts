import { Component, OnInit, inject, signal, computed, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Activity2 } from '../../components/activity2/activity2';
import { Activity } from '../../models/activity.model';
import { FilterBar } from '../../components/filter-bar/filter-bar';
import { ActivitiesService } from '../../services/activities.service';

@Component({
  selector: 'app-activities-catalog',
  standalone: true,
  imports: [ Activity2, FilterBar, ReactiveFormsModule ],
  templateUrl: './activities-catalog.html',
  styleUrl: './activities-catalog.css',
})
export class ActivitiesCatalog implements OnInit {
  filterClicked = output<boolean>();

  private activitiesService = inject(ActivitiesService);

  blockedFilters = signal(false);
  activities = signal<Activity[]>([]);

  searchControl = new FormControl('', { nonNullable: true });
  searchText = toSignal(this.searchControl.valueChanges, { initialValue: '' });

  filteredActivities = computed(() => {
    const text = this.searchText().toLowerCase();
    return this.activities().filter(a => a.name.toLowerCase().includes(text));
  });

  ngOnInit(): void {
    this.activitiesService.getActivities().subscribe(data => {
      this.activities.set(data);
    });
  }

  showFilters() {
    this.blockedFilters.update(v => !v);
  }
}
