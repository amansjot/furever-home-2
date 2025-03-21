import { Routes } from '@angular/router';
import { BrowseComponent } from './pages/browse/browse.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { AdminGuardService } from './guards/admin-guard.service';
import { SellerGuardService } from './guards/seller-guard.service';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'browse', component: BrowseComponent },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [AdminGuardService] },
  { path: 'seller', loadComponent: () => import('./pages/seller/seller.component').then(m => m.SellerComponent), canActivate: [SellerGuardService] },
  { path: 'pet/new', loadComponent: () => import('./pages/add-pet/add-pet.component').then(m => m.AddPetComponent), canActivate: [SellerGuardService] },
  { path: 'pet/edit/:id', loadComponent: () => import('./pages/edit-pet/edit-pet.component').then(m => m.EditPetComponent), canActivate: [SellerGuardService] },
  { path: 'pet/:id', loadComponent: () => import('./pages/pet/pet.component').then(m => m.PetComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuardService] },
  { path: 'questionnaire', loadComponent: () => import('./pages/questionnaire/questionnaire.component').then((m) => m.QuestionnaireComponent), canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '' } // if route is not found, redirect to landing page
];
