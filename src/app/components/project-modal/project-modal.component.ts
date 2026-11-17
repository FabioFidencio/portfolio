import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { AnalyticsService } from '../../core/analytics.service';
import { LanguageService } from '../../core/language.service';
import { mailto } from '../../core/links';
import type { Project } from '../../portfolio.data';

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
})
export class ProjectModalComponent implements OnInit, OnDestroy {
  private readonly languageService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);

  readonly project = input.required<Project>();
  readonly closed = output<void>();

  protected readonly content = this.languageService.content;
  protected readonly profile = this.languageService.profile;
  protected readonly mailtoHref = computed(() =>
    mailto(
      this.profile().email,
      `${this.content().modal.caseStudySubject} ${this.project().name}`,
    ),
  );

  private readonly dialogClose = viewChild<ElementRef<HTMLButtonElement>>('dialogClose');
  private readonly previouslyFocused =
    typeof document !== 'undefined' && document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  constructor() {
    this.analytics.trackComponentView('project-modal');

    afterNextRender(() => {
      document.body.classList.add('modal-open');
      this.dialogClose()?.nativeElement.focus();
    });
  }

  ngOnInit(): void {
    this.analytics.trackEvent('project_view', { project: this.project().id }, 'project-modal');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('modal-open');
    this.previouslyFocused?.focus();
  }

  @HostListener('document:keydown.escape')
  protected close(): void {
    this.requestClose('escape');
  }

  protected requestClose(method: 'button' | 'backdrop' | 'escape'): void {
    this.analytics.trackEvent('project_close', { project: this.project().id, method }, 'project-modal');
    this.closed.emit();
  }

  protected trackRepo(): void {
    this.analytics.trackEvent(
      'repo_click',
      { project: this.project().id, placement: 'modal' },
      'project-modal',
    );
  }

  protected trackAsk(): void {
    this.analytics.trackEvent(
      'cta_click',
      { label: 'ask_about_project', project: this.project().id },
      'project-modal',
    );
  }
}
