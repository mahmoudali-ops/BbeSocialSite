import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ServicefeatureService } from '../../core/services/servicefeature.service';
import { IServiceFeature } from '../../core/interfaces/iservicefeature';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-servicefeature-ad',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './servicefeature-ad.component.html',
  styleUrl: './servicefeature-ad.component.css'
})
export class ServicefeatureAdComponent {
 private readonly ServicefeatureService = inject(ServicefeatureService);
    Data: WritableSignal<IServiceFeature[] > = signal([]);
    dataSUbs:WritableSignal<Subscription|null>=signal(null);

  ngOnInit(): void {


    this.dataSUbs.set(
      this.ServicefeatureService.getContactData().subscribe({
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

  delete(id: number) {
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
        this.ServicefeatureService.deleteServiceFeature(id).subscribe({
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
