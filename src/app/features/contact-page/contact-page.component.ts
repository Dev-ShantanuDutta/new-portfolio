import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { EMAILJS_CONFIG } from '../../core/constants/site.constants';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';
import { WINDOW } from '../../core/tokens/window.token';
import { backToProjects } from '../../core/utils/back-to-projects.util';
import { PillButtonComponent } from '../../shared/ui/pill-button/pill-button.component';

/** EmailJS REST endpoint: the same call `@emailjs/browser` makes, without the extra dependency. */
const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

type SendStatus = 'idle' | 'sending' | 'sent' | 'error';

/** Full-page contact form, opened in its own tab from the nav's "Let's talk". */
@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ReactiveFormsModule, PillButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
})
export class ContactPageComponent {
  private readonly http = inject(HttpClient);
  private readonly window = inject(WINDOW);
  private readonly identity = inject(ContentService).identity;

  protected readonly contact = computed(() => this.identity()?.contact);

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.maxLength(150)]],
    message: ['', [Validators.required, Validators.maxLength(5000)]],
  });

  protected readonly status = signal<SendStatus>('idle');

  constructor() {
    inject(SeoService).setMetadata({
      title: 'Get in touch — Shantanu Dutta',
      description:
        'Send Shantanu Dutta a message about a project, a role, or a .NET and Angular build.',
    });
  }

  /** Shows a field's error once the visitor has left it or tried to send. */
  protected showError(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.form.touched);
  }

  protected async send(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, subject, message } = this.form.getRawValue();

    this.status.set('sending');
    try {
      await firstValueFrom(
        this.http.post(
          EMAILJS_ENDPOINT,
          {
            service_id: EMAILJS_CONFIG.serviceId,
            template_id: EMAILJS_CONFIG.templateId,
            user_id: EMAILJS_CONFIG.publicKey,
            template_params: {
              from_name: name,
              from_email: email,
              subject,
              message,
              to_email: this.contact()?.email,
            },
          },
          // EmailJS answers with plain "OK", not JSON.
          { responseType: 'text' },
        ),
      );
      this.status.set('sent');
      this.form.reset();
    } catch {
      this.status.set('error');
    }
  }

  protected backToPortfolio(): void {
    backToProjects(this.window, '/');
  }
}
