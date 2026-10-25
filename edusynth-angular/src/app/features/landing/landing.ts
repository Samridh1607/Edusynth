import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  host: { class: 'route-host' },
})
export class Landing {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Signed-in users go straight to their tasks; others are asked to sign in. */
  protected start(): void {
    if (this.auth.isAuthenticated()) {
      void this.router.navigate(['/tasks']);
    } else {
      this.auth.openModal('signin');
    }
  }
}
