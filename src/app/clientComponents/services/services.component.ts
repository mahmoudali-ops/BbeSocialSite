import { Component, inject, signal, WritableSignal, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IServiceFeature } from '../../core/interfaces/iservicefeature';
import { Subscription, takeUntil } from 'rxjs';

import { ServicefeatureService } from '../../core/services/servicefeature.service';
import { CommonModule } from '@angular/common';
import { IServiceCore } from '../../core/interfaces/servicecore';
import { ServicecoreService } from '../../core/services/servicecore.service';
import { BrandiamgesService } from '../../core/services/brandiamges.service';
import { IBrandImage } from '../../core/interfaces/ibrandimage';
import { register } from 'swiper/element/bundle';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { Meta, Title } from '@angular/platform-browser';

register(); // مهم جداً لتفعيل web components

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule,TranslatedPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // ← مهم جدًا

  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent extends ReloadableComponent {

      private readonly serviceFeatureService=inject(ServicefeatureService);
      private readonly serviceCoreService=inject(ServicecoreService);
      private readonly brandimagesservice=inject(BrandiamgesService);

     ServiceFData:WritableSignal<IServiceFeature[]>=signal([]);  

      ServiceCData:WritableSignal<IServiceCore[]>=signal([]);  

      BarndsImagesData:WritableSignal<IBrandImage[]>=signal([]);  

          private readonly meta=inject(Meta);
          private readonly title=inject(Title);



      ngOnInit(): void {
        this.loadServiceFeatures();
        this.onReload(() => this.loadServiceFeatures())
        this.loadServiceCores();
        this.onReload(() => this.loadServiceCores())
        this.loadBrandsImages();
        this.onReload(() => this.loadBrandsImages())
        this.LoadDataSeo();
        }

        LoadDataSeo() {
          // 🔹 تنظيف أي meta قديم
          this.meta.removeTag("name='description'");
          this.meta.removeTag("name='keywords'");
          this.meta.removeTag("property='og:title'");
          this.meta.removeTag("property='og:description'");
          this.meta.removeTag("property='og:type'");
          this.meta.removeTag("property='og:url'");
          this.meta.removeTag("property='og:image'");
          this.meta.removeTag("name='twitter:card'");
          this.meta.removeTag("name='twitter:title'");
          this.meta.removeTag("name='twitter:description'");
          this.meta.removeTag("name='twitter:image'");
          this.meta.removeTag("rel='canonical'");
        
          // 🔹 Title (Brand + Services)
          this.title.setTitle(
            'Our Services | BBESocial - Customer Service & Support Solutions'
          );
        
          // 🔹 Meta Description (SEO + Conversion)
          this.meta.updateTag({
            name: 'description',
            content:
              'Explore BBESocial’s range of professional customer service solutions for e-commerce brands. From live chat and email support to call center and multilingual services, we help you deliver exceptional customer experiences.'
          });
        
          // 🔹 Keywords (Relevant & Clean)
          this.meta.updateTag({
            name: 'keywords',
            content:
              'BBESocial services, customer service solutions, e-commerce support, live chat support, email support, call center services, multilingual customer service, professional support'
          });
        
          // 🔹 Open Graph (Social Sharing + Branding)
          this.meta.updateTag({
            property: 'og:title',
            content: 'Our Services | BBESocial - Customer Service & Support Solutions'
          });
          this.meta.updateTag({
            property: 'og:description',
            content:
              'Discover BBESocial’s professional customer service solutions designed to enhance your e-commerce brand’s customer support. We provide live chat, email, call support, and multilingual services.'
          });
          this.meta.updateTag({ property: 'og:type', content: 'website' });
          this.meta.updateTag({ property: 'og:url', content: 'https://bbesocial.com/services' });
          this.meta.updateTag({
            property: 'og:image',
            content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
          });
        
          // 🔹 Twitter Card
          this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
          this.meta.updateTag({
            name: 'twitter:title',
            content: 'Our Services | BBESocial - Customer Service & Support Solutions'
          });
          this.meta.updateTag({
            name: 'twitter:description',
            content:
              'Discover BBESocial’s professional customer service solutions designed to enhance your e-commerce brand’s customer support. We provide live chat, email, call support, and multilingual services.'
          });
          this.meta.updateTag({
            name: 'twitter:image',
            content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
          });
        
          // 🔹 Canonical URL
          this.meta.updateTag({ rel: 'canonical', href: 'https://bbesocial.com/services' });
        }
        
       loadServiceFeatures() {
        this.serviceFeatureService.getContactData()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.ServiceFData.set(res);
         
          },
          error: (err: HttpErrorResponse) => {
            console.log(err.message);
          }
        });
      }

      loadServiceCores() {
        this.serviceCoreService.getContactData()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              this.ServiceCData.set(res);
           
            },
            error: (err: HttpErrorResponse) => {
              console.log(err.message);
            }
          });
      }

      loadBrandsImages() {
        this.brandimagesservice.getBrandsImageData()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.BarndsImagesData.set(res);
         
          },
          error: (err: HttpErrorResponse) => {
            console.log(err.message);
          }
        });
      }


      

}
