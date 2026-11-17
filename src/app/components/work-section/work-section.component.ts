import { Component, computed, inject, signal } from '@angular/core';
import { AnalyticsService } from '../../core/analytics.service';
import { LanguageService } from '../../core/language.service';
import type { Project } from '../../portfolio.data';
import { ProjectModalComponent } from '../project-modal/project-modal.component';

@Component({
  selector: 'app-work-section',
  imports: [ProjectModalComponent],
  templateUrl: './work-section.component.html',
})
export class WorkSectionComponent {
  private readonly languageService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly content = this.languageService.content;
  protected readonly projects = computed(() => this.content().projects);
  protected readonly featuredProject = computed(() => this.projects()[0]);
  protected readonly secondaryProjects = computed(() => this.projects().slice(1));
  protected readonly selectedProjectId = signal<string | null>(null);
  protected readonly selectedProject = computed(() => {
    const id = this.selectedProjectId();
    return id ? (this.projects().find((project) => project.id === id) ?? null) : null;
  });

  constructor() {
    this.analytics.trackComponentView('work');
  }

  protected openProject(project: Project): void {
    this.selectedProjectId.set(project.id);
    this.analytics.trackEvent('project_open', { project: project.id }, 'work');
  }

  protected closeProject(): void {
    this.selectedProjectId.set(null);
  }

  protected trackRepo(project: Project): void {
    this.analytics.trackEvent('repo_click', { project: project.id, placement: 'work' }, 'work');
  }
}
