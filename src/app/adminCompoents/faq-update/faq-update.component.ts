import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FaqService } from '../../core/services/faq.service';
import { environment } from '../../core/environments/environments';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './faq-update.component.html',
  styleUrl: './faq-update.component.css'
})
export class FaqUpdateComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);

  languages = ['en', 'ar', 'de', 'hl'];
  selectedLang: string = 'en';

  faqForm: FormGroup;
  faqId!: number;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private faqService: FaqService,
    private route: ActivatedRoute
  ) {
    this.faqForm = this.buildForm();
  }

  ngOnInit() {
    this.faqId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadFaq();
  }

  // =========================
  // Build Form
  // =========================
  private buildForm(): FormGroup {
    const translations: any = {};
    this.languages.forEach(lang => {
      translations[lang] = this.createTranslationGroup();
    });

    return this.fb.group({
      translations: this.fb.group(translations)
    });
  }

  private createTranslationGroup(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }

  getTranslationGroup(lang: string): FormGroup {
    return this.faqForm.get(['translations', lang]) as FormGroup;
  }

  // =========================
  // Load & Patch
  // =========================
  loadFaq() {
    this.faqService.getAllFaq(this.faqId).subscribe({
      next: (res) => {
        console.log('Loaded FAQ:', res);
        this.patchTranslations(res.fAQsTranslationDTos);

        if (res.imageCover) {
          this.imagePreview = res.imageCover
            ? `${environment.BaseUrl}/${res.imageCover}`
            : null;
        }

        if (res.fAQsTranslationDTos?.length) {
          this.selectedLang = res.fAQsTranslationDTos[0].language;
        }
      },
      error: (err) => {
        console.error('Error loading FAQ:', err);
        this.toaster.error('Error loading FAQ', 'Error');
      }
    });
  }

  private patchTranslations(translations: any[]) {
    this.languages.forEach(lang => {
      const tr = translations?.find((t: any) => t.language === lang);
      if (tr) {
        this.getTranslationGroup(lang).patchValue({
          question: tr.question ?? '',
          answer: tr.answer ?? ''
        });
      }
    });
  }

  // =========================
  // Image Handling
  // =========================
  onFileSelected(event: any) {
    if (!event.target.files?.length) return;
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    if (this.selectedFile) reader.readAsDataURL(this.selectedFile);
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';
  }

  // =========================
  // Submit Update
  // =========================
  onSubmit() {
    if (this.faqForm.invalid) {
      this.toaster.error('Please complete required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    const translations = this.languages.map(lang => {
      const tr = this.getTranslationGroup(lang).value;
      return {
        Language: lang,
        Question: tr.question,
        Answer: tr.answer
      };
    });

    formData.append('TranslationsJson', JSON.stringify(translations));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.faqService.updateFaq(this.faqId, formData).subscribe({
      next: () => {
        this.toaster.success('FAQ updated successfully', 'Success');
        this.router.navigate(['/admin/faq']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.toaster.error('Error updating FAQ', 'Error');
      }
    });
  }
}