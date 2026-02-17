import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SocailelemntsService } from '../../core/services/socailelemnts.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../core/environments/environments';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-social-update',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './social-update.component.html',
  styleUrl: './social-update.component.css'
})
export class SocialUpdateComponent {
  private readonly toaster = inject(ToastrService);
  private readonly socialService = inject(SocailelemntsService);
    private readonly router = inject(Router);
  

  socialForm: FormGroup;

  // Image handling
  currentImage: string | null = null;
  newImagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder) {
    this.socialForm = this.fb.group({
      facebookUrl: ['', Validators.required],
      instagramUrl: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadSocialData();
  }

  // ================= Load Data =================
  loadSocialData() {
    this.socialService.getSocailData().subscribe(res => {

      console.log('Loaded Social Data:', res);

      this.socialForm.patchValue({
        facebookUrl: res.facebookUrl,
        instagramUrl: res.instagramUrl,
        email: res.email
      });

      this.currentImage = res.logo
        ? `${environment.BaseUrl}/${res.logo}`
        : null;
    });
  }

  // ================= Image Handling =================
  onFileSelected(event: any) {
    if (!event.target.files?.length) return;

    this.selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => this.newImagePreview = reader.result;
    if (this.selectedFile){
    reader.readAsDataURL(this.selectedFile);
  }}

  removeNewImage() {
    this.selectedFile = null;
    this.newImagePreview = null;
    this.fileInput.nativeElement.value = '';
  }

  // ================= Submit =================
  onSubmit() {
    console.log('current iamge:', this.currentImage);
    if (this.socialForm.invalid) {
      this.toaster.error('Please fill all required fields correctly', 'Validation Error');
      return;
    }

    const formData = new FormData();

    formData.append('FacebookUrl', this.socialForm.value.facebookUrl);
    formData.append('InstagramUrl', this.socialForm.value.instagramUrl);
    formData.append('Email', this.socialForm.value.email);

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.socialService.updateSocailData(formData).subscribe({
      next: () => {
        this.toaster.success('Social elements updated successfully', 'Success');
        this.router.navigate(['/admin/social-update']); // Navigate back to list or details page
        this.loadSocialData(); // refresh
      },
      error: (err: HttpErrorResponse) => {
        this.toaster.error('Error updating Social elements', 'Error');
      }
    });
  }
}