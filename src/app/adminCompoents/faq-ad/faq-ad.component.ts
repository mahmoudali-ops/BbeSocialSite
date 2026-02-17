import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FaqService } from '../../core/services/faq.service';
import { IFaq } from '../../core/interfaces/ifaq';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-faq-ad',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './faq-ad.component.html',
  styleUrl: './faq-ad.component.css'
})
export class FaqAdComponent {

  private readonly FaqService = inject(FaqService);
      Data:  WritableSignal<IFaq[]> = signal([]);
      dataSUbs:WritableSignal<Subscription|null>=signal(null);
  
    ngOnInit(): void {
  
  
      this.dataSUbs.set(
        this.FaqService.getFaqData().subscribe({
          next: (res) => {
            this.Data.set(res);
  
        // مهم لعرض عدد الصفحات
          },
          error: (err: HttpErrorResponse) => console.log(err)
        })
      );    
    }
  
    ngOnDestroy(): void {
  
      if(this.dataSUbs()){
        this.dataSUbs()?.unsubscribe();
      }
      
    }




    deleteFaq(id: number) {
                 Swal.fire({
                   title: 'Are you sure?',
                   text: "You won't be able to revert this!",
                   icon: 'warning',
                   showCancelButton: true,
                   confirmButtonColor: '#DD6B55',
                   cancelButtonColor: '#3085d6',
                   confirmButtonText: 'Yes, delete it!'
                 }).then((result) => {
                   if (result.isConfirmed) {
                     // هنا نعمل الحذف من API
                     this.FaqService.deleteFaq(id).subscribe({
                       next: () => {
                         Swal.fire(
                           'Deleted!',
                           'Destination has been deleted.',
                           'success'
                         );
                         // لو عندك جدول أو قائمة رحلات، اعمل تحديث للقائمة
                         this.Data.set(this.Data().filter(d=>d.id!=id)); // مثال
                       },
                       error: () => {
                         Swal.fire(
                           'Error!',
                           'There was a problem deleting the destination.',
                           'error'
                         );
                       }
                     });
                   }
                 });
               }
  
  

}
