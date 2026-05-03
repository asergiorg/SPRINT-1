import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivityFilters } from '../../models/filter.model';

@Component({
  selector: 'app-filter-bar',
  imports: [FormsModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
})
export class FilterBar {
  @Input() blockedFilters: boolean = true;
  @Output() filterClosed = new EventEmitter<boolean>();
  @Output() filtersApplied = new EventEmitter<ActivityFilters>();

  filters: ActivityFilters = {
    price_min: null,
    price_max: null,
    duration_min: null,
    duration_max: null,
    language: 'all',
    stars: 'all',
    difficulty: 'all',
  };

  closeFilters() {
    this.blockedFilters = !this.blockedFilters;
    this.filterClosed.emit(this.blockedFilters);
  }

  applyFilters() {
    this.filtersApplied.emit(this.filters);
    this.closeFilters();
  }

}
