import de from './de.json';

import i18n from 'i18next';

i18n.init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    debug: false,

    resources: {
        en: {
            translation: de
        },
        de: {
            translation: de
        }
    },
    interpolation: {
        escapeValue: false
    }
});
export function strings(name: string, params = {}): string {
    try {
        if (name) {
            const key = i18n.t(name, params);

            // If key is missing its easy to see in console
            if (key.indexOf('[missing') != -1) {
                console.info('MISSING', key);
            }
            return key;
        }
        return '';
    } catch (error) {
        console.info(error);
        return name;
    }
}

export default i18n;
