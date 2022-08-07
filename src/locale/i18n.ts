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

export default i18n.t;
