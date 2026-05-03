import { Component, Input } from '@angular/core';
import { Activity } from '../../models/activity.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-activity3',
  imports: [RouterLink],
  templateUrl: './activity3.html',
  styleUrl: './activity3.css',
})
export class Activity3 {
  @Input() activity!: Activity;
}
