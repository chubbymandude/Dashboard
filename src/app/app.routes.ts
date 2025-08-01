import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Tabular } from './tabular/tabular';

export const routes: Routes = 
[
    { // default when page loads
        path: '', 
        component: Dashboard,
    },
    { // path to dashboard content after going to tabular content
        path: 'dashboard',
        component: Dashboard,
    },
    {
        path: 'dashboard/:mode',
        component: Dashboard,
    },
    {
        path: 'tabular', 
        component: Tabular
    },
    { 
        path: 'tabular/:mode', 
        component: Tabular 
    },
];
