import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import * as portfolio from '../portfolio.data';
import { siteContent, type Language } from '../translations';
import { AnalyticsService } from './analytics.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly analytics = inject(AnalyticsService);
  private readonly storageKey = 'portfolio-language';

  readonly language = signal<Language>(this.readInitialLanguage());
  readonly content = computed(() => siteContent[this.language()]);
  readonly navItems = computed(() => this.content().nav);
  readonly profile = computed(() => ({
    ...portfolio.profile,
    ...this.content().profile,
  }));
  readonly resume = portfolio.resume;

  readonly languageOptions: ReadonlyArray<{
    id: Language;
    short: string;
    label: string;
  }> = [
    { id: 'en', short: 'EN', label: 'English' },
    { id: 'pt-BR', short: 'PT', label: 'Português (Brasil)' },
  ];

  constructor() {
    this.applyLanguage(this.language());
    effect(() => this.applyLanguage(this.language()));
  }

  setLanguage(language: Language): void {
    if (this.language() === language) {
      return;
    }

    this.language.set(language);

    try {
      window.localStorage.setItem(this.storageKey, language);
    } catch {
      // Storage can be unavailable in private or restricted contexts.
    }

    this.analytics.trackEvent(
      'language_change',
      {
        language,
        page_title: this.content().meta.title,
      },
      'header',
    );
  }

  private readInitialLanguage(): Language {
    try {
      const stored = window.localStorage.getItem(this.storageKey);
      if (stored === 'en' || stored === 'pt-BR') {
        return stored;
      }
    } catch {
      // Fall through to browser language detection.
    }

    return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('pt')
      ? 'pt-BR'
      : 'en';
  }

  private applyLanguage(language: Language): void {
    const copy = siteContent[language];

    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }

    this.titleService.setTitle(copy.meta.title);
    this.metaService.updateTag({ name: 'description', content: copy.meta.description });
    this.metaService.updateTag({ property: 'og:title', content: copy.meta.ogTitle });
    this.metaService.updateTag({ property: 'og:description', content: copy.meta.ogDescription });
  }
}
