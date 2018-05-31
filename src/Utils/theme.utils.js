import { SetItem, GetItem } from './localStorage.utils';

let themes = [
    { theme: 'drivezy-light-theme', name: 'Light', class: 'light-theme' },
    { theme: 'drivezy-dark-theme', name: 'Dark', class: 'dark-theme' },
    { theme: 'drivezy-drivezy-theme', name: 'Drivezy', class: 'drivezy-theme' }
];

let currentTheme = {};

export default class ThemeUtil {

    static setTheme(theme) {
        SetItem('CURRENT_THEME', theme);
        const div = document.getElementById('parent-admin-element');

        themes.forEach((themeDetail, key) => {
            if (themeDetail.theme != theme.theme) {
                div.classList.remove(themeDetail.theme);
                return;
            }

            div.classList.add(theme.theme);
        });
    }

    static getThemes() {
        return themes;
    }

    static getCurrentTheme() {
        return GetItem('CURRENT_THEME') || themes[1];
    }
}

