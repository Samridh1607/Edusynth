import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'dropdownOpen.set(false)',
  },
})
export class Header {
  protected readonly dropdownOpen = signal(false);

  protected toggleDropdown(): void {
    this.dropdownOpen.update((open) => !open);
  }

  protected showSupport(option: string, event: Event): void {
    event.preventDefault();
    window.alert(`You selected: ${option}\nThis would open the appropriate support interface.`);
    this.dropdownOpen.set(false);
  }

  protected showUserInfo(): void {
    window.alert('User Information\n\nThis would display user profile details, settings, and preferences.');
  }

  /** Closes the Support menu when clicking anywhere except its button. */
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as Element | null;
    if (!target?.closest('.dropdown-btn')) {
      this.dropdownOpen.set(false);
    }
  }
}
