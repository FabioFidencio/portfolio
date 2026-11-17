import { Injectable, computed, signal } from '@angular/core';
import { analyticsConfig, isMeasurementIdConfigured } from './analytics.config';

export type AnalyticsStatus = 'local' | 'loading' | 'ready' | 'error';
export type AnalyticsParameter = string | number | boolean;
export type AnalyticsParameters = Record<string, AnalyticsParameter>;

export interface AnalyticsEventEntry {
  id: number;
  name: string;
  component: string;
  parameters: AnalyticsParameters;
  timestamp: number;
}

interface GtagWindow extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

const MAX_LOCAL_EVENTS = 200;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  readonly measurementId = analyticsConfig.measurementId;
  readonly configured = isMeasurementIdConfigured(analyticsConfig.measurementId);
  readonly startedAt = Date.now();

  readonly status = signal<AnalyticsStatus>(this.configured ? 'loading' : 'local');
  readonly events = signal<AnalyticsEventEntry[]>([]);
  readonly componentViews = signal<Record<string, number>>({});

  readonly totalEvents = computed(() => this.events().length);
  readonly pageViews = computed(
    () => this.events().filter((event) => event.name === 'page_view').length,
  );
  readonly trackedComponents = computed(() => Object.keys(this.componentViews()).length);
  readonly maxComponentViews = computed(() =>
    Math.max(1, ...Object.values(this.componentViews())),
  );

  private initialized = false;
  private nextEventId = 1;

  /** Boots the Google tag once. Safe to call from the root component. */
  init(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }

    this.initialized = true;

    if (!this.configured) {
      this.trackPageView();
      return;
    }

    const taggedWindow = window as GtagWindow;
    taggedWindow.dataLayer = taggedWindow.dataLayer ?? [];
    taggedWindow.gtag =
      taggedWindow.gtag ??
      ((...args: unknown[]) => {
        taggedWindow.dataLayer?.push(args);
      });

    taggedWindow.gtag('js', new Date());
    taggedWindow.gtag('config', this.measurementId, {
      send_page_view: false,
      anonymize_ip: true,
    });

    this.trackPageView();

    const selector = `script[data-ga-id="${this.measurementId}"]`;
    if (document.querySelector(selector)) {
      this.status.set('ready');
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(this.measurementId)}`;
    script.dataset['gaId'] = this.measurementId;
    script.addEventListener('load', () => {
      this.status.set('ready');
      this.trackEvent('analytics_ready', { transport: 'gtag' }, 'analytics');
    });
    script.addEventListener('error', () => {
      this.status.set('error');
      this.trackEvent('analytics_error', { transport: 'gtag' }, 'analytics');
    });
    document.head.appendChild(script);
  }

  /** Sends a GA4 page_view and mirrors it into the in-page event log. */
  trackPageView(extra: AnalyticsParameters = {}): void {
    this.trackEvent(
      'page_view',
      {
        page_location: typeof window === 'undefined' ? '' : window.location.href,
        page_title: typeof document === 'undefined' ? '' : document.title,
        ...extra,
      },
      'app-shell',
    );
  }

  /**
   * Called once by every component so the dashboard can prove that each one
   * is instrumented. The component name doubles as the GA4 "component" param.
   */
  trackComponentView(component: string, label?: string): void {
    this.componentViews.update((views) => ({
      ...views,
      [component]: (views[component] ?? 0) + 1,
    }));

    this.trackEvent(
      'section_view',
      label ? { component, label } : { component },
      component,
    );
  }

  trackEvent(name: string, parameters: AnalyticsParameters = {}, component = 'app'): void {
    const entry: AnalyticsEventEntry = {
      id: this.nextEventId++,
      name,
      component,
      parameters,
      timestamp: Date.now(),
    };

    this.events.update((events) => [entry, ...events].slice(0, MAX_LOCAL_EVENTS));

    if (!this.configured || typeof window === 'undefined') {
      return;
    }

    (window as GtagWindow).gtag?.('event', name, parameters);

    if (analyticsConfig.debug) {
      console.debug('[analytics]', name, parameters);
    }
  }

  /** Clears the in-page log while keeping the accumulated component counts. */
  resetLog(): void {
    this.events.set([]);
    this.trackEvent('analytics_reset', { transport: this.configured ? 'gtag' : 'local' }, 'analytics');
  }
}
