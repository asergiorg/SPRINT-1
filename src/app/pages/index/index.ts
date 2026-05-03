import { Component, OnInit, inject, signal} from '@angular/core';
import { Activity1 } from '../../components/activity1/activity1';
import { Activity } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [Activity1, RouterLink, FormsModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit{
  activities: Activity[] = [];
  searchText: string = '';

  constructor(private activitiesService: ActivityService, private router: Router){}

  ngOnInit(): void {
    this.activitiesService.getActivities().subscribe(data => {
      this.activities = data.slice(0, 5);
    });
  }

  onSearch(){
    if(this.searchText.trim() !== '') {
      this.router.navigate(['/activities'], { queryParams: { search: this.searchText } });
    }
  }
}
