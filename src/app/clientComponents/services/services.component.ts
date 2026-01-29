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



      ngOnInit(): void {
        this.loadServiceFeatures();
        this.onReload(() => this.loadServiceFeatures())
        this.loadServiceCores();
        this.onReload(() => this.loadServiceCores())
        this.loadBrandsImages();
        this.onReload(() => this.loadBrandsImages())
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
