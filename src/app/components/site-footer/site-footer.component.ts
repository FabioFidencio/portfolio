import { Component, inject } from '@angular/core';
import { AnalyticsService } from '../../core/analytics.service';
import { LanguageService } from '../../core/language.service';
import { gmailCompose } from '../../core/links';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
})
export class SiteFooterComponent {
  private readonly languageService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly content = this.languageService.content;
  protected readonly profile = this.languageService.profile;
  protected readonly navItems = this.languageService.navItems;
  protected readonly currentYear = new Date().getFullYear();
  protected readonly gmail = (subject: string) => gmailCompose(this.profile().email, subject);

  constructor() {
    this.analytics.trackComponentView('footer');
  }

  protected trackNav(section: string): void {
    this.analytics.trackEvent('nav_click', { section, placement: 'footer' }, 'footer');
  }

  protected trackSocial(network: 'github' | 'linkedin' | 'email'): void {
    this.analytics.trackEvent('social_click', { network, placement: 'footer' }, 'footer');
  }

  protected trackBackToTop(): void {
    this.analytics.trackEvent('back_to_top', { placement: 'footer' }, 'footer');
  }
}
