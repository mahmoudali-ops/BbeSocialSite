import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AboutteamService } from '../../core/services/aboutteam.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aboutteam-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './aboutteam-create.component.html',
  styleUrl: './aboutteam-create.component.css'
})
export class AboutteamCreateComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly aboutTeamService = inject(AboutteamService);

  languages = ['en', 'ar', 'de', 'hl']; // اللغات المتاحة

  selectedLang: string = 'en';

  aboutTeamForm!: FormGroup;
  formErrors: { label: string; lang?: string }[] = [];

  selectedFile: File | null = null;
  newImagePreview: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.aboutTeamForm = this.buildForm();
  }

  // =========================
  // Form Builder
  // =========================
  private buildForm(): FormGroup {
    return this.fb.group({
      aboutTeamTranlationDtos: this.fb.array(
        this.languages.map(lang => this.createTranslationGroup(lang))
      )
    });
  }

  private createTranslationGroup(lang: string): FormGroup {
    return this.fb.group({
      language: [lang],
      name: ['', Validators.required],
      position: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  get aboutTeamTranlationDtos(): FormArray {
    return this.aboutTeamForm.get('aboutTeamTranlationDtos') as FormArray;
  }

  getTranslationGroup(index: number): FormGroup {
    return this.aboutTeamTranlationDtos.at(index) as FormGroup;
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
    this.aboutTeamTranlationDtos.controls.forEach((group) => {
      const g = group as FormGroup;
      const lang = g.get('language')?.value;
      
      if (g.get('name')?.invalid) this.formErrors.push({ label: 'Name', lang });
      if (g.get('position')?.invalid) this.formErrors.push({ label: 'Position', lang });
      if (g.get('description')?.invalid) this.formErrors.push({ label: 'Description', lang });
    });
  }

  // =========================
  // Submit
  // =========================
  onSubmit() {
    this.buildErrorSummary();

    if (this.aboutTeamForm.invalid) {
      this.toaster.error('Please complete all required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    const translations = this.aboutTeamTranlationDtos.value.map((t: any) => ({
      Language: t.language,
      Name: t.name,
      Position: t.position,
      Description: t.description
    }));

    formData.append('TranslationsJson', JSON.stringify(translations));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.aboutTeamService.createaboutteam(formData).subscribe({
      next: () => {
        this.toaster.success('Team member created successfully', 'Success');
        this.aboutTeamForm.reset();
        this.router.navigate(['/admin/aboutteam']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.toaster.error('Error creating team member', 'Error');
      }
    });
  }
}