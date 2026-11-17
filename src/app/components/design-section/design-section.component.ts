import { Component, OnDestroy, inject, signal } from '@angular/core';
import { AnalyticsService } from '../../core/analytics.service';
import { LanguageService } from '../../core/language.service';
import type { SpecimenTab } from '../../portfolio.data';

@Component({
  selector: 'app-design-section',
  templateUrl: './design-section.component.html',
})
export class DesignSectionComponent implements OnDestroy {
  private readonly languageService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly content = this.languageService.content;
  protected readonly specimenTab = signal<SpecimenTab>('foundations');
  protected readonly dense = signal(false);
  protected readonly motionPlaying = signal(false);

  private motionTimer: number | undefined;

  constructor() {
    this.analytics.trackComponentView('design');
  }

  ngOnDestroy(): void {
    this.clearMotionTimer();
  }

  protected setSpecimenTab(tab: SpecimenTab): void {
    this.specimenTab.set(tab);
    this.analytics.trackEvent('specimen_tab', { tab }, 'design');
  }

  protected toggleDensity(): void {
    const dense = !this.dense();
    this.dense.set(dense);
    this.analytics.trackEvent('density_toggle', { state: dense ? 'compact' : 'comfortable' }, 'design');
  }

  protected replayMotion(): void {
    this.clearMotionTimer();
    this.motionPlaying.set(false);
    window.setTimeout(() => this.motionPlaying.set(true), 20);
    this.motionTimer = window.setTimeout(() => this.motionPlaying.set(false), 1000);
    this.analytics.trackEvent('motion_replay', { demo: 'micro_feedback' }, 'design');
  }

  protected trackInputFocus(): void {
    this.analytics.trackEvent('form_field_focus', { field: 'specimen_email' }, 'design');
  }

  private clearMotionTimer(): void {
    if (this.motionTimer !== undefined) {
      window.clearTimeout(this.motionTimer);
      this.motionTimer = undefined;
    }
  }
}
