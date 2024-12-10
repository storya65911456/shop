export type Locale = 'en' | 'zh-TW';

export interface Dictionary {
    products: {
        cart: string;
    };
    authFrom: {
        error: string;
        email: string;
        emailPlaceholder: string;
        emailError: string;
        emailUniqueError: string;
        emailNotFound: string;
        password: string;
        passwordPlaceholder: string;
        passwordError: string;
        passwordIncorrect: string;
        button: {
            login: string;
            signin: string;
            logout: string;
            back: string;
        };
        link: {
            login: string;
            signin: string;
        };
    };
}

const dictionaries = {
    en: () => import('../locales/en.json').then((module) => module.default),
    'zh-TW': () => import('../locales/zh-TW.json').then((module) => module.default)
} as const;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
