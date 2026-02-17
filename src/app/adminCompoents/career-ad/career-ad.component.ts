import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CareerService } from '../../core/services/career.service';
import { ICareer } from '../../core/interfaces/icareer';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-career-ad',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './career-ad.component.html',
  styleUrl: './career-ad.component.css'
})
export class CareerAdComponent implements OnInit , OnDestroy {

    private readonly careerService = inject(CareerService);
    careerData: WritableSignal<ICareer[] > = signal([]);
    careerSUbs:WritableSignal<Subscription|null>=signal(null);

  ngOnInit(): void {


    this.careerSUbs.set(
      this.careerService.getCareerData().subscribe({
        next: (res) => {
          this.careerData.set(res);

      // مهم لعرض عدد الصفحات
        },
        error: (err: HttpErrorResponse) => console.log(err)
      })
    );    
  }

  ngOnDestroy(): void {

    if(this.careerSUbs()){
      this.careerSUbs()?.unsubscribe();
    }
    
  }

  deleteCareer(id: number) {
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
        this.careerService.deleteCareer(id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'Destination has been deleted.',
              'success'
            );
            // لو عندك جدول أو قائمة رحلات، اعمل تحديث للقائمة
            this.careerData.set(this.careerData().filter(d=>d.id!=id)); // مثال
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
