import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HomeService } from './core/services/home.service';
import { SocailelemntsService } from './core/services/socailelemnts.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'TourSiteClient';

  dot!: HTMLElement;
  ring!: HTMLElement;

  ringX = 0;
  ringY = 0;

  constructor(
    private router: Router,
    private socailService: SocailelemntsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // لو عايز تتأكد انك على browser
    if (isPlatformBrowser(this.platformId)) {

      // تحميل الصفحة من service
      this.socailService.loadHomePage();

      // تتبع NavigationEnd
      this.router.events
        .pipe(
          filter((event): event is NavigationEnd => event instanceof NavigationEnd)
        )
        .subscribe((event) => {
          const fbq = (window as any)['fbq'];
          if (typeof fbq === 'function') {
            fbq('track', 'PageView');
          }

          const gtag = (window as any)['gtag'];
          if (typeof gtag === 'function') {
            gtag('config', 'AW-17847385347', {
              page_path: event.urlAfterRedirects
            });
          }
        });
    }
  }

  ngAfterViewInit(): void {
    // فقط للـ DOM elements
    this.dot = document.querySelector('.cursor-dot')!;
    this.ring = document.querySelector('.cursor-ring')!;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;

    this.ringX += (e.clientX - this.ringX) * 0.16;
    this.ringY += (e.clientY - this.ringY) * 0.16;

    this.ring.style.transform = `translate(${this.ringX - 30}px, ${this.ringY - 30}px)`;
  }
}
