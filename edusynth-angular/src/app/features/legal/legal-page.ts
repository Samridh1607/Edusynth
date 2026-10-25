import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Shared card layout for the Privacy, Cookie and Terms pages.
 * The page text is projected into the card body.
 */
@Component({
  selector: 'app-legal-page',
  templateUrl: './legal-page.html',
  host: { class: 'route-host' },
})
export class LegalPage {
  readonly icon = input.required<string>();
  readonly heading = input.required<string>();
  readonly subtitle = input.required<string>();

  private readonly location = inject(Location);
  private readonly router = inject(Router);

  /** Returns to the previous in-app page, or home when opened directly. */
  protected back(): void {
    const state = this.location.getState() as { navigationId?: number } | null;
    if ((state?.navigationId ?? 1) > 1) {
      this.location.back();
    } else {
      void this.router.navigate(['/']);
    }
  }
}
