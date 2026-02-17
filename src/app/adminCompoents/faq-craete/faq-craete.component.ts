import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FaqService } from '../../core/services/faq.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq-craete',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './faq-craete.component.html',
  styleUrl: './faq-craete.component.css'
})
export class FaqCraeteComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly faqService = inject(FaqService);

  languages = ['en', 'ar', 'de', 'hl']; // اللغات المتاحة

  selectedLang: string = 'en';

  faqForm!: FormGroup;
  formErrors: { label: string; lang?: string }[] = [];

  selectedFile: File | null = null;
  newImagePreview: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.faqForm = this.buildForm();
  }

  // =========================
  // Form Builder
  // =========================
  private buildForm(): FormGroup {
    return this.fb.group({
      fAQsTranslationDTos: this.fb.array(
        this.languages.map(lang => this.createTranslationGroup(lang))
      )
    });
  }

  private createTranslationGroup(lang: string): FormGroup {
    return this.fb.group({
      language: [lang],
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }

  get fAQsTranslationDTos(): FormArray {
    return this.faqForm.get('fAQsTranslationDTos') as FormArray;
  }

  getTranslationGroup(index: number): FormGroup {
    return this.fAQsTranslationDTos.at(index) as FormGroup;
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
    this.fAQsTranslationDTos.controls.forEach((group) => {
      const g = group as FormGroup;
      const lang = g.get('language')?.value;
      
      if (g.get('question')?.invalid) this.formErrors.push({ label: 'Question', lang });
      if (g.get('answer')?.invalid) this.formErrors.push({ label: 'Answer', lang });
    });
  }

  // =========================
  // Submit
  // =========================
  onSubmit() {
    this.buildErrorSummary();

    if (this.faqForm.invalid) {
      this.toaster.error('Please complete all required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    const translations = this.fAQsTranslationDTos.value.map((t: any) => ({
      Language: t.language,
      Question: t.question,
      Answer: t.answer
    }));

    formData.append('TranslationsJson', JSON.stringify(translations));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.faqService.createFaq(formData).subscribe({
      next: () => {
        this.toaster.success('FAQ created successfully', 'Success');
        this.faqForm.reset();
        this.router.navigate(['/admin/faq']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.toaster.error('Error creating FAQ', 'Error');
      }
    });
  }
}