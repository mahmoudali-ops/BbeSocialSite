import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PriceService } from '../../core/services/price.service';
import { environment } from '../../core/environments/environments';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './price-update.component.html',
  styleUrl: './price-update.component.css'
})
export class PriceUpdateComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);

  languages = ['en', 'ar', 'de', 'hl'];
  selectedLang: string = 'en';

  priceForm: FormGroup;
  priceId!: number;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private priceService: PriceService,
    private route: ActivatedRoute
  ) {
    this.priceForm = this.buildForm();
  }

  ngOnInit() {
    this.priceId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPrice();
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

  getTranslationGroup(lang: string): FormGroup {
    return this.priceForm.get(['translations', lang]) as FormGroup;
  }

  // =========================
  // Load & Patch
  // =========================
  loadPrice() {
    this.priceService.getAllDetaildPrice(this.priceId).subscribe({
      next: (res) => {
        console.log('Loaded Price Plan:', res);
        this.patchTranslations(res.priceTranlationDtos);

        if (res.imageCover) {
          this.imagePreview = res.imageCover
            ? `${environment.BaseUrl}/${res.imageCover}`
            : null;
        }

        if (res.priceTranlationDtos?.length) {
          this.selectedLang = res.priceTranlationDtos[0].language;
        }
      },
      error: (err) => {
        console.error('Error loading price plan:', err);
        this.toaster.error('Error loading price plan', 'Error');
      }
    });
  }

  private patchTranslations(translations: any[]) {
    this.languages.forEach(lang => {
      const tr = translations?.find((t: any) => t.language === lang);
      if (tr) {
        this.getTranslationGroup(lang).patchValue({
          discount: tr.discount ?? 0,
          title: tr.title ?? '',
          description: tr.description ?? '',
          priceService: tr.priceService ?? 0,
          includeFirst: tr.includeFirst ?? '',
          includeSecond: tr.includeSecond ?? '',
          includeThird: tr.includeThird ?? '',
          includeForth: tr.includeForth ?? ''
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
    if (this.priceForm.invalid) {
      this.toaster.error('Please complete required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    const translations = this.languages.map(lang => {
      const tr = this.getTranslationGroup(lang).value;
      return {
        Language: lang,
        Discount: tr.discount,
        Title: tr.title,
        Description: tr.description,
        PriceService: tr.priceService,
        IncludeFirst: tr.includeFirst,
        IncludeSecond: tr.includeSecond,
        IncludeThird: tr.includeThird,
        IncludeForth: tr.includeForth
      };
    });

    formData.append('TranslationsJson', JSON.stringify(translations));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.priceService.updatePrice(this.priceId, formData).subscribe({
      next: () => {
        this.toaster.success('Price plan updated successfully', 'Success');
        this.router.navigate(['/admin/price']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.toaster.error('Error updating price plan', 'Error');
      }
    });
  }
}