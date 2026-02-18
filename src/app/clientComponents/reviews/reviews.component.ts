import { Component, inject, OnInit } from '@angular/core';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [TranslatedPipe],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent  {

      private readonly meta=inject(Meta);
      private readonly title=inject(Title);


  OnInit(): void {
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

  // 🔹 Title (Brand + Reviews)
  this.title.setTitle(
    'Customer Reviews | BBESocial - Trusted E-commerce Support'
  );

  // 🔹 Meta Description (SEO + Conversion)
  this.meta.updateTag({
    name: 'description',
    content:
      'Read real customer reviews about BBESocial’s professional customer service solutions. See how we help e-commerce brands provide exceptional support and improve customer satisfaction.'
  });

  // 🔹 Keywords (Relevant & Clean)
  this.meta.updateTag({
    name: 'keywords',
    content:
      'BBESocial reviews, customer testimonials, customer feedback, e-commerce support reviews, professional customer service, client experiences, trusted support'
  });

  // 🔹 Open Graph (Social Sharing + Branding)
  this.meta.updateTag({
    property: 'og:title',
    content: 'Customer Reviews | BBESocial - Trusted E-commerce Support'
  });
  this.meta.updateTag({
    property: 'og:description',
    content:
      'Discover customer feedback and testimonials about BBESocial’s expert customer service. Learn how we enhance e-commerce brands’ support experiences.'
  });
  this.meta.updateTag({ property: 'og:type', content: 'website' });
  this.meta.updateTag({ property: 'og:url', content: 'https://bbesocial.com/reviews' });
  this.meta.updateTag({
    property: 'og:image',
    content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
  });

  // 🔹 Twitter Card
  this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  this.meta.updateTag({
    name: 'twitter:title',
    content: 'Customer Reviews | BBESocial - Trusted E-commerce Support'
  });
  this.meta.updateTag({
    name: 'twitter:description',
    content:
      'Discover customer feedback and testimonials about BBESocial’s expert customer service. Learn how we enhance e-commerce brands’ support experiences.'
  });
  this.meta.updateTag({
    name: 'twitter:image',
    content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
  });

  // 🔹 Canonical URL
  this.meta.updateTag({ rel: 'canonical', href: 'https://bbesocial.com/reviews' });
  }

}
