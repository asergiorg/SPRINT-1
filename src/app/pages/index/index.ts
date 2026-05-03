import { Component, OnInit, inject, signal } from '@angular/core';
import { Activity1 } from '../../components/activity1/activity1';
import { Activity } from '../../models/activity.model';
import { ActivitiesService } from '../../services/activities.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [Activity1],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {
  activities = signal<Activity[]>([]);
  private activitiesService = inject(ActivitiesService);
  
  ngOnInit(): void {
    this.activitiesService.getActivities().subscribe(data => {
      this.activities.set(data.slice(0, 5));
    });
  }

  onActivityClicked(activityId: number) {
    console.log('Activity clicked:', activityId);
  }
}
