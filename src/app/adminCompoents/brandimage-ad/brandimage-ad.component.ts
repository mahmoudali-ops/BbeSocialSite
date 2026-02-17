import { Component, inject, signal, WritableSignal } from '@angular/core';
import { IBrandImage } from '../../core/interfaces/ibrandimage';
import { BrandiamgesService } from '../../core/services/brandiamges.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-brandimage-ad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brandimage-ad.component.html',
  styleUrl: './brandimage-ad.component.css'
})
export class BrandimageAdComponent {

  private readonly BrandiamgesService = inject(BrandiamgesService);
      Data: WritableSignal<IBrandImage[] > = signal([]);
      dataSUbs:WritableSignal<Subscription|null>=signal(null);
      private readonly toastr = inject(ToastrService);

  
      LoadData():void{

        this.dataSUbs.set(
          this.BrandiamgesService.getBrandsImageData().subscribe({
            next: (res) => {
              this.Data.set(res);
    
          // مهم لعرض عدد الصفحات
            },
            error: (err: HttpErrorResponse) => console.log(err)
          })
        );  
      };
    ngOnInit(): void {
  
      this.LoadData();
  
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
          this.BrandiamgesService.deleteImage(id).subscribe({
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

    selectedFile: File | null = null;
    previewUrl: string | null = null;
    
    onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
    
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
    
    clearImage(fileInput: HTMLInputElement) {
      this.selectedFile = null;
      this.previewUrl = null;
      fileInput.value = ''; // مهم عشان يصفر الاختيار
    }
    

uploadImage():void{


  if (!this.selectedFile) {
    this.toastr.warning('Please select an image first');
    return;
  }

  const formData = new FormData();
  formData.append('ImageFile', this.selectedFile); 
  // ⚠️ خليه نفس اسم البراميتر في الـ API (لو اسمه Image غيره هنا)

  this.BrandiamgesService.AddImages(formData).subscribe({

    next: (res) => {
      this.toastr.success('Image uploaded successfully');
      this.LoadData();

      // Reset
      this.selectedFile = null;
      this.previewUrl = null;
    },

    error: (err) => {
      console.error(err);
      this.toastr.error('Something went wrong while uploading');
    }

  });
}
}
