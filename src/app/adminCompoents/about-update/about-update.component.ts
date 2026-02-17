import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../core/environments/environments';
import { ActivatedRoute, Router } from '@angular/router';
import { AboutService } from '../../core/services/about.service';

@Component({
  selector: 'app-update-about',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './about-update.component.html',
  styleUrls: ['./about-update.component.css']
})
export class UpdateAboutComponent implements OnInit {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly aboutService = inject(AboutService);

  languages = ['en', 'ar', 'de', 'hl'];
  selectedLang: string = 'en';

  aboutForm: FormGroup;
  aboutId!: number;

  currentImage: string | null = null; // الصورة الموجودة بالسيرفر
  newImagePreview: string | ArrayBuffer | null = null; // الصورة الجديدة فقط
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder) {
    this.aboutForm = this.buildForm();
  }

  ngOnInit() {
    this.loadAboutData();
  }

  private buildForm(): FormGroup {
    const translations: any = {};
    this.languages.forEach(lang => {
      translations[lang] = this.createTranslationGroup();
    });

    return this.fb.group({
      referenceName: ['', Validators.required],
      metaDescription: [''],
      metaKeyWords: [''],
      translations: this.fb.group(translations)
    });
  }

  private createTranslationGroup(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  getTranslationGroup(lang: string): FormGroup {
    return this.aboutForm.get(['translations', lang]) as FormGroup;
  }

  // ================= Load Data =================
  loadAboutData() {
    this.aboutService.getAllAboutData().subscribe(res => {
      this.patchBasicData(res);
      this.patchTranslations(res.aboutTranslationDtos);

      // الصورة الحالية من السيرفر فقط
      if (res.imageCover) {
        this.currentImage = `${environment.BaseUrl}/${res.imageCover}`;
      }

      if (res.aboutTranslationDtos.length) {
        this.selectedLang = res.aboutTranslationDtos[0].language;
      }
    });
  }

  private patchBasicData(data: any) {
    this.aboutForm.patchValue({
      referenceName: data.referneceName,
      metaDescription: data.metaDescription ?? '',
      metaKeyWords: data.metaKeyWords ?? ''
    });
  }

  private patchTranslations(translations: any[]) {
    this.languages.forEach(lang => {
      const tr = translations.find(t => t.language === lang);
      if (tr) {
        this.getTranslationGroup(lang).patchValue({
          title: tr.title,
          description: tr.description ?? ''
        });
      }
    });
  }

  // ================= Image Handling =================
  onFileSelected(event: any) {
    if (!event.target.files?.length) return;

    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => this.newImagePreview = reader.result;
    if (this.selectedFile){
    reader.readAsDataURL(this.selectedFile);
  }}

  removeNewImage() {
    this.selectedFile = null;
    this.newImagePreview = null;
    this.fileInput.nativeElement.value = '';
  }

  // ================= Submit =================
  onSubmit() {
    if (this.aboutForm.invalid) {
      this.toaster.error('Please complete required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();
    formData.append('ReferneceName', this.aboutForm.value.referenceName);
    formData.append('MetaDescription', this.aboutForm.value.metaDescription);
    formData.append('MetaKeyWords', this.aboutForm.value.metaKeyWords);

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

    this.aboutService.updateCareer(formData).subscribe({
      next: () => {
        this.toaster.success('About section updated successfully', 'Success');
        this.router.navigate(['/admin/about-update']);
      },
      error: (err: HttpErrorResponse) => {
        this.toaster.error('Error updating About section', 'Error');
      }
    });
  }
}
