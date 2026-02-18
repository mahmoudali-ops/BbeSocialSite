import { Component, Inject, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { PriceService } from '../../core/services/price.service';
import { IPrice } from '../../core/interfaces/iprice';
import { Subscription, takeUntil } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule,TranslatedPipe],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent  extends ReloadableComponent   {

 // constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private readonly priceService=inject(PriceService);
    AllPrices:WritableSignal<IPrice[]>=signal([]);  
    PricesSUbs:WritableSignal<Subscription|null>=signal(null);
    private readonly meta=inject(Meta);
    private readonly title=inject(Title);

    ngOnInit(): void {
      this.LoadData();
      this.onReload(() => this.LoadData())
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
      
        // 🔹 Title (Brand + Pricing)
        this.title.setTitle(
          'Pricing Plans | BBESocial - Customer Service & Support Packages'
        );
      
        // 🔹 Meta Description (SEO + Conversion)
        this.meta.updateTag({
          name: 'description',
          content:
            'Explore BBESocial’s flexible pricing plans for customer service and support. Choose the right package to enhance your e-commerce brand’s customer support experience with email, live chat, call support, and multilingual solutions.'
        });
      
        // 🔹 Keywords (Relevant & Clean)
        this.meta.updateTag({
          name: 'keywords',
          content:
            'BBESocial pricing, customer service packages, support plans, e-commerce support pricing, live chat support, call center services, email support, multilingual customer service'
        });
      
        // 🔹 Open Graph (Social Sharing + Branding)
        this.meta.updateTag({
          property: 'og:title',
          content: 'Pricing Plans | BBESocial - Customer Service & Support Packages'
        });
        this.meta.updateTag({
          property: 'og:description',
          content:
            'Discover BBESocial’s pricing plans for professional customer service solutions. Enhance your e-commerce brand’s support with our tailored packages.'
        });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ property: 'og:url', content: 'https://bbesocial.com/pricing' });
        this.meta.updateTag({
          property: 'og:image',
          content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
        });
      
        // 🔹 Twitter Card
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({
          name: 'twitter:title',
          content: 'Pricing Plans | BBESocial - Customer Service & Support Packages'
        });
        this.meta.updateTag({
          name: 'twitter:description',
          content:
            'Discover BBESocial’s pricing plans for professional customer service solutions. Enhance your e-commerce brand’s support with our tailored packages.'
        });
        this.meta.updateTag({
          name: 'twitter:image',
          content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
        });
      
        // 🔹 Canonical URL
        this.meta.updateTag({ rel: 'canonical', href: 'https://bbesocial.com/pricing' });
      }
      
      LoadData() {
        this.priceService.getAllPrice()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.AllPrices.set(res);
         
          },
          error: (err: HttpErrorResponse) => {
            console.log(err.message);
          }
        });
    }



    // scrollToPlans() {
    //   if (isPlatformBrowser(this.platformId)) {
    //     const element = document.getElementById('pricingPlans');
    //     element?.scrollIntoView({ behavior: 'smooth' });
    //   }
    
}
