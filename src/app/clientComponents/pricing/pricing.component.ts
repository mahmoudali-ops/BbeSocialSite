import { Component, Inject, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { PriceService } from '../../core/services/price.service';
import { IPrice } from '../../core/interfaces/iprice';
import { Subscription, takeUntil } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';

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

    ngOnInit(): void {
      this.LoadData();
      this.onReload(() => this.LoadData())
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
