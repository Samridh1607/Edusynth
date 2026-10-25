import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

/**
 * Each view of the original single page is now its own route, so pages
 * can be bookmarked, shared, and reached with the browser Back button.
 */
export const routes: Routes = [
  {
    path: '',
    title: 'EduSynth - Your Pathway to Create Knowledge',
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'tasks',
    title: 'Available Tasks | EduSynth',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tasks/tasks').then((m) => m.Tasks),
  },
  {
    path: 'privacy',
    title: 'Privacy Statement | EduSynth',
    loadComponent: () => import('./features/legal/privacy').then((m) => m.Privacy),
  },
  {
    path: 'cookies',
    title: 'Cookie Policy | EduSynth',
    loadComponent: () => import('./features/legal/cookies').then((m) => m.Cookies),
  },
  {
    path: 'terms',
    title: 'Terms of Use | EduSynth',
    loadComponent: () => import('./features/legal/terms').then((m) => m.Terms),
  },
  { path: '**', redirectTo: '' },
];
