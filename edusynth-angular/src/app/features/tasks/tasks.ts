import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TASK_CATEGORIES } from './tasks.data';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.html',
  host: { class: 'route-host' },
})
export class Tasks {
  private readonly router = inject(Router);

  protected readonly categories = TASK_CATEGORIES;
  /** Core Tasks starts expanded, as on the original page. */
  private readonly openIds = signal<ReadonlySet<string>>(new Set(['cat-existing']));

  protected isOpen(id: string): boolean {
    return this.openIds().has(id);
  }

  protected toggleCategory(id: string): void {
    this.openIds.update((ids) => {
      const next = new Set(ids);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected launchTask(taskType: string): void {
    window.alert(`Launching ${taskType} task...\nThis would navigate to the ${taskType} interface.`);
  }

  protected backToLanding(): void {
    void this.router.navigate(['/']);
  }
}
