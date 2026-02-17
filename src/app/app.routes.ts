import { ServicefeatureUpdateComponent } from './adminCompoents/servicefeature-update/servicefeature-update.component';
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
        { path: 'reviews', loadComponent: () => import('./clientComponents/reviews/reviews.component').then(m => m.ReviewsComponent) },



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

        { path: 'career', loadComponent: () => import('./adminCompoents/career-ad/career-ad.component').then(m => m.CareerAdComponent), canActivate: [authGuardGuard], title: 'Career' },
        { path: 'career-update/:id', loadComponent: () => import('./adminCompoents/career-update/career-update.component').then(m => m.CareerUpdateComponent), canActivate: [authGuardGuard], title: 'Career-update' },
        { path: 'career-create', loadComponent: () => import('./adminCompoents/career-create/career-create.component').then(m => m.CareerCreateComponent), canActivate: [authGuardGuard], title: 'Career-create' },

        
        { path: 'servicefeature', loadComponent: () => import('./adminCompoents/servicefeature-ad/servicefeature-ad.component').then(m => m.ServicefeatureAdComponent), canActivate: [authGuardGuard], title: 'Service Feature' },
        { path: 'servicefeature-update/:id', loadComponent: () => import('./adminCompoents/servicefeature-update/servicefeature-update.component').then(m => m.ServicefeatureUpdateComponent), canActivate: [authGuardGuard], title: 'Service Feature Update' },
        { path: 'servicefeature-create', loadComponent: () => import('./adminCompoents/servicefeature-craete/servicefeature-craete.component').then(m => m.ServicefeatureCraeteComponent), canActivate: [authGuardGuard], title: 'Service Feature Create' },

        
        { path: 'servicecore', loadComponent: () => import('./adminCompoents/servicecore-ad/servicecore-ad.component').then(m => m.ServicecoreAdComponent), canActivate: [authGuardGuard], title: 'Service Core' },
        { path: 'servicecore-update/:id', loadComponent: () => import('./adminCompoents/servicecore-update/servicecore-update.component').then(m => m.ServicecoreUpdateComponent), canActivate: [authGuardGuard], title: 'Service Core Update' },
        { path: 'servicecore-create', loadComponent: () => import('./adminCompoents/servicecore-craete/servicecore-craete.component').then(m => m.ServicecoreCraeteComponent), canActivate: [authGuardGuard], title: 'Service Core Create' },

        
        { path: 'aboutteam', loadComponent: () => import('./adminCompoents/aboutteam-ad/aboutteam-ad.component').then(m => m.AboutteamAdComponent), canActivate: [authGuardGuard], title: 'About Team' },
        { path: 'aboutteam-update/:id', loadComponent: () => import('./adminCompoents/aboutteam-update/aboutteam-update.component').then(m => m.AboutteamUpdateComponent), canActivate: [authGuardGuard], title: 'About Team Update' },
        { path: 'aboutteam-create', loadComponent: () => import('./adminCompoents/aboutteam-create/aboutteam-create.component').then(m => m.AboutteamCreateComponent), canActivate: [authGuardGuard], title: 'About Team Create' },

         
        { path: 'price', loadComponent: () => import('./adminCompoents/price-ad/price-ad.component').then(m => m.PriceAdComponent), canActivate: [authGuardGuard], title: 'Price' },
        { path: 'price-update/:id', loadComponent: () => import('./adminCompoents/price-update/price-update.component').then(m => m.PriceUpdateComponent), canActivate: [authGuardGuard], title: 'Price Update' },
        { path: 'price-create', loadComponent: () => import('./adminCompoents/price-create/price-create.component').then(m => m.PriceCreateComponent), canActivate: [authGuardGuard], title: 'Price Create' },


        { path: 'faq', loadComponent: () => import('./adminCompoents/faq-ad/faq-ad.component').then(m => m.FaqAdComponent), canActivate: [authGuardGuard], title: 'FAQ' },
        { path: 'faq-update/:id', loadComponent: () => import('./adminCompoents/faq-update/faq-update.component').then(m => m.FaqUpdateComponent), canActivate: [authGuardGuard], title: 'FAQ Update' },
        { path: 'faq-create', loadComponent: () => import('./adminCompoents/faq-craete/faq-craete.component').then(m => m.FaqCraeteComponent), canActivate: [authGuardGuard], title: 'FAQ Create' },

        { path: 'brandsimages', loadComponent: () => import('./adminCompoents/brandimage-ad/brandimage-ad.component').then(m => m.BrandimageAdComponent), canActivate: [authGuardGuard], title: 'Brands Images' },
        { path: 'brandsimages-create', loadComponent: () => import('./adminCompoents/brandimage-create/brandimage-create.component').then(m => m.BrandimageCreateComponent), canActivate: [authGuardGuard], title: 'Brands Images Create' },

        

        { path: 'about-update', loadComponent: () => import('./adminCompoents/about-update/about-update.component').then(m => m.UpdateAboutComponent), canActivate: [authGuardGuard], title: 'About-update' },

        { path: 'social-update', loadComponent: () => import('./adminCompoents/social-update/social-update.component').then(m => m.SocialUpdateComponent), canActivate: [authGuardGuard], title: 'Social-update' },

        { path: 'service-update', loadComponent: () => import('./adminCompoents/service-update/service-update.component').then(m => m.ServiceUpdateComponent), canActivate: [authGuardGuard], title: 'Service-update' },

        { path: 'home-update', loadComponent: () => import('./adminCompoents/home-update/home-update.component').then(m => m.HomeUpdateComponent), canActivate: [authGuardGuard], title: 'Home-update' },

        { path: 'contact-update', loadComponent: () => import('./adminCompoents/contact-update/contact-update.component').then(m => m.ContactUpdateComponent), canActivate: [authGuardGuard], title: 'Contact-update' },


  
        { path: '', redirectTo: 'tours', pathMatch: 'full' },
        { path: '**', redirectTo: 'tours' },
      ]
    },
    { path: '**', loadComponent: () => import('./clientComponents/notfound/notfound.component').then(m => m.NotfoundComponent), title: 'Not Found Page' }
  ];
  