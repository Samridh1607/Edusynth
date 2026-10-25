import { Injectable, computed, signal } from '@angular/core';
import { deleteCookies, readJson, writeJson } from './browser-storage';

export interface ConsentChoices {
  analytics: boolean;
  functional: boolean;
}

interface StoredConsent extends ConsentChoices {
  version: number;
  decidedAt: string;
}

const CONSENT_KEY = 'edu_consent';
/** Bump this when the Cookie Policy changes materially to ask again. */
const CONSENT_VERSION = 1;
/** Ask again after 12 months, in line with common EU regulator guidance. */
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

const ANALYTICS_COOKIES = ['edu_analytics_id', 'edu_perf'] as const;
const FUNCTIONAL_COOKIES = ['edu_prefs'] as const;

/**
 * Records and exposes the visitor's cookie choices.
 *
 * Non-essential cookies are off until the visitor opts in. A browser
 * Do Not Track or Global Privacy Control signal is treated as a refusal,
 * as promised in the Cookie Policy.
 *
 * Load analytics such as Azure Application Insights only when
 * analyticsAllowed() is true.
 */
@Injectable({ providedIn: 'root' })
export class ConsentService {
  readonly privacySignal = detectPrivacySignal();

  private readonly stored = signal<StoredConsent | null>(loadConsent());

  readonly settingsOpen = signal(false);
  readonly hasDecided = computed(() => this.privacySignal || this.stored() !== null);
  readonly analyticsAllowed = computed(() => !this.privacySignal && this.stored()?.analytics === true);
  readonly functionalAllowed = computed(() => !this.privacySignal && this.stored()?.functional === true);

  acceptAll(): void {
    this.save({ analytics: true, functional: true });
  }

  rejectNonEssential(): void {
    this.save({ analytics: false, functional: false });
  }

  save(choices: ConsentChoices): void {
    const record: StoredConsent = {
      analytics: choices.analytics && !this.privacySignal,
      functional: choices.functional && !this.privacySignal,
      version: CONSENT_VERSION,
      decidedAt: new Date().toISOString(),
    };
    if (!record.analytics) deleteCookies(ANALYTICS_COOKIES);
    if (!record.functional) deleteCookies(FUNCTIONAL_COOKIES);
    writeJson('local', CONSENT_KEY, record);
    this.stored.set(record);
    this.settingsOpen.set(false);
  }

  openSettings(): void {
    this.settingsOpen.set(true);
  }

  closeSettings(): void {
    this.settingsOpen.set(false);
  }
}

function loadConsent(): StoredConsent | null {
  const record = readJson<StoredConsent>('local', CONSENT_KEY);
  if (!record || record.version !== CONSENT_VERSION) {
    return null;
  }
  const age = Date.now() - Date.parse(record.decidedAt);
  return Number.isFinite(age) && age < CONSENT_MAX_AGE_MS ? record : null;
}

function detectPrivacySignal(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; doNotTrack?: string | null };
  return nav.globalPrivacyControl === true || nav.doNotTrack === '1';
}
