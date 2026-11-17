import { Component, computed, inject, signal } from '@angular/core';
import { AnalyticsService } from '../../core/analytics.service';
import { LanguageService } from '../../core/language.service';
import type { SkillFilter } from '../../portfolio.data';

@Component({
  selector: 'app-skills-section',
  templateUrl: './skills-section.component.html',
})
export class SkillsSectionComponent {
  private readonly languageService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly content = this.languageService.content;
  protected readonly skillFilter = signal<SkillFilter>('all');
  protected readonly filteredSkills = computed(() => {
    const filter = this.skillFilter();
    const skills = this.content().skills.items;
    return filter === 'all' ? skills : skills.filter((skill) => skill.category === filter);
  });

  constructor() {
    this.analytics.trackComponentView('skills');
  }

  protected setFilter(filter: SkillFilter): void {
    this.skillFilter.set(filter);
    this.analytics.trackEvent('skill_filter', { filter }, 'skills');
  }
}
