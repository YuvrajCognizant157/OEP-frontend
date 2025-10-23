import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  
  // 1. Create a private, writable signal
  // Default to true (visible)
  private layoutVisible = signal(true);

  // 2. Expose it as a public, readonly signal
  // Components can read this, but not set it.
  public isLayoutVisible = this.layoutVisible.asReadonly();

  constructor() { }

  showLayout() {
    this.layoutVisible.set(true); // Use .set() to update
  }

  hideLayout() {
    this.layoutVisible.set(false); // Use .set() to update
  }
}