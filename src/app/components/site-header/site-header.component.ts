import { Component, HostListener, afterNextRender, inject, signal } from '@angular/core';
import { AnalyticsService } from '../../core/analytics.service';
import { LanguageService } from '../../core/language.service';
import type { Language } from '../../portfolio.data';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
})
export class SiteHeaderComponent {
  private readonly languageService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly content = this.languageService.content;
  protected readonly profile = this.languageService.profile;
  protected readonly resume = this.languageService.resume;
  protected readonly navItems = this.languageService.navItems;
  protected readonly language = this.languageService.language;
  protected readonly languageOptions = this.languageService.languageOptions;

  protected readonly menuOpen = signal(false);
  protected readonly activeSection = signal('');
  protected readonly scrolled = signal(false);

  constructor() {
    this.analytics.trackComponentView('header');

    afterNextRender(() => this.updateScrollState());
  }

  @HostListener('window:scroll', [])
  protected onWindowScroll(): void {
    this.updateScrollState();
  }

  protected setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
    this.closeMenu();
  }

  protected toggleMenu(): void {
    const isOpen = !this.menuOpen();
    this.menuOpen.set(isOpen);
    this.analytics.trackEvent('menu_toggle', { state: isOpen ? 'open' : 'close' }, 'header');
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected trackNav(section: string, placement: 'desktop' | 'mobile' = 'desktop'): void {
    this.analytics.trackEvent('nav_click', { section, placement }, 'header');
  }

  protected trackMobileNav(section: string): void {
    this.trackNav(section, 'mobile');
    this.closeMenu();
  }

  protected trackResume(placement: string): void {
    this.analytics.trackEvent('resume_download', { placement }, 'header');
  }

  protected trackContact(placement: string): void {
    this.closeMenu();
    this.analytics.trackEvent('cta_click', { label: 'lets_talk', placement }, 'header');
  }

  private updateScrollState(): void {
    const scrollTop = window.scrollY;
    this.scrolled.set(scrollTop > 8);

    let current = '';
    for (const item of this.navItems()) {
      const section = document.getElementById(item.id);
      if (section && section.getBoundingClientRect().top <= 140) {
        current = item.id;
      }
    }
    this.activeSection.set(current);
  }
}
