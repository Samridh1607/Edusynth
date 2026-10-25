import { Injectable, signal } from '@angular/core';
import { readJson, writeJson } from './browser-storage';

export type AuthTab = 'signin' | 'signup';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
  acceptedTermsAt: string;
}

/** Strictly necessary session flag. Cleared when the browser closes. */
const SESSION_KEY = 'edu_session';

/**
 * Holds sign-in state and the auth modal's open/tab state.
 *
 * Like the original page, sign-in is simulated on the client. Replace the
 * bodies of signIn() and signUp() with calls to a real identity provider
 * before launch. Never store passwords in the browser.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authenticated = signal(readJson<boolean>('session', SESSION_KEY) === true);

  readonly isAuthenticated = this.authenticated.asReadonly();
  readonly modalOpen = signal(false);
  readonly activeTab = signal<AuthTab>('signin');

  openModal(tab: AuthTab = 'signin'): void {
    this.activeTab.set(tab);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  signIn(_request: SignInRequest): void {
    // TODO: call the authentication backend.
    this.setAuthenticated(true);
  }

  signUp(_request: SignUpRequest): void {
    // TODO: call the authentication backend and store acceptedTermsAt
    // server-side as the record of the user's consent.
    this.setAuthenticated(true);
  }

  private setAuthenticated(value: boolean): void {
    this.authenticated.set(value);
    writeJson('session', SESSION_KEY, value ? true : null);
  }
}
