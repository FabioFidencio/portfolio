import { Component, inject } from '@angular/core';
import { AnalyticsService } from '../../core/analytics.service';
import { LanguageService } from '../../core/language.service';
import { gmailCompose } from '../../core/links';

@Component({
  selector: 'app-experience-section',
  templateUrl: './experience-section.component.html',
})
export class ExperienceSectionComponent {
  private readonly languageService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly content = this.languageService.content;
  protected readonly profile = this.languageService.profile;
  protected readonly resume = this.languageService.resume;
  protected readonly gmail = (subject: string) => gmailCompose(this.profile().email, subject);

  constructor() {
    this.analytics.trackComponentView('experience');
  }

  protected trackResume(): void {
    this.analytics.trackEvent('resume_download', { placement: 'experience' }, 'experience');
  }

  protected trackEmail(): void {
    this.analytics.trackEvent('email_click', { placement: 'experience' }, 'experience');
  }
}
