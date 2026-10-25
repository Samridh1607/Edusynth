import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { AUDIENCES, CAPABILITIES, HERO_AUDIENCES, STATS, STEPS, Stat } from './landing.data';
import { Reveal } from './reveal.directive';

const COUNT_UP_MS = 1600;
const WORD_ROTATE_MS = 2500;

@Component({
  selector: 'app-landing',
  imports: [Reveal],
  templateUrl: './landing.html',
  host: { class: 'route-host' },
})
export class Landing {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly capabilities = CAPABILITIES;
  protected readonly steps = STEPS;
  protected readonly audiences = AUDIENCES;
  protected readonly stats = STATS;
  protected readonly heroAudiences = HERO_AUDIENCES;

  /** Index into heroAudiences of the word currently shown in the hero. */
  protected readonly heroWordIndex = signal(0);

  private readonly statsSection = viewChild.required<ElementRef<HTMLElement>>('statsSection');
  /** 0 → 1 as the statistics count up; starts at 1 if animation is skipped. */
  private readonly statsProgress = signal(0);

  constructor() {
    afterNextRender(() => {
      this.rotateHeroWord();
      this.countUpWhenVisible();
    });
  }

  /** Signed-in users go straight to their tasks; others are asked to sign in. */
  protected start(): void {
    if (this.auth.isAuthenticated()) {
      void this.router.navigate(['/tasks']);
    } else {
      this.auth.openModal('signin');
    }
  }

  protected scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  protected formatStat(stat: Stat): string {
    const current = stat.value * this.statsProgress();
    const decimals = Number.isInteger(stat.value) ? 0 : 1;
    return current.toLocaleString('en', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  private rotateHeroWord(): void {
    const timer = setInterval(
      () => this.heroWordIndex.update((i) => (i + 1) % this.heroAudiences.length),
      WORD_ROTATE_MS,
    );
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  /** Animates the statistics once, the first time they scroll into view. */
  private countUpWhenVisible(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      this.statsProgress.set(1);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const startedAt = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - startedAt) / COUNT_UP_MS, 1);
          this.statsProgress.set(1 - Math.pow(1 - t, 3));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(this.statsSection().nativeElement);

    this.destroyRef.onDestroy(() => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    });
  }
}
