import { AfterViewInit, Component, HostListener, inject, signal } from '@angular/core';
import { AnalyticsSectionComponent } from './components/analytics-section/analytics-section.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { DesignSectionComponent } from './components/design-section/design-section.component';
import { EngineeringSectionComponent } from './components/engineering-section/engineering-section.component';
import { ExperienceSectionComponent } from './components/experience-section/experience-section.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { SiteHeaderComponent } from './components/site-header/site-header.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';
import { StackStripComponent } from './components/stack-strip/stack-strip.component';
import { WorkSectionComponent } from './components/work-section/work-section.component';
import { AnalyticsService } from './core/analytics.service';
import { LanguageService } from './core/language.service';

@Component({
  imports: [
    SiteHeaderComponent,
    HeroSectionComponent,
    StackStripComponent,
    WorkSectionComponent,
    SkillsSectionComponent,
    EngineeringSectionComponent,
    AnalyticsSectionComponent,
    DesignSectionComponent,
    ExperienceSectionComponent,
    ContactSectionComponent,
    SiteFooterComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App implements AfterViewInit {
  private readonly languageService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly content = this.languageService.content;
  protected readonly scrollProgress = signal(0);

  constructor() {
    this.analytics.init();
    this.analytics.trackComponentView('app-shell');
  }

  ngAfterViewInit(): void {
    this.onWindowScroll();
  }

  @HostListener('window:scroll', [])
  protected onWindowScroll(): void {
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    this.scrollProgress.set(max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0);
  }
}
