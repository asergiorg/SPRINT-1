import { Routes } from '@angular/router';
import { Index } from './pages/index/index';
import { ActivictiesCatalog } from './pages/activicties-catalog/activicties-catalog';
import { UserActivities } from './pages/user-activities/user-activities';

export const routes: Routes = [
    {path: '', component: Index},
    {path: 'activities', component: ActivictiesCatalog},
    { path: 'user-activities', component: UserActivities }
];

