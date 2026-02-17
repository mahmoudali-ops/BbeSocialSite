import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServicecoreService } from '../../core/services/servicecore.service';
import { environment } from '../../core/environments/environments';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-servicecore-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './servicecore-update.component.html',
  styleUrl: './servicecore-update.component.css'
})
export class ServicecoreUpdateComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);

  languages = ['en', 'ar', 'de', 'hl'];
  selectedLang: string = 'en';

  serviceCoreForm: FormGroup;
  serviceCoreId!: number;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private serviceCoreService: ServicecoreService,
    private route: ActivatedRoute
  ) {
    this.serviceCoreForm = this.buildForm();
  }

  ngOnInit() {
    this.serviceCoreId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadServiceCore();
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
      description: ['', Validators.required]
    });
  }

  getTranslationGroup(lang: string): FormGroup {
    return this.serviceCoreForm.get(['translations', lang]) as FormGroup;
  }

  // =========================
  // Load & Patch
  // =========================
  loadServiceCore() {
    this.serviceCoreService.getAllDetaildedServiceCore(this.serviceCoreId).subscribe({
      next: (res) => {
        console.log('Loaded Service Core:', res);
        this.patchTranslations(res.serviceCoreTranlationDtos);

        if (res.imageCover) {
          this.imagePreview = res.imageCover
            ? `${environment.BaseUrl}/${res.imageCover}`
            : null;
        }

        if (res.serviceCoreTranlationDtos?.length) {
          this.selectedLang = res.serviceCoreTranlationDtos[0].language;
        }
      },
      error: (err) => {
        console.error('Error loading service core:', err);
        this.toaster.error('Error loading service core', 'Error');
      }
    });
  }

  private patchTranslations(translations: any[]) {
    this.languages.forEach(lang => {
      const tr = translations?.find((t: any) => t.language === lang);
      if (tr) {
        this.getTranslationGroup(lang).patchValue({
          title: tr.title ?? '',
          description: tr.description ?? ''
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
    if (this.serviceCoreForm.invalid) {
      this.toaster.error('Please complete required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    const translations = this.languages.map(lang => {
      const tr = this.getTranslationGroup(lang).value;
      return {
        Language: lang,
        Title: tr.title,
        Description: tr.description
      };
    });

    formData.append('TranslationsJson', JSON.stringify(translations));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.serviceCoreService.updateServiceCore(this.serviceCoreId, formData).subscribe({
      next: () => {
        this.toaster.success('Service Core updated successfully', 'Success');
        this.router.navigate(['/admin/servicecore']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.toaster.error('Error updating service core', 'Error');
      }
    });
  }
}