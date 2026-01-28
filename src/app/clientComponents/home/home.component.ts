import {  ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, Inject, inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Router, RouterLink } from "@angular/router";
import { Subscription, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TermtextPipe } from '../../core/pipes/termtext.pipe';
import { CommonModule, isPlatformBrowser, NgClass } from '@angular/common';
import { ClientFooterComponent } from "../client-footer/client-footer.component";
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { ReloadService } from '../../core/services/reload.service';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { Meta, Title } from '@angular/platform-browser';
import { BrandiamgesService } from '../../core/services/brandiamges.service';
import { IBrandImage } from '../../core/interfaces/ibrandimage';
import { PriceService } from '../../core/services/price.service';
import { IPrice } from '../../core/interfaces/iprice';



register();
interface Testimonial {
  name: string;
  image: string;
  review: string;
  rating: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule,TranslatedPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],   // ← ← المهم هنا

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  extends ReloadableComponent {
  
 constructor(
    ReloadService:ReloadService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
      super(ReloadService);
    }

    
  isBrowser = isPlatformBrowser(this.platformId);


  private readonly router=inject(Router);
  private readonly meta=inject(Meta);
  private readonly title=inject(Title);


  // AllPopularToursList:WritableSignal<ITour[]>=signal([]);  
  // TourSUbs:WritableSignal<Subscription|null>=signal(null);

  // PopularDestanion:WritableSignal<IDestnation[]>=signal([]);
  // destnationSUbs:WritableSignal<Subscription|null>=signal(null);

  // AllPopularHurghadaCat:WritableSignal<ICatTour[]>=signal([]);  
  // HurghdadaCatSbss:WritableSignal<Subscription|null>=signal(null);

        private readonly brandimagesservice=inject(BrandiamgesService);
        BarndsImagesData:WritableSignal<IBrandImage[]>=signal([]);  
        BarndsImagesSUbs:WritableSignal<Subscription|null>=signal(null);

          private readonly priceService=inject(PriceService);
            AllPrices:WritableSignal<IPrice[]>=signal([]);  
            PricesSUbs:WritableSignal<Subscription|null>=signal(null);
  
  ngOnInit(): void {
   // this.LoadData();
   // this.onReload(() => this.LoadData());
   // this.LoadDataSeo();

    this.loadBrandsImages();
    this.loadPrices();
    this.onReload(() => this.loadBrandsImages())
    this.onReload(() => this.loadPrices())

    

   
   }

  //  LoadDataSeo(){
  //   this.meta.removeTag("name='description'");
  //   this.meta.removeTag("name='keywords'");
  
  //   // 🔹 Title (Brand + Location + Service)
  //   this.title.setTitle(
  //     'BbeSocial | customer support agency for e-commerce brands'
  //   );
  
  //   // 🔹 Meta Description (Conversion + SEO)
  //   this.meta.updateTag({
  //     name: 'description',
  //     content:
  //       'Top Picks Travels is a trusted travel agency in Hurghada offering unforgettable tours, excursions, desert safaris, snorkeling trips, and private transfers across Egypt. Book your perfect holiday experience today.'
  //   });
  
  //   // 🔹 Keywords (Strong but not spammy)
  //   this.meta.updateTag({
  //     name: 'keywords',
  //     content:
  //       'Hurghada tours, Egypt excursions, Red Sea activities, Hurghada travel agency, desert safari Hurghada, snorkeling trips Egypt, Egypt day tours, Top Picks Travels'
  //   });
  
  //   // 🔹 Open Graph (Social + SEO Boost)
  //   this.meta.updateTag({ property: 'og:title', content: 'Top Picks Travels | Hurghada Tours & Egypt Excursions' });
  //   this.meta.updateTag({ property: 'og:description', content: 'Book the best tours, excursions, and Red Sea activities in Hurghada with Top Picks Travels. Trusted local travel experts.' });
  //   this.meta.updateTag({ property: 'og:type', content: 'website' });
  //   this.meta.updateTag({ property: 'og:url', content: 'https://toppickstravels.com/' });
  //   this.meta.updateTag({ property: 'og:image', content: 'https://toppickstravels.com/assets/images/toppicktravel-removebg-preview2.png' });
  //  };
  //  LoadData() {
  //   this.destnationservice.getAllDestnation()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: res => this.PopularDestanion.set(res.data),
  //       error: err => console.log(err.message)
  //     });
  
  //   this.TourService.getAllTours()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: res => this.AllPopularToursList.set(res.data),
  //       error: err => console.log(err.message)
  //     });
  
  //   this.CattourService.getAllCAtegorytours()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: res => this.AllPopularHurghadaCat.set(res.data),
  //       error: err => console.log(err.message)
  //     });
  // }
  // ;

  @ViewChild('swiper', { static: false }) swiperEl!: ElementRef;


ngAfterViewInit() {
}

primaryColor = '#f14c05';

skills = [
  { title: 'Pre-sales support', percent: 94 },
  { title: 'Multilingual support', percent: 91 },
  { title: 'E-Comm operations', percent: 94 },
  { title: 'Solve customer issues', percent: 84 },
];

services = [
  'E-mail Handling',
  'Resolve Klarna issues',
  'PayPal troubleshooting issues',
  'Live chat agents'
];

testimonials: Testimonial[] = [
  {
    name: 'Ahmed Ali',
    image: 'assets/images/person-m-7.webp',
    review: 'Amazing service and a wonderful experience. I highly recommend it to everyone looking for quality service.',
    rating: 5
  },
  {
    name: 'Sara Mohamed',
    image: 'assets/images/person-f-5.webp',
    review: 'I am extremely satisfied with the support and guidance provided. Truly excellent!',
    rating: 4
  },
  {
    name: 'Omar Khaled',
    image: 'assets/images/person-m-12.webp',
    review: 'Professional, friendly, and reliable. They went above and beyond my expectations.',
    rating: 5
  },
  {
    name: 'Lina Adel',
    image: 'assets/images/person-f-12.webp',
    review: 'The team is amazing! Everything was smooth and enjoyable from start to finish.',
    rating: 5
  }
];

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

        loadPrices() {
          this.priceService.getAllDestnation()
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


}