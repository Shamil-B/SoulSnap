import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly THEME_KEY = 'soulsnap-theme';
    isDark = true;

    constructor() {
        const saved = localStorage.getItem(this.THEME_KEY);
        this.isDark = saved !== 'light';
        this.applyTheme();
    }

    toggle() {
        this.isDark = !this.isDark;
        localStorage.setItem(this.THEME_KEY, this.isDark ? 'dark' : 'light');
        this.applyTheme();
    }

    private applyTheme() {
        document.body.classList.toggle('light-theme', !this.isDark);
    }
}
