import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ICareer } from '../../core/interfaces/icareer';
import { Subscription, takeUntil } from 'rxjs';
import { CareerService } from '../../core/services/career.service';
import { CommonModule, DatePipe } from '@angular/common';
import e from 'express';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [DatePipe,CommonModule,TranslatedPipe],
  templateUrl: './career.component.html',
  styleUrl: './career.component.css'
})
export class CareerComponent extends ReloadableComponent {
  private readonly careerService = inject(CareerService);
  careerData: WritableSignal<ICareer[] | null> = signal([]);
  private readonly meta=inject(Meta);
  private readonly title=inject(Title);

    ngOnInit(): void {
    this.loadData();
    this.onReload(() => this.loadData());
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
    
      // 🔹 Title (Brand + Career)
      this.title.setTitle(
        'Join BBESocial | Careers in Customer Service & Support for E-commerce Brands'
      );
    
      // 🔹 Meta Description (SEO + Conversion)
      this.meta.updateTag({
        name: 'description',
        content:
          'Explore career opportunities at BBESocial! Join our dynamic team as a Customer Service Agent or Team Leader and help e-commerce brands deliver exceptional customer experiences. Competitive salaries, full-time positions, and growth opportunities await.'
      });
    
      // 🔹 Keywords (Relevant & Clean)
      this.meta.updateTag({
        name: 'keywords',
        content:
          'BBESocial careers, customer service jobs, e-commerce support jobs, customer support agent, customer support team leader, join BBESocial, work in customer service, full-time customer service roles'
      });
    
      // 🔹 Open Graph (Social Sharing + Branding)
      this.meta.updateTag({
        property: 'og:title',
        content: 'Careers at BBESocial | Customer Service & Support Jobs'
      });
      this.meta.updateTag({
        property: 'og:description',
        content:
          'Join BBESocial and build a rewarding career in customer service. We are hiring Customer Service Agents and Team Leaders to provide exceptional support to e-commerce brands.'
      });
      this.meta.updateTag({ property: 'og:type', content: 'website' });
      this.meta.updateTag({ property: 'og:url', content: 'https://bbesocial.com/career' });
      this.meta.updateTag({
        property: 'og:image',
        content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
      });
    
      // 🔹 Twitter Card
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({
        name: 'twitter:title',
        content: 'Careers at BBESocial | Customer Service & Support Jobs'
      });
      this.meta.updateTag({
        name: 'twitter:description',
        content:
          'Join BBESocial and build a rewarding career in customer service. We are hiring Customer Service Agents and Team Leaders to provide exceptional support to e-commerce brands.'
      });
      this.meta.updateTag({
        name: 'twitter:image',
        content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
      });
    
      // 🔹 Canonical URL
      this.meta.updateTag({ rel: 'canonical', href: 'https://bbesocial.com/career' });
    }
    
  // ========================
  // Load Career Data
  // ============= ===========
  
  loadData() {
 this.careerService.getCareerData()
 .pipe(takeUntil(this.destroy$))
 .subscribe({
   next: (res) => {
     this.careerData.set(res);
  
   },
   error: (err: HttpErrorResponse) => {
     console.log(err.message);
   }
 });
  } 

}
