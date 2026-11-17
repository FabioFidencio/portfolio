import { Component, inject } from '@angular/core';
import { AnalyticsService } from '../../core/analytics.service';
import { LanguageService } from '../../core/language.service';

@Component({
  selector: 'app-stack-strip',
  templateUrl: './stack-strip.component.html',
})
export class StackStripComponent {
  private readonly languageService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly content = this.languageService.content;

  constructor() {
    this.analytics.trackComponentView('stack-strip');
  }
}
