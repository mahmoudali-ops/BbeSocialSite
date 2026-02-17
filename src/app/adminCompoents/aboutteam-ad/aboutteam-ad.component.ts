import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AboutteamService } from '../../core/services/aboutteam.service';
import { Subscription } from 'rxjs';
import { IAboutTeam } from '../../core/interfaces/iaboutteam';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-aboutteam-ad',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './aboutteam-ad.component.html',
  styleUrl: './aboutteam-ad.component.css'
})
export class AboutteamAdComponent {

  private readonly AboutteamService = inject(AboutteamService);
      Data: WritableSignal<IAboutTeam[] > = signal([]);
      dataSUbs:WritableSignal<Subscription|null>=signal(null);
  
    ngOnInit(): void {
  
  
      this.dataSUbs.set(
        this.AboutteamService.getaboutteamData().subscribe({
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
          this.AboutteamService.deleteaboutteam(id).subscribe({
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
