import type { Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../features/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'plans',
        loadComponent: () =>
          import('../features/plans/plans.page').then((m) => m.PlansPage),
      },
      {
        path: 'zones',
        loadComponent: () =>
          import('../features/zones-guide/zones-guide.page').then((m) => m.ZonesGuidePage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../features/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full',
  },
];