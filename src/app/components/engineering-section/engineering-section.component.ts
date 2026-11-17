import { Component, computed, inject, signal } from '@angular/core';
import { AnalyticsService } from '../../core/analytics.service';
import { LanguageService } from '../../core/language.service';
import type { Feature, FeatureId } from '../../portfolio.data';

@Component({
  selector: 'app-engineering-section',
  templateUrl: './engineering-section.component.html',
})
export class EngineeringSectionComponent {
  private readonly languageService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly content = this.languageService.content;
  protected readonly features = computed(() => this.content().engineering.features);
  protected readonly selectedFeatureId = signal<FeatureId>('signals');
  protected readonly selectedFeature = computed(
    () =>
      this.features().find((feature) => feature.id === this.selectedFeatureId()) ??
      this.features()[0],
  );

  constructor() {
    this.analytics.trackComponentView('engineering');
  }

  protected selectFeature(feature: Feature): void {
    this.selectedFeatureId.set(feature.id);
    this.analytics.trackEvent('feature_tab', { feature: feature.id }, 'engineering');
  }
}
