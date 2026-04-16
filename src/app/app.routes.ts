import { Routes } from '@angular/router';
import { Index } from './pages/index/index';
import { ActivictiesCatalog } from './pages/activicties-catalog/activicties-catalog';
import { UserActivities } from './pages/user-activities/user-activities';
import { ReservationInformation } from './pages/reservation-information/reservation-information';
import { ActivityInformation } from './pages/activity-information/activity-information';

export const routes: Routes = [
    {path: 'activities', component: ActivictiesCatalog},
    { path: 'user-activities', component: UserActivities },
    { path: 'activity-information/:id', component: ActivityInformation },
    { path: 'reservation-information/:id', component: ReservationInformation },
    {path: '', component: Index}
];

