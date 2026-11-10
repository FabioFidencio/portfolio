export type Language = 'en' | 'pt-BR';
export type NavSection = 'work' | 'skills' | 'engineering' | 'design' | 'experience';
export type SkillCategory = 'framework' | 'language' | 'craft' | 'quality';
export type SkillFilter = 'all' | SkillCategory;
export type SpecimenTab = 'foundations' | 'components' | 'motion';
export type FeatureId = 'signals' | 'control-flow' | 'accessibility' | 'performance';
export type CodeTone = 'key' | 'str' | 'com';
export type CodeToken = { text: string; tone?: CodeTone };
export type CodeLine = CodeToken[];

export interface NavItem {
  id: NavSection;
  label: string;
}

export interface Project {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  year: string;
  role: string;
  summary: string;
  challenge: string;
  approach: string[];
  results: { value: string; label: string }[];
  stack: string[];
  url: string;
}

export interface Feature {
  id: FeatureId;
  label: string;
  title: string;
  file: string;
  language: string;
  description: string;
  bullets: string[];
  code: CodeLine[];
}

export interface Skill {
  name: string;
  detail: string;
  category: SkillCategory;
  level: number;
}

export interface SkillFilterOption {
  id: SkillFilter;
  label: string;
}

export interface ExperienceRow {
  period: string;
  role: string;
  org: string;
  current?: boolean;
  summary: string;
  points: string[];
  tags: string[];
}

export interface ArchitectureCard {
  icon: string;
  title: string;
  body: string;
  token: string;
}

export interface Principle {
  title: string;
  body: string;
}

export interface Swatch {
  name: string;
  hex: string;
}

export interface DeployRow {
  name: string;
  meta: string;
  status: string;
}

/* --------------------------------------------------------------------------
 * EDIT ME: personal details. Translated copy lives in translations.ts.
 * ----------------------------------------------------------------------- */
export const profile = {
  name: 'Fábio Fidencio',
  shortName: 'Fábio',
  email: 'fabio.augusto.az@gmail.com',
  github: 'https://github.com/FabioFidencio',
  linkedin: 'https://www.linkedin.com/in/fabio-fidencio/',
};

export const chartBars = [42, 58, 50, 74, 66, 82, 71];

const t = (text: string, tone?: CodeTone): CodeToken => ({ text, tone });
const line = (...tokens: CodeToken[]): CodeLine => tokens;

export const featureCode: Record<FeatureId, CodeLine[]> = {
  signals: [
    line(t('// Derived state stays derived.', 'com')),
    line(
      t('import', 'key'),
      t(' { '),
      t('computed', 'key'),
      t(', '),
      t('signal', 'key'),
      t(' } '),
      t('from', 'key'),
      t(" '@angular/core'", 'str'),
      t(';'),
    ),
    line(),
    line(t('export class', 'key'), t(' IssueStore {')),
    line(t('  readonly', 'key'), t(' issues = '), t('signal', 'key'), t('<Issue[]>([]);')),
    line(t('  readonly', 'key'), t(' query = '), t('signal', 'key'), t("('');")),
    line(t('  readonly', 'key'), t(' openOnly = '), t('signal', 'key'), t('(false);')),
    line(),
    line(t('  readonly', 'key'), t(' visible = '), t('computed', 'key'), t('(() =>')),
    line(t('    this.issues().filter((issue) =>')),
    line(t('      issue.title.toLowerCase().includes(this.query().toLowerCase()) &&')),
    line(t("      (!this.openOnly() || issue.status === 'open')")),
    line(t('    )')),
    line(t('  );')),
    line(t('}')),
  ],
  'control-flow': [
    line(t('// Template logic without directive imports.', 'com')),
    line(t('@if', 'key'), t(' (project(); as project) {')),
    line(t('  <app-project-header [project]="project" />')),
    line(t('} ', 'key'), t('@else', 'key'), t(' {')),
    line(t('  <app-empty-state />')),
    line(t('}')),
    line(),
    line(t('@for', 'key'), t(' (task of project.tasks; '), t('track', 'key'), t(' task.id) {')),
    line(t('  <app-task-row [task]="task" />')),
    line(t('} ', 'key'), t('@empty', 'key'), t(' {')),
    line(t('  <p>No tasks yet.</p>')),
    line(t('}')),
    line(),
    line(t('@defer', 'key'), t(' (on viewport) {')),
    line(t('  <app-activity-feed />')),
    line(t('}')),
  ],
  accessibility: [
    line(t('<!-- Semantic first. ARIA second. -->', 'com')),
    line(t('<button')),
    line(t('  type="button"')),
    line(t('  [attr.aria-expanded]="menuOpen()"')),
    line(t('  aria-controls="primary-navigation"')),
    line(t('  (click)="toggleMenu()">')),
    line(t("  {{ menuOpen() ? 'Close menu' : 'Open menu' }}")),
    line(t('</button>')),
    line(),
    line(t('@HostListener', 'key'), t("('document:keydown.escape')")),
    line(t('closeMenu(): ', 'key'), t('void', 'key'), t(' {')),
    line(t('  this.menuOpen.'), t('set', 'key'), t('(false);')),
    line(t('}')),
  ],
  performance: [
    line(t('// Split at the page boundary.', 'com')),
    line(t('export const', 'key'), t(' routes: Routes = [')),
    line(t('  {')),
    line(t('    path: ', 'key'), t("'reports'", 'str'), t(',')),
    line(t('    loadComponent: ', 'key'), t('() =>')),
    line(t('      '), t('import', 'key'), t("('./reports/reports.page')", 'str')),
    line(t('        .then((m) => m.ReportsPage),')),
    line(t('  },')),
    line(t('];')),
    line(),
    line(t('// angular.json — fail the build, not the user.', 'com')),
    line(t('"budgets": [{')),
    line(t('  "type": "initial",', 'str')),
    line(t('  "maximumWarning": "180kB"', 'str')),
    line(t('}]')),
  ],
};
