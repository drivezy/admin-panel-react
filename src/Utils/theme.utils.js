import { SetItem, GetItem } from './localStorage.utils';

let themes = [
    { theme: 'drivezy-light-theme', name: 'Light', class: 'light-theme' },
    { theme: 'drivezy-dark-theme', name: 'Dark', class: 'dark-theme' },
    { theme: 'drivezy-drivezy-theme', name: 'Drivezy', class: 'drivezy-theme' }
];

let spacings = [
    {
        name: 'Compact', class: 'compact'
    },
    {
        name: 'Medium', class: 'medium'
    },
    {
        name: 'Large', class: 'large'

    }
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

    static setSpacing(spacing) {
        SetItem('CURRENT_SPACING', spacing);
        const div = document.getElementById('parent-admin-element');

        spacings.forEach((spacingDetail, key) => {
            if (spacingDetail.class != spacing.class) {
                div.classList.remove(spacingDetail.class);
                return;
            }

            div.classList.add(spacing.class);
        });
    }

    static getThemes() {
        return themes;
    }

    static getSpacings() {
        return spacings;
    }

    static getCurrentTheme() {
        return GetItem('CURRENT_THEME') || themes[1];
    }

    static getCurrentSpacing() {
        return GetItem('CURRENT_SPACING') || spacings[1];
    }

}

