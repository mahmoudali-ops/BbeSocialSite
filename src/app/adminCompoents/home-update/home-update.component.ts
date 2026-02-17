import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';
import { HomeService } from '../../core/services/home.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../core/environments/environments';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-update',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './home-update.component.html',
  styleUrl: './home-update.component.css'
})
export class HomeUpdateComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly homeService = inject(HomeService);

  languages = ['en', 'ar', 'de', 'hl'];
  selectedLang: string = 'en';

  homeForm: FormGroup;

  // الصور الحالية
  currentMainCoverImage: string | null = null;
  currentMultiLangImage: string | null = null;
  currentTeamImage: string | null = null;
  currentHelpImage: string | null = null;

  // الصور الجديدة (preview)
  newMainCoverPreview: string | ArrayBuffer | null = null;
  newMultiLangPreview: string | ArrayBuffer | null = null;
  newTeamPreview: string | ArrayBuffer | null = null;
  newHelpPreview: string | ArrayBuffer | null = null;

  selectedMainCoverFile: File | null = null;
  selectedMultiLangFile: File | null = null;
  selectedTeamFile: File | null = null;
  selectedHelpFile: File | null = null;

  @ViewChild('mainCoverInput') mainCoverInput!: ElementRef<HTMLInputElement>;
  @ViewChild('multiLangInput') multiLangInput!: ElementRef<HTMLInputElement>;
  @ViewChild('teamInput') teamInput!: ElementRef<HTMLInputElement>;
  @ViewChild('helpInput') helpInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder) {
    this.homeForm = this.buildForm();
  }

  ngOnInit() {
    this.loadHomeData();
  }

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
      description: ['']
    });
  }

  getTranslationGroup(lang: string): FormGroup {
    return this.homeForm.get(['translations', lang]) as FormGroup;
  }

  // ================= Load Home Data =================
  loadHomeData() {
    
    this.homeService.getAllHomeData().subscribe(res => {
      // patch translations
      this.patchTranslations(res.homeTranslationDtos);
      console.log('Loaded Home Data:', res); // شوف اسم الخاصية بالضبط


      // الصور الحالية
      this.currentMainCoverImage = res.mainCover ? `${environment.BaseUrl}/${res.mainCover}` : null;
      this.currentMultiLangImage = res.multiLangImage ? `${environment.BaseUrl}/${res.multiLangImage}` : null;
      this.currentTeamImage = res.teamImage ? `${environment.BaseUrl}/${res.teamImage}` : null;
      this.currentHelpImage = res.helpImage ? `${environment.BaseUrl}/${res.helpImage}` : null;

      if (res.homeTranslationDtos.length) {
        this.selectedLang = res.homeTranslationDtos[0].language;
      }
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
  onFileSelected(event: any, type: string) {
    if (!event.target.files?.length) return;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      switch(type) {
        case 'mainCover':
          this.selectedMainCoverFile = file;
          this.newMainCoverPreview = reader.result;
          break;
        case 'multiLang':
          this.selectedMultiLangFile = file;
          this.newMultiLangPreview = reader.result;
          break;
        case 'team':
          this.selectedTeamFile = file;
          this.newTeamPreview = reader.result;
          break;
        case 'help':
          this.selectedHelpFile = file;
          this.newHelpPreview = reader.result;
          break;
      }
    };
    reader.readAsDataURL(file);
  }

  removeNewImage(type: string) {
    switch(type) {
      case 'mainCover':
        this.selectedMainCoverFile = null;
        this.newMainCoverPreview = null;
        this.mainCoverInput.nativeElement.value = '';
        break;
      case 'multiLang':
        this.selectedMultiLangFile = null;
        this.newMultiLangPreview = null;
        this.multiLangInput.nativeElement.value = '';
        break;
      case 'team':
        this.selectedTeamFile = null;
        this.newTeamPreview = null;
        this.teamInput.nativeElement.value = '';
        break;
      case 'help':
        this.selectedHelpFile = null;
        this.newHelpPreview = null;
        this.helpInput.nativeElement.value = '';
        break;
    }
  }

  // ================= Submit =================
  onSubmit() {
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

    if (this.selectedMainCoverFile) formData.append('MainCoverImageFile', this.selectedMainCoverFile);
    if (this.selectedMultiLangFile) formData.append('MultiLangImageImageFile', this.selectedMultiLangFile);
    if (this.selectedTeamFile) formData.append('TeamImageImageFile', this.selectedTeamFile);
    if (this.selectedHelpFile) formData.append('HelpImageImageFile', this.selectedHelpFile);

    this.homeService.updateHome(formData).subscribe({
      next: () => {
        this.toaster.success('Home section updated successfully', 'Success');

        this.router.navigate(['/admin/home-update']);
        this.loadHomeData(); 

        // reload to reflect new images
      },
      error: (err: HttpErrorResponse) => {
        this.toaster.error('Error updating Home section', 'Error');
      }
    });
  }
}