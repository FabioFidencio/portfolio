import { Component, inject, signal } from '@angular/core';
import { AnalyticsService } from '../../core/analytics.service';
import { LanguageService } from '../../core/language.service';
import * as portfolio from '../../portfolio.data';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
})
export class HeroSectionComponent {
  private readonly languageService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly content = this.languageService.content;
  protected readonly profile = this.languageService.profile;
  protected readonly chartBars = portfolio.chartBars;
  protected readonly photoFailed = signal(false);

  constructor() {
    this.analytics.trackComponentView('hero');
  }

  protected onPhotoError(): void {
    if (this.photoFailed()) {
      return;
    }

    this.photoFailed.set(true);
    this.analytics.trackEvent('profile_photo_fallback', { file: 'profile.jpg' }, 'hero');
  }

  protected trackCta(label: string, target: string): void {
    this.analytics.trackEvent('cta_click', { label, target }, 'hero');
  }
}
