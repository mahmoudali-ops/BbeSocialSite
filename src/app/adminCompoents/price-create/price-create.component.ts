import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PriceService } from '../../core/services/price.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './price-create.component.html',
  styleUrl: './price-create.component.css'
})
export class PriceCreateComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly priceService = inject(PriceService);

  languages = ['en', 'ar', 'de', 'hl']; // اللغات المتاحة

  selectedLang: string = 'en';

  priceForm!: FormGroup;
  formErrors: { label: string; lang?: string }[] = [];

  selectedFile: File | null = null;
  newImagePreview: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.priceForm = this.buildForm();
  }

  // =========================
  // Form Builder
  // =========================
  private buildForm(): FormGroup {
    return this.fb.group({
      priceTranlationDtos: this.fb.array(
        this.languages.map(lang => this.createTranslationGroup(lang))
      )
    });
  }

  private createTranslationGroup(lang: string): FormGroup {
    return this.fb.group({
      language: [lang],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      title: ['', [Validators.required, Validators.maxLength(250)]],
      description: ['', Validators.required],
      priceService: [0, [Validators.required, Validators.min(0)]],
      includeFirst: ['', Validators.required],
      includeSecond: ['', Validators.required],
      includeThird: ['', Validators.required],
      includeForth: ['', Validators.required]
    });
  }

  get priceTranlationDtos(): FormArray {
    return this.priceForm.get('priceTranlationDtos') as FormArray;
  }

  getTranslationGroup(index: number): FormGroup {
    return this.priceTranlationDtos.at(index) as FormGroup;
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
    this.priceTranlationDtos.controls.forEach((group) => {
      const g = group as FormGroup;
      const lang = g.get('language')?.value;
      
      if (g.get('discount')?.invalid) this.formErrors.push({ label: 'Discount', lang });
      if (g.get('title')?.invalid) this.formErrors.push({ label: 'Title', lang });
      if (g.get('description')?.invalid) this.formErrors.push({ label: 'Description', lang });
      if (g.get('priceService')?.invalid) this.formErrors.push({ label: 'Price', lang });
      if (g.get('includeFirst')?.invalid) this.formErrors.push({ label: 'Include First', lang });
      if (g.get('includeSecond')?.invalid) this.formErrors.push({ label: 'Include Second', lang });
      if (g.get('includeThird')?.invalid) this.formErrors.push({ label: 'Include Third', lang });
      if (g.get('includeForth')?.invalid) this.formErrors.push({ label: 'Include Forth', lang });
    });
  }

  // =========================
  // Submit
  // =========================
  onSubmit() {
    this.buildErrorSummary();

    if (this.priceForm.invalid) {
      this.toaster.error('Please complete all required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    const translations = this.priceTranlationDtos.value.map((t: any) => ({
      Language: t.language,
      Discount: t.discount,
      Title: t.title,
      Description: t.description,
      PriceService: t.priceService,
      IncludeFirst: t.includeFirst,
      IncludeSecond: t.includeSecond,
      IncludeThird: t.includeThird,
      IncludeForth: t.includeForth
    }));

    formData.append('TranslationsJson', JSON.stringify(translations));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.priceService.createPrice(formData).subscribe({
      next: () => {
        this.toaster.success('Price plan created successfully', 'Success');
        this.priceForm.reset();
        this.router.navigate(['/admin/price']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.toaster.error('Error creating price plan', 'Error');
      }
    });
  }
}