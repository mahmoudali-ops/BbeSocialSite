import { Component, inject, signal, WritableSignal } from '@angular/core';
import { IFaq } from '../../core/interfaces/ifaq';
import { Subscription, takeUntil } from 'rxjs';
import { FaqService } from '../../core/services/faq.service';
import { CommonModule } from '@angular/common';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule,TranslatedPipe],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent  extends ReloadableComponent   {
  faqData: WritableSignal<IFaq | null> = signal(null);
  faqSUbs: WritableSignal<Subscription | null> = signal(null);

private readonly faqService = inject(FaqService);

  ngOnInit(): void {
    this.loadData();
    this.onReload(() => this.loadData())

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
