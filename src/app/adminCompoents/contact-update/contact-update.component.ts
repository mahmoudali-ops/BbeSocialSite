import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContactService } from '../../core/services/contact.service';
import { environment } from '../../core/environments/environments';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contact-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-update.component.html',
  styleUrl: './contact-update.component.css'
})
export class ContactUpdateComponent {

  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly contactService = inject(ContactService);

  languages = ['en', 'ar', 'de', 'hl'];
  selectedLang: string = 'en';

  contactForm: FormGroup;

  // الصور
  currentImage: string | null = null;
  newImagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.buildForm();
  }

  ngOnInit(): void {
    this.loadContactData();
  }

  // ================= Build Form =================
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
    return this.contactForm.get(['translations', lang]) as FormGroup;
  }

  // ================= Load Data =================
  loadContactData() {
    this.contactService.getAllContactData().subscribe(res => {


      // Patch Basic Fields
      this.contactForm.patchValue({
        referenceName: res.referneceName,
        metaDescription: res.metaDescription ?? '',
        metaKeyWords: res.metaKeyWords ?? ''
      });

      // Patch Translations
      this.patchTranslations(res.contactTranlationDtos);

      // Image
      this.currentImage = res.imageCover 
        ? `${environment.BaseUrl}/${res.imageCover}` 
        : null;

      if (res.contactTranlationDtos?.length) {
        this.selectedLang = res.contactTranlationDtos[0].language;
      }
    });
  }

  private patchTranslations(translations: any[]) {
    this.languages.forEach(lang => {
      const tr = translations?.find(t => t.language === lang);
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

    if (this.contactForm.invalid) {
      this.toaster.error('Please complete required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    formData.append('ReferneceName', this.contactForm.value.referenceName);
    formData.append('MetaDescription', this.contactForm.value.metaDescription);
    formData.append('MetaKeyWords', this.contactForm.value.metaKeyWords);

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

    this.contactService.updateContact(formData).subscribe({
      next: () => {
        this.toaster.success('Contact updated successfully', 'Success');
        this.router.navigate(['/admin/contact-update']);
        this.loadContactData(); // refresh
      },
      error: (err: HttpErrorResponse) => {
        this.toaster.error('Error updating Contact', 'Error');
      }
    });
  }
}