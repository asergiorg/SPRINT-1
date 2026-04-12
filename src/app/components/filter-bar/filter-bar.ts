import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-bar',
  imports: [],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
})
export class FilterBar {
  @Input() blockedFilters: boolean = true;
  @Output() filterClosed = new EventEmitter<boolean>();

  closeFilters() {
    this.blockedFilters = !this.blockedFilters;
    this.filterClosed.emit(this.blockedFilters);
  }

}
