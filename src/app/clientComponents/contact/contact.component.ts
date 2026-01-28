import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ContactService } from '../../core/services/contact.service';
import { IContact } from '../../core/interfaces/icontact';
import { Subscription, takeUntil } from 'rxjs';
import { EmailService } from '../../core/services/email.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IEmail } from '../../core/interfaces/iemail';
import { CommonModule } from '@angular/common';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,TranslatedPipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent extends ReloadableComponent {
  // Services
  private readonly contactService = inject(ContactService);
  private readonly emailService = inject(EmailService);
  private readonly fb = inject(FormBuilder);

  // Signals
  ContactData: WritableSignal<IContact | null> = signal(null);
  EmailSubs: WritableSignal<Subscription | null> = signal(null);

  // Form
  contactForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.LoadData();
    this.onReload(() => this.LoadData());
  }

  // ========================
  // Form Init
  // ========================
  initForm() {
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  // ========================
  // Load Contact Data
  // ========================
  LoadData() {
          this.contactService.getContactData()
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (res) => {
                  this.ContactData.set(res);
               
                },
                error: (err: HttpErrorResponse) => {
                  console.log(err.message);
                }
              });
 
  }

  // ========================
  // Submit Email Form
  // ========================
  submitForm() {
    if (this.contactForm.invalid) return;

    const emailData: IEmail = {
      id: 0,
      fullName: this.contactForm.value.fullName,
      emailAddress: this.contactForm.value.emailAddress,
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message,
      createdAt: new Date().toISOString()
    };

    this.EmailSubs()?.unsubscribe();

    const sub = this.emailService.sendEmail(emailData).subscribe({
      next: () => {
        console.log('Email Sent Successfully');
        this.contactForm.reset();
      },
      error: (err) => {
        console.log('Send Email Error:', err);
      }
    });

    this.EmailSubs.set(sub);
  }



}