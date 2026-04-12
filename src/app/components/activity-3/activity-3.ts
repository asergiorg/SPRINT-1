import { Component, Input } from '@angular/core';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-activity-3',
  imports: [],
  templateUrl: './activity-3.html',
  styleUrl: './activity-3.css',
})
export class Activity3 {
  @Input() activity!: Activity;
}
