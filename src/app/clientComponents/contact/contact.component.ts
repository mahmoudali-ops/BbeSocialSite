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
import { ToastrService } from 'ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,TranslatedPipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent extends ReloadableComponent {

  private readonly meta=inject(Meta);
  private readonly title=inject(Title);
  // Services
  private readonly contactService = inject(ContactService);
  private readonly emailService = inject(EmailService);
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);

  // Signals
  ContactData: WritableSignal<IContact | null> = signal(null);
  EmailSubs: WritableSignal<Subscription | null> = signal(null);

  // Form
  contactForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.LoadData();
    this.onReload(() => this.LoadData());
    this.LoadDataSeo();
  }
  LoadDataSeo() {
    // 🔹 تنظيف أي meta قديم
    this.meta.removeTag("name='description'");
    this.meta.removeTag("name='keywords'");
    this.meta.removeTag("property='og:title'");
    this.meta.removeTag("property='og:description'");
    this.meta.removeTag("property='og:type'");
    this.meta.removeTag("property='og:url'");
    this.meta.removeTag("property='og:image'");
    this.meta.removeTag("name='twitter:card'");
    this.meta.removeTag("name='twitter:title'");
    this.meta.removeTag("name='twitter:description'");
    this.meta.removeTag("name='twitter:image'");
    this.meta.removeTag("rel='canonical'");
  
    // 🔹 Title (Brand + Contact)
    this.title.setTitle(
      'Contact BBESocial | Get Professional Customer Service Support'
    );
  
    // 🔹 Meta Description (SEO + Conversion)
    this.meta.updateTag({
      name: 'description',
      content:
        'Get in touch with BBESocial to enhance your customer service experience. Contact our professional team for support, inquiries, and partnership opportunities in e-commerce customer support.'
    });
  
    // 🔹 Keywords (Relevant & Clean)
    this.meta.updateTag({
      name: 'keywords',
      content:
        'BBESocial contact, customer service support, get in touch, e-commerce support, customer support team, professional customer service'
    });
  
    // 🔹 Open Graph (Social Sharing + Branding)
    this.meta.updateTag({
      property: 'og:title',
      content: 'Contact BBESocial | Professional Customer Service Support'
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Reach out to BBESocial and connect with our customer service experts. We provide reliable support for e-commerce brands to enhance customer satisfaction.'
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'https://bbesocial.com/contact' });
    this.meta.updateTag({
      property: 'og:image',
      content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
    });
  
    // 🔹 Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({
      name: 'twitter:title',
      content: 'Contact BBESocial | Professional Customer Service Support'
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content:
        'Reach out to BBESocial and connect with our customer service experts. We provide reliable support for e-commerce brands to enhance customer satisfaction.'
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: 'https://bbesocial.com/assets/images/bbesocaiallogo.png'
    });
  
    // 🔹 Canonical URL
    this.meta.updateTag({ rel: 'canonical', href: 'https://bbesocial.com/contact' });
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
    if (this.contactForm.invalid) {
      this.toastr.warning('Please fill all required fields', 'Form Incomplete');
      return;
    }
  
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
        this.toastr.success('Your message has been sent successfully ✅', 'Success');
        this.contactForm.reset();
      },
      error: (err) => {
        this.toastr.error('Failed to send message ❌, please try again', 'Error');
        console.error(err);
      }
    });
  
    this.EmailSubs.set(sub);
  }
  



}