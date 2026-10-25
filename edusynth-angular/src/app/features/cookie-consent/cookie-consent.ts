import { Component, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../../core/consent.service';

/**
 * First-visit cookie banner plus the "Cookie settings" panel.
 * Accept and Reject are equally prominent, nothing non-essential is
 * pre-ticked, and choices can be changed at any time from the footer.
 */
@Component({
  selector: 'app-cookie-consent',
  imports: [RouterLink],
  templateUrl: './cookie-consent.html',
  styleUrl: './cookie-consent.scss',
  host: { '(document:keydown.escape)': 'consent.closeSettings()' },
})
export class CookieConsent {
  protected readonly consent = inject(ConsentService);

  protected readonly analytics = signal(false);
  protected readonly functional = signal(false);

  constructor() {
    // Each time the panel opens, start from the visitor's saved choices.
    effect(() => {
      if (this.consent.settingsOpen()) {
        untracked(() => {
          this.analytics.set(this.consent.analyticsAllowed());
          this.functional.set(this.consent.functionalAllowed());
        });
      }
    });
  }

  protected saveChoices(): void {
    this.consent.save({ analytics: this.analytics(), functional: this.functional() });
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.consent.closeSettings();
    }
  }
}
