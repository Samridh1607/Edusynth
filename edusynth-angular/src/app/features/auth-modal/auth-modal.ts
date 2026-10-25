import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  afterRenderEffect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthTab } from '../../core/auth.service';

const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

@Component({
  selector: 'app-auth-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-modal.html',
  host: { '(document:keydown.escape)': 'onEscape()' },
})
export class AuthModal {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly fb = inject(NonNullableFormBuilder);

  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');
  private returnFocusTo: HTMLElement | null = null;

  protected readonly signInSubmitted = signal(false);
  protected readonly signUpSubmitted = signal(false);

  protected readonly signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected readonly signUpForm = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      ageConfirmed: [false, Validators.requiredTrue],
    },
    { validators: passwordsMatch },
  );

  constructor() {
    // When the dialog appears, remember what had focus and move focus inside.
    afterRenderEffect(() => {
      const dialog = this.dialog()?.nativeElement;
      if (dialog && !dialog.contains(document.activeElement)) {
        this.returnFocusTo = document.activeElement as HTMLElement | null;
        dialog.querySelector<HTMLElement>('.tab-content.active input')?.focus();
      }
    });
  }

  protected switchTab(tab: AuthTab): void {
    this.auth.activeTab.set(tab);
  }

  protected showError(control: AbstractControl, submitted: boolean): boolean {
    return control.invalid && (control.touched || submitted);
  }

  protected passwordMismatch(): boolean {
    const confirm = this.signUpForm.controls.confirmPassword;
    return this.signUpForm.hasError('passwordMismatch') && (confirm.touched || this.signUpSubmitted());
  }

  protected handleSignIn(): void {
    this.signInSubmitted.set(true);
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }
    this.auth.signIn(this.signInForm.getRawValue());
    this.completeAuth();
  }

  protected handleSignUp(): void {
    this.signUpSubmitted.set(true);
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }
    const { fullName, email, password } = this.signUpForm.getRawValue();
    this.auth.signUp({
      fullName: fullName.trim(),
      email,
      password,
      acceptedTermsAt: new Date().toISOString(),
    });
    this.completeAuth();
  }

  protected close(): void {
    this.auth.closeModal();
    this.resetForms();
    const target = this.returnFocusTo;
    this.returnFocusTo = null;
    if (target?.isConnected) {
      target.focus();
    }
  }

  /** Clicking the dimmed backdrop, not the dialog itself, closes the modal. */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  protected onEscape(): void {
    if (this.auth.modalOpen()) {
      this.close();
    }
  }

  /** Keeps Tab and Shift+Tab inside the dialog while it is open. */
  protected trapFocus(event: KeyboardEvent): void {
    const dialog = this.dialog()?.nativeElement;
    if (event.key !== 'Tab' || !dialog) {
      return;
    }
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    );
    if (focusable.length === 0) {
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private completeAuth(): void {
    this.auth.closeModal();
    this.resetForms();
    this.returnFocusTo = null;
    void this.router.navigate(['/tasks']);
  }

  private resetForms(): void {
    this.signInForm.reset();
    this.signUpForm.reset();
    this.signInSubmitted.set(false);
    this.signUpSubmitted.set(false);
  }

  private focusFirstInvalid(): void {
    afterNextRender(
      () => {
        this.dialog()
          ?.nativeElement.querySelector<HTMLElement>('.tab-content.active [aria-invalid="true"]')
          ?.focus();
      },
      { injector: this.injector },
    );
  }
}
