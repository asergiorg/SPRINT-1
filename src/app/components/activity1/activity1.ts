import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Activity } from '../../models/activity.model';


@Component({
  selector: 'app-activity1',
  imports: [],
  templateUrl: './activity1.html',
  styleUrl: './activity1.css',
})
export class Activity1 {
  @Input() activity!: Activity;
}
