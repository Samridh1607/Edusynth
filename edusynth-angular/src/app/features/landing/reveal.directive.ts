import { DestroyRef, Directive, ElementRef, afterNextRender, inject, signal } from '@angular/core';

/**
 * Fades and slides its host into place the first time it scrolls into view.
 * The motion itself lives in the `.reveal` styles in styles.scss.
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal', '[class.is-visible]': 'visible()' },
})
export class Reveal {
  protected readonly visible = signal(false);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') {
        this.visible.set(true);
        return;
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          this.visible.set(true);
          observer.disconnect();
        },
        { threshold: 0.15 },
      );
      observer.observe(host.nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
