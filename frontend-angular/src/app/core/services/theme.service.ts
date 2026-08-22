import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly storageKey =
    'minitask-angular-theme';

  readonly theme =
    signal<Theme>(this.getInitialTheme());

  readonly isDarkMode =
    computed(() => this.theme() === 'dark');

  constructor() {
    effect(() => {
      const currentTheme = this.theme();

      this.document.documentElement.setAttribute(
        'data-theme',
        currentTheme,
      );

      this.saveTheme(currentTheme);
    });
  }

  toggle(): void {
    this.theme.update((currentTheme) =>
      currentTheme === 'light'
        ? 'dark'
        : 'light',
    );
  }

  private getInitialTheme(): Theme {
    const savedTheme = this.readSavedTheme();

    if (
      savedTheme === 'light' ||
      savedTheme === 'dark'
    ) {
      return savedTheme;
    }

    const prefersDark =
      this.document.defaultView
        ?.matchMedia?.(
          '(prefers-color-scheme: dark)',
        )
        .matches ?? false;

    return prefersDark
      ? 'dark'
      : 'light';
  }

  private readSavedTheme(): string | null {
    try {
      return this.document.defaultView
        ?.localStorage
        .getItem(this.storageKey) ?? null;
    } catch {
      return null;
    }
  }

  private saveTheme(theme: Theme): void {
    try {
      this.document.defaultView
        ?.localStorage
        .setItem(
          this.storageKey,
          theme,
        );
    } catch {
      // The theme still works when storage is unavailable.
    }
  }
}