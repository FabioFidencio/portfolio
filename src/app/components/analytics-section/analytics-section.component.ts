import { Component, computed, inject } from '@angular/core';
import {
  AnalyticsService,
  type AnalyticsEventEntry,
} from '../../core/analytics.service';
import { LanguageService } from '../../core/language.service';

interface ComponentRow {
  name: string;
  count: number;
  width: number;
}

@Component({
  selector: 'app-analytics-section',
  templateUrl: './analytics-section.component.html',
})
export class AnalyticsSectionComponent {
  private readonly languageService = inject(LanguageService);
  protected readonly analytics = inject(AnalyticsService);

  protected readonly content = this.languageService.content;
  protected readonly language = this.languageService.language;
  protected readonly locale = computed(() => (this.language() === 'en' ? 'EN' : 'PT-BR'));
  protected readonly recentEvents = computed(() => this.analytics.events().slice(0, 12));

  protected readonly componentRows = computed<ComponentRow[]>(() => {
    const views = this.analytics.componentViews();
    const max = this.analytics.maxComponentViews();

    return Object.entries(views)
      .map(([name, count]) => ({
        name,
        count,
        width: Math.max(6, Math.round((count / max) * 100)),
      }))
      .sort((a, b) => b.count - a.count);
  });

  protected readonly statusReady = computed(() => this.analytics.status() === 'ready');

  protected readonly statusLabel = computed(() => {
    const copy = this.content().analytics;

    switch (this.analytics.status()) {
      case 'ready':
        return copy.statusReady;
      case 'loading':
        return copy.statusLoading;
      case 'error':
        return copy.statusError;
      default:
        return copy.statusLocal;
    }
  });

  protected readonly codeSample = `// 1. One service, provided at the root
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  trackEvent(name: string, params = {}) {
    this.events.update((log) => [entry, ...log].slice(0, 200));
    window.gtag?.('event', name, params);
  }

  trackComponentView(component: string) {
    this.componentViews.update(...);
    this.trackEvent('section_view', { component });
  }
}

// 2. Every component reports itself
private readonly analytics = inject(AnalyticsService);

constructor() {
  this.analytics.trackComponentView('hero');
}

// 3. Interactions are events, not guesses
onCtaClick() {
  this.analytics.trackEvent('cta_click', {
    label: 'selected_work',
    target: 'work',
  });
}`;

  constructor() {
    this.analytics.trackComponentView('analytics');
  }

  protected reset(): void {
    this.analytics.resetLog();
  }

  protected formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString(this.language() === 'pt-BR' ? 'pt-BR' : 'en', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  protected isoTimestamp(timestamp: number): string {
    return new Date(timestamp).toISOString();
  }

  protected describe(event: AnalyticsEventEntry): string {
    if (event.name === 'page_view') {
      try {
        return new URL(String(event.parameters['page_location'])).pathname;
      } catch {
        return '/';
      }
    }

    const entries = Object.entries(event.parameters);
    if (!entries.length) {
      return '—';
    }

    return entries.map(([key, value]) => `${key}=${value}`).join(' · ');
  }
}
