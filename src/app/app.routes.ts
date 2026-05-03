import { Routes } from '@angular/router';
import { Index } from './pages/index/index';
import { ActivitiesCatalog } from './pages/activities-catalog/activities-catalog';
import { UserActivities } from './pages/user-activities/user-activities';
import { ReservationInformation } from './pages/reservation-information/reservation-information';
import { ActivityInformation } from './pages/activity-information/activity-information';

export const routes: Routes = [
    {path: 'activities', component: ActivitiesCatalog},
    { path: 'user-activities', component: UserActivities },
    { path: 'activity-information/:id', component: ActivityInformation },
    { path: 'reservation-information/:id', component: ReservationInformation },
    {path: '', component: Index}
];

