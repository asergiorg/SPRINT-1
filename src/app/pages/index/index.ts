import { Component, OnInit } from '@angular/core';
import { Activity1 } from '../../components/activity1/activity1';
import { Header } from '../../components/header/header';
import { Activity } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [Activity1, Header, RouterLink],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit{
  activities: Activity[] = [];

  constructor(private activitiesService: ActivityService){}

  ngOnInit(): void {
    this.activitiesService.getActivities().subscribe(data => {
      this.activities = data.slice(0, 5);
    });
  }

  onActivityClicked(activityId: number) {
    console.log('Activity clicked:', activityId);
  }
}
