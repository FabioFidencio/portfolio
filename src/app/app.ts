import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import * as portfolio from './portfolio.data';
import { siteContent, type Language } from './translations';

@Component({
  imports: [],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App implements AfterViewInit {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly languageStorageKey = 'portfolio-language';

  protected readonly currentYear = new Date().getFullYear();
  protected readonly chartBars = portfolio.chartBars;
  protected readonly language = signal<Language>(this.readInitialLanguage());
  protected readonly content = computed(() => siteContent[this.language()]);
  protected readonly languageOptions: ReadonlyArray<{
    id: Language;
    short: string;
    label: string;
  }> = [
    { id: 'en', short: 'EN', label: 'English' },
    { id: 'pt-BR', short: 'PT', label: 'Português (Brasil)' },
  ];

  protected readonly menuOpen = signal(false);
  protected readonly activeSection = signal('');
  protected readonly scrolled = signal(false);
  protected readonly scrollProgress = signal(0);
  protected readonly skillFilter = signal<portfolio.SkillFilter>('all');
  protected readonly selectedFeatureId = signal<portfolio.FeatureId>('signals');
  protected readonly specimenTab = signal<portfolio.SpecimenTab>('foundations');
  protected readonly dense = signal(false);
  protected readonly motionPlaying = signal(false);
  protected readonly copied = signal(false);
  protected readonly selectedProject = signal<portfolio.Project | null>(null);

  private readonly dialogClose = viewChild<ElementRef<HTMLButtonElement>>('dialogClose');
  private lastFocused: HTMLElement | null = null;

  protected get profile() {
    return { ...portfolio.profile, ...this.content().profile };
  }

  protected get navItems() {
    return this.content().nav;
  }

  protected get heroStats() {
    return this.content().hero.stats;
  }

  protected get stack() {
    return this.content().stack.items;
  }

  protected get projects() {
    return this.content().projects;
  }

  protected get featuredProject() {
    return this.projects[0];
  }

  protected get secondaryProjects() {
    return this.projects.slice(1);
  }

  protected get skillFilters() {
    return this.content().skills.filters;
  }

  protected get categoryLabels() {
    return this.content().skills.categories;
  }

  protected get skills() {
    return this.content().skills.items;
  }

  protected get features() {
    return this.content().engineering.features;
  }

  protected get architecture() {
    return this.content().engineering.architecture;
  }

  protected get principles() {
    return this.content().engineering.principles;
  }

  protected get experience() {
    return this.content().experience.jobs;
  }

  protected get specimenTabs() {
    return this.content().design.tabs;
  }

  protected get swatches() {
    return this.content().design.foundations.swatches;
  }

  protected get deployRows() {
    return this.content().hero.dashboard.deployRows;
  }

  protected readonly filteredSkills = computed(() => {
    const filter = this.skillFilter();
    return filter === 'all'
      ? this.skills
      : this.skills.filter((skill) => skill.category === filter);
  });

  protected readonly selectedFeature = computed(() => {
    return (
      this.features.find((feature) => feature.id === this.selectedFeatureId()) ?? this.features[0]
    );
  });

  constructor() {
    this.applyLanguage(this.language());
  }

  ngAfterViewInit(): void {
    this.onWindowScroll();
  }

  @HostListener('window:scroll', [])
  protected onWindowScroll(): void {
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    this.scrolled.set(scrollTop > 8);
    this.scrollProgress.set(max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0);

    let current = '';
    for (const item of this.navItems) {
      const section = document.getElementById(item.id);
      if (section && section.getBoundingClientRect().top <= 140) {
        current = item.id;
      }
    }
    this.activeSection.set(current);
  }

  @HostListener('document:keydown.escape')
  protected closeProject(): void {
    if (!this.selectedProject()) {
      return;
    }
    this.selectedProject.set(null);
    document.body.classList.remove('modal-open');
    this.lastFocused?.focus();
  }

  protected setLanguage(language: Language): void {
    if (this.language() === language) {
      return;
    }

    this.language.set(language);

    try {
      window.localStorage.setItem(this.languageStorageKey, language);
    } catch {
      // Storage can be unavailable in private or restricted contexts.
    }

    this.applyLanguage(language);
    this.closeMenu();

    const openProject = this.selectedProject();
    if (openProject) {
      this.selectedProject.set(
        this.projects.find((project) => project.id === openProject.id) ?? null,
      );
    }
  }

  protected toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected selectFeature(feature: portfolio.Feature): void {
    this.selectedFeatureId.set(feature.id);
  }

  protected openProject(project: portfolio.Project): void {
    this.lastFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.selectedProject.set(project);
    document.body.classList.add('modal-open');
    window.setTimeout(() => this.dialogClose()?.nativeElement.focus(), 0);
  }

  protected replayMotion(): void {
    this.motionPlaying.set(false);
    window.setTimeout(() => this.motionPlaying.set(true), 20);
    window.setTimeout(() => this.motionPlaying.set(false), 1000);
  }

  protected async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.profile.email);
    } catch {
      const field = document.createElement('textarea');
      field.value = this.profile.email;
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
  }

  protected mailto(subject: string): string {
    return `mailto:${this.profile.email}?subject=${encodeURIComponent(subject)}`;
  }

  private readInitialLanguage(): Language {
    try {
      const stored = window.localStorage.getItem(this.languageStorageKey);
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
