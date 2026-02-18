import { Component, inject, signal, WritableSignal } from '@angular/core';
import { IFaq } from '../../core/interfaces/ifaq';
import { Subscription, takeUntil } from 'rxjs';
import { FaqService } from '../../core/services/faq.service';
import { CommonModule } from '@angular/common';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule,TranslatedPipe],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent  extends ReloadableComponent   {
  faqData: WritableSignal<IFaq[]|null> = signal([]);
  faqSUbs: WritableSignal<Subscription | null> = signal(null);
  private readonly meta=inject(Meta);
  private readonly title=inject(Title);

private readonly faqService = inject(FaqService);

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
  
    // 🔹 Title (Brand + FAQ)
    this.title.setTitle(
      'FAQ | BBESocial - Customer Service & Support Questions'
    );
  
    // 🔹 Meta Description (SEO + Conversion)
    this.meta.updateTag({
      name: 'description',
      content:
        'Find answers to common questions about BBESocial’s customer service solutions. Learn how we help e-commerce brands provide exceptional support and enhance customer satisfaction.'
    });
  
    // 🔹 Keywords (Relevant & Clean)
    this.meta.updateTag({
      name: 'keywords',
      content:
        'BBESocial FAQ, customer service questions, e-commerce support, common inquiries, customer support help, BBESocial support answers'
    });
  
    // 🔹 Open Graph (Social Sharing + Branding)
    this.meta.updateTag({
      property: 'og:title',
      content: 'FAQ | BBESocial - Customer Service & Support Questions'
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Get answers to frequently asked questions about BBESocial’s customer service solutions and discover how we support e-commerce brands in delivering exceptional customer experiences.'
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'https://bbesocial.com/faq' });
    this.meta.updateTag({
      property: 'og:image',
      content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
    });
  
    // 🔹 Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({
      name: 'twitter:title',
      content: 'FAQ | BBESocial - Customer Service & Support Questions'
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content:
        'Get answers to frequently asked questions about BBESocial’s customer service solutions and discover how we support e-commerce brands in delivering exceptional customer experiences.'
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
    });
  
    // 🔹 Canonical URL
    this.meta.updateTag({ rel: 'canonical', href: 'https://bbesocial.com/faq' });
  }
  
  // ========================
  // Load FAQ Data
  // ========================
  loadData() {
      this.faqService.getFaqData()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              this.faqData.set(res);
           
            },
            error: (err: HttpErrorResponse) => {
              console.log(err.message);
            }
          });
  }


  activeIndex: number = -1;

  toggleFaq(index: number) {
    this.activeIndex = this.activeIndex === index ? -1 : index;
  }
  
  

}
