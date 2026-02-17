import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CareerService } from '../../core/services/career.service';
import { environment } from '../../core/environments/environments';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-career-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './career-update.component.html',
  styleUrl: './career-update.component.css'
})
export class CareerUpdateComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);

  languages = ['en', 'ar', 'de', 'hl'];
  selectedLang: string = 'en';

  careerForm: FormGroup;
  careerId!: number;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private careerService: CareerService,
    private route: ActivatedRoute
  ) {
    this.careerForm = this.buildForm();
  }

  ngOnInit() {
    this.careerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCareer();
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
      jobTitle: [''],
      employmentType: [''],
      salaryFrom: [''],
      salaryTo: [''],
      salaryPeriod: [''],
      description: ['']
    });
  }

  getTranslationGroup(lang: string): FormGroup {
    return this.careerForm.get(['translations', lang]) as FormGroup;
  }

  // =========================
  // Load & Patch
  // =========================
  loadCareer() {
    this.careerService.getAllDetaildedCareer(this.careerId).subscribe(res => {
      console.log('Loaded Career:', res);
      this.patchTranslations(res.careerCardTranslationsDto);

      if (res.imageCover) {
        this.imagePreview = res.imageCover
        ? `${environment.BaseUrl}/${res.imageCover}`
        : null;
      }

      if (res.careerCardTranslationsDto.length) {
        this.selectedLang = res.careerCardTranslationsDto[0].language;
      }
    });
  }

  private patchTranslations(translations: any[]) {
    this.languages.forEach(lang => {
      const tr = translations.find(t => t.language === lang);
      if (tr) {
        this.getTranslationGroup(lang).patchValue({
          jobTitle: tr.jobTitle ?? '',
          employmentType: tr.employmentType ?? '',
          salaryFrom: tr.salaryFrom ?? '',
          salaryTo: tr.salaryTo ?? '',
          salaryPeriod: tr.salaryPeriod ?? '',
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
    if (this.careerForm.invalid) {
      this.toaster.error('Please complete required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    const translations = this.languages.map(lang => {
      const tr = this.getTranslationGroup(lang).value;
      return {
        Language: lang,
        JobTitle: tr.jobTitle,
        EmploymentType: tr.employmentType,
        SalaryFrom: tr.salaryFrom,
        SalaryTo: tr.salaryTo,
        SalaryPeriod: tr.salaryPeriod,
        Description: tr.description
      };
    });

    formData.append('TranslationsJson', JSON.stringify(translations));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.careerService.updateCareer(this.careerId, formData).subscribe({
      next: () => {
        this.toaster.success('Career updated successfully', 'Success');
        this.router.navigate(['/admin/career']);
      },
      error: () => {
        this.toaster.error('Error updating career', 'Error');
      }
    });
  }
}