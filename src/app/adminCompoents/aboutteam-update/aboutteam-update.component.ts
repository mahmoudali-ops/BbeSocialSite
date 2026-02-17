import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AboutteamService } from '../../core/services/aboutteam.service';
import { environment } from '../../core/environments/environments';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-aboutteam-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './aboutteam-update.component.html',
  styleUrl: './aboutteam-update.component.css'
})
export class AboutteamUpdateComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);

  languages = ['en', 'ar', 'de', 'hl'];
  selectedLang: string = 'en';

  aboutTeamForm: FormGroup;
  teamMemberId!: number;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private aboutTeamService: AboutteamService,
    private route: ActivatedRoute
  ) {
    this.aboutTeamForm = this.buildForm();
  }

  ngOnInit() {
    this.teamMemberId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTeamMember();
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
      name: ['', Validators.required],
      position: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  getTranslationGroup(lang: string): FormGroup {
    return this.aboutTeamForm.get(['translations', lang]) as FormGroup;
  }

  // =========================
  // Load & Patch
  // =========================
  loadTeamMember() {
    this.aboutTeamService.getAllDetaildedaboutteam(this.teamMemberId).subscribe({
      next: (res) => {
        console.log('Loaded Team Member:', res);
        this.patchTranslations(res.aboutTeamTranlationDtos);

        if (res.imageCover) {
          this.imagePreview = res.imageCover
            ? `${environment.BaseUrl}/${res.imageCover}`
            : null;
        }

        if (res.aboutTeamTranlationDtos?.length) {
          this.selectedLang = res.aboutTeamTranlationDtos[0].language;
        }
      },
      error: (err) => {
        console.error('Error loading team member:', err);
        this.toaster.error('Error loading team member', 'Error');
      }
    });
  }

  private patchTranslations(translations: any[]) {
    this.languages.forEach(lang => {
      const tr = translations?.find((t: any) => t.language === lang);
      if (tr) {
        this.getTranslationGroup(lang).patchValue({
          name: tr.name ?? '',
          position: tr.position ?? '',
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
    if (this.aboutTeamForm.invalid) {
      this.toaster.error('Please complete required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    const translations = this.languages.map(lang => {
      const tr = this.getTranslationGroup(lang).value;
      return {
        Language: lang,
        Name: tr.name,
        Position: tr.position,
        Description: tr.description
      };
    });

    formData.append('TranslationsJson', JSON.stringify(translations));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.aboutTeamService.updateaboutteame(this.teamMemberId, formData).subscribe({
      next: () => {
        this.toaster.success('Team member updated successfully', 'Success');
        this.router.navigate(['/admin/aboutteam']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.toaster.error('Error updating team member', 'Error');
      }
    });
  }
}