import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CareerService } from '../../core/services/career.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-career-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './career-create.component.html',
  styleUrl: './career-create.component.css'
})
export class CareerCreateComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly careerService = inject(CareerService);

  languages = ['en','ar','de','hl']; // اللغات

  selectedLang: string = 'en'; // 👈 ضيف السطر ده

  careerForm!: FormGroup;
  formErrors: { label: string; lang?: string }[] = [];

  selectedFile: File | null = null;
  newImagePreview: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.careerForm = this.buildForm();
  }

  // =========================
  // Form Builder
  // =========================
  private buildForm(): FormGroup {
    return this.fb.group({
      careerCardTranslations: this.fb.array(this.languages.map(lang => this.createTranslationGroup(lang)))
    });
  }

  private createTranslationGroup(lang: string): FormGroup {
    return this.fb.group({
      language: [lang],
      jobTitle: ['', Validators.required],
      employmentType: ['', Validators.required],
      salaryFrom: [0, Validators.required],
      salaryTo: [0, Validators.required],
      salaryPeriod: ['Per Month', Validators.required],
      description: ['', Validators.required]
    });
  }

  get careerCardTranslations(): FormArray {
    return this.careerForm.get('careerCardTranslations') as FormArray;
  }

  getTranslationGroup(index: number): FormGroup {
    return this.careerCardTranslations.at(index) as FormGroup;
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
    this.careerCardTranslations.controls.forEach((group, index) => {
      const g = group as FormGroup;
      this.languages.forEach((lang, i) => {
        if (g.get('jobTitle')?.invalid) this.formErrors.push({ label: 'Job Title', lang });
        if (g.get('employmentType')?.invalid) this.formErrors.push({ label: 'Employment Type', lang });
        if (g.get('salaryFrom')?.invalid) this.formErrors.push({ label: 'Salary From', lang });
        if (g.get('salaryTo')?.invalid) this.formErrors.push({ label: 'Salary To', lang });
        if (g.get('salaryPeriod')?.invalid) this.formErrors.push({ label: 'Salary Period', lang });
        if (g.get('description')?.invalid) this.formErrors.push({ label: 'Description', lang });
      });
    });
  }

  // =========================
  // Submit
  // =========================
  // في الـ career-create.component.ts
onSubmit() {
  this.buildErrorSummary();

  if (this.careerForm.invalid) {
    this.toaster.error('Please complete all required fields', 'Validation Error');
    return;
  }

  const formData = new FormData();

  // بدلاً من إرسال JSON string، أرسل كل ترجمة كحقل منفصل
  const translations = this.careerCardTranslations.value;
  
  translations.forEach((translation: any, index: number) => {
    formData.append(`careerCardTranslations[${index}].Language`, translation.language);
    formData.append(`careerCardTranslations[${index}].JobTitle`, translation.jobTitle);
    formData.append(`careerCardTranslations[${index}].EmploymentType`, translation.employmentType);
    formData.append(`careerCardTranslations[${index}].SalaryFrom`, translation.salaryFrom.toString());
    formData.append(`careerCardTranslations[${index}].SalaryTo`, translation.salaryTo.toString());
    formData.append(`careerCardTranslations[${index}].SalaryPeriod`, translation.salaryPeriod);
    formData.append(`careerCardTranslations[${index}].Description`, translation.description);
  });

  if (this.selectedFile) {
    formData.append('ImageFile', this.selectedFile);
  }

  this.careerService.createCareer(formData).subscribe({
    next: () => {
      this.toaster.success('Career created successfully', 'Success');
      this.careerForm.reset();
      this.router.navigate(['/admin/career']);
    },
    error: (err) => {
      console.error('Error:', err);
      this.toaster.error('Error creating career', 'Error');
    }
  });
}
}