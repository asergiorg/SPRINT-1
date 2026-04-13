import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-activity2',
  imports: [],
  templateUrl: './activity2.html',
  styleUrl: './activity2.css',
})
export class Activity2 {
  @Input() activity!: Activity;
}
