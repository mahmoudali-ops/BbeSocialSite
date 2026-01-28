import { Component, HostListener, inject, OnInit, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { TranslationService } from '../../core/services/translation.service';
import e from 'express';

@Component({
  selector: 'app-client-nav',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,TranslatedPipe],
  templateUrl: './client-nav.component.html',
  styleUrl: './client-nav.component.css'
})
export class ClientNavComponent implements OnInit {
  isBrowser = typeof window !== 'undefined';

  isScrolled = false;
  isOffcanvasOpen = false;
  activeDropdown: string | null = null;
  private readonly render2=inject(RendererFactory2).createRenderer(null,null);
  private readonly platid=inject(PLATFORM_ID);


  constructor(
    private langService: LanguageService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.onWindowScroll();
  }

  // Scroll
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser) return;

    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop || 0;

    this.isScrolled = scrollPosition > 50;
  }

  // Toggle Offcanvas
  toggleOffcanvas(): void {
    this.isOffcanvasOpen = !this.isOffcanvasOpen;

    if (this.isOffcanvasOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      this.resetBody();
      this.activeDropdown = null;
    }
  }

  closeOffcanvas(): void {
    this.isOffcanvasOpen = false;
    this.resetBody();
    this.activeDropdown = null;
  }

  private resetBody(): void {
    document.documentElement.style.overflow = '';
  }

  // Dropdown
  toggleDropdown(event: Event, dropdownName: string): void {
    event.preventDefault();
    event.stopPropagation();

    this.activeDropdown =
      this.activeDropdown === dropdownName ? null : dropdownName;
  }

  // ESC
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOffcanvasOpen) {
      this.closeOffcanvas();
    }
  }

  // Language
  changeLang(lang: 'en' | 'de' | 'hl'|'ar'): void {
    this.langService.setLanguage(lang);
    this.translationService.setLang(lang);
    this.changeDir();
  }

  changeDir():void{
    let currentLang =localStorage.getItem('lang');
    if(currentLang==='ar'){
      this.render2.setAttribute(document.documentElement,'lang','ar');
      this.render2.setAttribute(document.documentElement,'dir','rtl');
    }
    if(currentLang==='en' || currentLang==='de' || currentLang==='hl'){
      this.render2.setAttribute(document.documentElement,'lang',currentLang!);
      this.render2.setAttribute(document.documentElement,'dir','ltr');
    }
   
  }


  
}