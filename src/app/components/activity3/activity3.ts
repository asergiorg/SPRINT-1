import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-activity3',
  imports: [],
  templateUrl: './activity3.html',
  styleUrl: './activity3.css',
})
export class Activity3 {
  @Input() activity!: Activity;
  @Output() activityClicked = new EventEmitter<number>();

  onClick() {
    this.activityClicked.emit(this.activity.id);
  }
}
