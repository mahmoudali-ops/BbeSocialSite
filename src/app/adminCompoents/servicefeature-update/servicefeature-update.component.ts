import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServicefeatureService } from '../../core/services/servicefeature.service';
import { environment } from '../../core/environments/environments';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicefeature-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './servicefeature-update.component.html',
  styleUrl: './servicefeature-update.component.css'
})
export class ServicefeatureUpdateComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);

  languages = ['en', 'ar', 'de', 'hl'];
  selectedLang: string = 'en';

  serviceFeatureForm: FormGroup;
  serviceFeatureId!: number;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private serviceFeatureService: ServicefeatureService,
    private route: ActivatedRoute
  ) {
    this.serviceFeatureForm = this.buildForm();
  }

  ngOnInit() {
    this.serviceFeatureId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadServiceFeature();
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
      title: ['', Validators.required],
      description: ['', Validators.required],
      includeFirst: ['', Validators.required],
      includeSecond: ['', Validators.required]
    });
  }

  getTranslationGroup(lang: string): FormGroup {
    return this.serviceFeatureForm.get(['translations', lang]) as FormGroup;
  }

  // =========================
  // Load & Patch
  // =========================
  loadServiceFeature() {
    this.serviceFeatureService.getAllDetaildedServiceFeature(this.serviceFeatureId).subscribe({
      next: (res) => {
        console.log('Loaded Service Feature:', res);
        this.patchTranslations(res.servicesFeatureTranslationDtos);

        if (res.imageCover) {
          this.imagePreview = res.imageCover
            ? `${environment.BaseUrl}/${res.imageCover}`
            : null;
        }

        if (res.servicesFeatureTranslationDtos?.length) {
          this.selectedLang = res.servicesFeatureTranslationDtos[0].language;
        }
      },
      error: (err) => {
        console.error('Error loading service feature:', err);
        this.toaster.error('Error loading service feature', 'Error');
      }
    });
  }

  private patchTranslations(translations: any[]) {
    this.languages.forEach(lang => {
      const tr = translations?.find((t: any) => t.language === lang);
      if (tr) {
        this.getTranslationGroup(lang).patchValue({
          title: tr.title ?? '',
          description: tr.description ?? '',
          includeFirst: tr.includeFirst ?? '',
          includeSecond: tr.includeSecond ?? ''
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
    if (this.serviceFeatureForm.invalid) {
      this.toaster.error('Please complete required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    const translations = this.languages.map(lang => {
      const tr = this.getTranslationGroup(lang).value;
      return {
        Language: lang,
        Title: tr.title,
        Description: tr.description,
        IncludeFirst: tr.includeFirst,
        IncludeSecond: tr.includeSecond
      };
    });

    formData.append('TranslationsJson', JSON.stringify(translations));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.serviceFeatureService.updateServiceFeature(this.serviceFeatureId, formData).subscribe({
      next: () => {
        this.toaster.success('Service Feature updated successfully', 'Success');
        this.router.navigate(['/admin/servicefeature']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.toaster.error('Error updating service feature', 'Error');
      }
    });
  }
}