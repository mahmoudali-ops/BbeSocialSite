import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServicecoreService } from '../../core/services/servicecore.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicecore-craete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './servicecore-craete.component.html',
  styleUrl: './servicecore-craete.component.css'
})
export class ServicecoreCraeteComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly serviceCoreService = inject(ServicecoreService);

  languages = ['en', 'ar', 'de', 'hl']; // اللغات المتاحة

  selectedLang: string = 'en';

  serviceCoreForm!: FormGroup;
  formErrors: { label: string; lang?: string }[] = [];

  selectedFile: File | null = null;
  newImagePreview: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.serviceCoreForm = this.buildForm();
  }

  // =========================
  // Form Builder
  // =========================
  private buildForm(): FormGroup {
    return this.fb.group({
      serviceCoreTranlationDtos: this.fb.array(
        this.languages.map(lang => this.createTranslationGroup(lang))
      )
    });
  }

  private createTranslationGroup(lang: string): FormGroup {
    return this.fb.group({
      language: [lang],
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  get serviceCoreTranlationDtos(): FormArray {
    return this.serviceCoreForm.get('serviceCoreTranlationDtos') as FormArray;
  }

  getTranslationGroup(index: number): FormGroup {
    return this.serviceCoreTranlationDtos.at(index) as FormGroup;
  }

  // =========================
  // Image Handling
  // =========================
  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.newImagePreview = reader.result;
    reader.readAsDataURL(file);
  }

  removeNewImage() {
    this.selectedFile = null;
    this.newImagePreview = null;
    this.fileInput.nativeElement.value = '';
  }

  // =========================
  // Validation Summary
  // =========================
  buildErrorSummary() {
    this.formErrors = [];
    this.serviceCoreTranlationDtos.controls.forEach((group) => {
      const g = group as FormGroup;
      const lang = g.get('language')?.value;
      
      if (g.get('title')?.invalid) this.formErrors.push({ label: 'Title', lang });
      if (g.get('description')?.invalid) this.formErrors.push({ label: 'Description', lang });
    });
  }

  // =========================
  // Submit
  // =========================
  onSubmit() {
    this.buildErrorSummary();

    if (this.serviceCoreForm.invalid) {
      this.toaster.error('Please complete all required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    const translations = this.serviceCoreTranlationDtos.value.map((t: any) => ({
      Language: t.language,
      Title: t.title,
      Description: t.description
    }));

    formData.append('TranslationsJson', JSON.stringify(translations));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.serviceCoreService.createServiceCore(formData).subscribe({
      next: () => {
        this.toaster.success('Service Core created successfully', 'Success');
        this.serviceCoreForm.reset();
        this.router.navigate(['/admin/servicecore']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.toaster.error('Error creating service core', 'Error');
      }
    });
  }
}