import { Component, inject, signal } from '@angular/core';
import { AnalyticsService } from '../../core/analytics.service';
import { LanguageService } from '../../core/language.service';
import { gmailCompose } from '../../core/links';

@Component({
  selector: 'app-contact-section',
  templateUrl: './contact-section.component.html',
})
export class ContactSectionComponent {
  private readonly languageService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly content = this.languageService.content;
  protected readonly profile = this.languageService.profile;
  protected readonly copied = signal(false);
  protected readonly gmail = (subject: string) => gmailCompose(this.profile().email, subject);

  constructor() {
    this.analytics.trackComponentView('contact');
  }

  protected async copyEmail(): Promise<void> {
    const email = this.profile().email;

    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const field = document.createElement('textarea');
      field.value = email;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      document.body.removeChild(field);
    }

    this.copied.set(true);
    window.setTimeout(() => this.copied.set(false), 2200);
    this.analytics.trackEvent('copy_email', { placement: 'contact' }, 'contact');
  }

  protected trackEmail(): void {
    this.analytics.trackEvent('email_click', { placement: 'contact' }, 'contact');
  }

  protected trackSocial(network: 'github' | 'linkedin'): void {
    this.analytics.trackEvent('social_click', { network, placement: 'contact' }, 'contact');
  }
}
