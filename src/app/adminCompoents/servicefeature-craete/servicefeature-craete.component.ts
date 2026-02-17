import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServicefeatureService } from '../../core/services/servicefeature.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-servicefeature-craete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './servicefeature-craete.component.html',
  styleUrl: './servicefeature-craete.component.css'
})
export class ServicefeatureCraeteComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly serviceFeatureService = inject(ServicefeatureService);

  languages = ['en', 'ar', 'de', 'hl']; // اللغات المتاحة

  selectedLang: string = 'en';

  serviceFeatureForm!: FormGroup;
  formErrors: { label: string; lang?: string }[] = [];

  selectedFile: File | null = null;
  newImagePreview: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.serviceFeatureForm = this.buildForm();
  }

  // =========================
  // Form Builder
  // =========================
  private buildForm(): FormGroup {
    return this.fb.group({
      servicesFeatureTranslationDtos: this.fb.array(
        this.languages.map(lang => this.createTranslationGroup(lang))
      )
    });
  }

  private createTranslationGroup(lang: string): FormGroup {
    return this.fb.group({
      language: [lang],
      title: ['', Validators.required],
      description: ['', Validators.required],
      includeFirst: ['', Validators.required],
      includeSecond: ['', Validators.required]
    });
  }

  get servicesFeatureTranslationDtos(): FormArray {
    return this.serviceFeatureForm.get('servicesFeatureTranslationDtos') as FormArray;
  }

  getTranslationGroup(index: number): FormGroup {
    return this.servicesFeatureTranslationDtos.at(index) as FormGroup;
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
    this.servicesFeatureTranslationDtos.controls.forEach((group) => {
      const g = group as FormGroup;
      const lang = g.get('language')?.value;
      
      if (g.get('title')?.invalid) this.formErrors.push({ label: 'Title', lang });
      if (g.get('description')?.invalid) this.formErrors.push({ label: 'Description', lang });
      if (g.get('includeFirst')?.invalid) this.formErrors.push({ label: 'Include First', lang });
      if (g.get('includeSecond')?.invalid) this.formErrors.push({ label: 'Include Second', lang });
    });
  }

  // =========================
  // Submit
  // =========================
  onSubmit() {
    this.buildErrorSummary();

    if (this.serviceFeatureForm.invalid) {
      this.toaster.error('Please complete all required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    const translations = this.servicesFeatureTranslationDtos.value.map((t: any) => ({
      Title: t.title,
      Language: t.language,
      Description: t.description,
      IncludeFirst: t.includeFirst,
      IncludeSecond: t.includeSecond
    }));

    formData.append('TranslationsJson', JSON.stringify(translations));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.serviceFeatureService.createServiceFeature(formData).subscribe({
      next: () => {
        this.toaster.success('Service Feature created successfully', 'Success');
        this.serviceFeatureForm.reset();
        this.router.navigate(['/admin/servicefeature']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.toaster.error('Error creating service feature', 'Error');
      }
    });
  }
}