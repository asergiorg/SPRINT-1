import { Component, OnInit } from '@angular/core';
import { Activity1 } from '../../components/activity1/activity1';
import { Header } from '../../components/header/header';
import { Activity } from '../../models/activity.model';
import { ActivitiesService } from '../../services/activities.service';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [Activity1, Header],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit{
  activities: Activity[] = [];

  constructor(private activitiesService: ActivitiesService){}
  
  ngOnInit(): void {
    this.activitiesService.getActivities().subscribe(data => {
      this.activities = data.slice(0, 5);
      console.log('data:', data);
    });
  }

  onActivityClicked(activityId: number) {
    console.log('Activity clicked:', activityId);
  }
}
