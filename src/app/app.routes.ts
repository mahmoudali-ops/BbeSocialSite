import { ContactComponent } from './clientComponents/contact/contact.component';
import { CareerComponent } from './clientComponents/career/career.component';
import { PricingComponent } from './clientComponents/pricing/pricing.component';
import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotfoundComponent } from './clientComponents/notfound/notfound.component';
import { HomeComponent } from './clientComponents/home/home.component';
import { FaqComponent } from './clientComponents/faq/faq.component';
import { ServicesComponent } from './clientComponents/services/services.component';
import { LoginComponent } from './adminCompoents/login/login.component';
import { UsersComponent } from './adminCompoents/users/users.component';
import { RegisterComponent } from './adminCompoents/register/register.component';

import { authGuardGuard } from './core/guards/auth-guard.guard';
import { AboutComponent } from './clientComponents/about/about.component';
import { logedGuard } from './core/guards/loged.guard';
export const routes: Routes = [
    {
      path: '',
      loadComponent: () => import('./layouts/client-layout/client-layout.component').then(m => m.ClientLayoutComponent),
      children: [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', loadComponent: () => import('./clientComponents/home/home.component').then(m => m.HomeComponent) },
        { path: 'about', loadComponent: () => import('./clientComponents/about/about.component').then(m => m.AboutComponent) },
        { path: 'services', loadComponent: () => import('./clientComponents/services/services.component').then(m => m.ServicesComponent) },
        { path: 'pricing', loadComponent: () => import('./clientComponents/pricing/pricing.component').then(m => m.PricingComponent) },
        { path: 'career', loadComponent: () => import('./clientComponents/career/career.component').then(m => m.CareerComponent) },
        { path: 'faq', loadComponent: () => import('./clientComponents/faq/faq.component').then(m => m.FaqComponent) },
        { path: 'contact', loadComponent: () => import('./clientComponents/contact/contact.component').then(m => m.ContactComponent) },
       


      ]
    },
    {
      path: 'admin',
      loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
      children: [
        { path: 'login', loadComponent: () => import('./adminCompoents/login/login.component').then(m => m.LoginComponent), canActivate: [logedGuard], title: 'Login' },
        { path: 'register', loadComponent: () => import('./adminCompoents/register/register.component').then(m => m.RegisterComponent), title: 'Register' },
  
        { path: 'emails', loadComponent: () => import('./adminCompoents/email-ad/email-ad.component').then(m => m.EmailAdComponent), canActivate: [authGuardGuard], title: 'Emails' },
        { path: 'users', loadComponent: () => import('./adminCompoents/users/users.component').then(m => m.UsersComponent), canActivate: [authGuardGuard], title: 'Users' },
  
  
        { path: '', redirectTo: 'tours', pathMatch: 'full' },
        { path: '**', redirectTo: 'tours' },
      ]
    },
    { path: '**', loadComponent: () => import('./clientComponents/notfound/notfound.component').then(m => m.NotfoundComponent), title: 'Not Found Page' }
  ];
  