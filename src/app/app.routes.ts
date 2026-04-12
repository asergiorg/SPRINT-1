import { Routes } from '@angular/router';
import { Index } from './pages/index/index';
import { ActivictiesCatalog } from './pages/activicties-catalog/activicties-catalog';

export const routes: Routes = [
    {path: '', component: Index},
    {path: 'activities', component: ActivictiesCatalog}
];
