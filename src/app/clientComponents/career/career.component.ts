import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ICareer } from '../../core/interfaces/icareer';
import { Subscription, takeUntil } from 'rxjs';
import { CareerService } from '../../core/services/career.service';
import { CommonModule, DatePipe } from '@angular/common';
import e from 'express';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';

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

    ngOnInit(): void {
    this.loadData();
    this.onReload(() => this.loadData())
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
