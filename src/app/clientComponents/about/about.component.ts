import { AboutteamService } from './../../core/services/aboutteam.service';
import { AboutService } from './../../core/services/about.service';
import { Meta, Title } from '@angular/platform-browser';
import { TranslatedPipe } from './../../core/pipes/translate.pipe';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { IAbout } from '../../core/interfaces/iabout';
import { Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { HttpErrorResponse } from '@angular/common/http';
import { IAboutTeam } from '../../core/interfaces/iaboutteam';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslatedPipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent extends ReloadableComponent {

    private readonly AboutService = inject(AboutService);
    private readonly AboutteamService = inject(AboutteamService);

    aboutdataData: WritableSignal<IAbout | null> = signal(null);

    aboutteamData: WritableSignal<IAboutTeam[] | null> = signal([]);


    private readonly meta=inject(Meta);
    private readonly title=inject(Title);


      ngOnInit(): void {
      this.loadData();
      this.onReload(() => this.loadData())
      this.loadTeamData();
      this.onReload(() => this.loadTeamData())
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
      
        // 🔹 Title (Brand + About)
        this.title.setTitle(
          'About Us | BBESocial - Customer Service Experts for E-commerce Brands'
        );
      
        // 🔹 Meta Description (SEO + Conversion)
        this.meta.updateTag({
          name: 'description',
          content:
            'Learn about BBESocial, a professional customer service agency dedicated to helping e-commerce brands deliver exceptional support experiences. Meet our experienced team and discover our mission to elevate customer satisfaction.'
        });
      
        // 🔹 Keywords (Relevant & Clean)
        this.meta.updateTag({
          name: 'keywords',
          content:
            'BBESocial, about us, customer service agency, e-commerce support, customer support team, professional service, experienced team'
        });
      
        // 🔹 Open Graph (Social Sharing + Branding)
        this.meta.updateTag({
          property: 'og:title',
          content: 'About BBESocial | Customer Service Experts for E-commerce Brands'
        });
        this.meta.updateTag({
          property: 'og:description',
          content:
            'Discover BBESocial and our mission to provide top-notch customer support solutions for e-commerce brands. Learn about our team and expertise.'
        });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ property: 'og:url', content: 'https://bbesocial.com/about' });
        this.meta.updateTag({
          property: 'og:image',
          content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
        });
      
        // 🔹 Twitter Card
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({
          name: 'twitter:title',
          content: 'About BBESocial | Customer Service Experts for E-commerce Brands'
        });
        this.meta.updateTag({
          name: 'twitter:description',
          content:
            'Discover BBESocial and our mission to provide top-notch customer support solutions for e-commerce brands. Learn about our team and expertise.'
        });
        this.meta.updateTag({
          name: 'twitter:image',
          content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
        });
      
        // 🔹 Canonical URL
        this.meta.updateTag({ rel: 'canonical', href: 'https://bbesocial.com/about' });
      }
      
    // ========================
    // Load About Data
    // ========================
    loadData() {
      this.AboutService.getAboutData()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              this.aboutdataData.set(res);
           
            },
            error: (err: HttpErrorResponse) => {
              console.log(err.message);
            }
          });
    }

    // ========================
    // Load About Team Data
    // ========================
    loadTeamData() {
      this.AboutteamService.getaboutteamData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.aboutteamData.set(res);
        },
        error: (err: HttpErrorResponse) => {
          console.log("error is ",err.message);
        }
      });
    }



}
