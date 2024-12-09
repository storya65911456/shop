// 定義支援的語言類型
export type Locale = 'en' | 'zh-TW';

// 定義字典的類型en，zh-TW內的類型
export interface Dictionary {
    products: {
        cart: string;
    };
    authFrom: {
        error: string;
        email: string;
        emailPlaceholder: string;
        emailError: string;
        password: string;
        passwordPlaceholder: string;
        passwordError: string;
        button: {
            login: string;
            signin: string;
        };
        link: {
            login: string;
            signin: string;
        };
    };
}

const dictionaries = {
    en: () => import('@/locales/en.json').then((module) => module.default),
    'zh-TW': () => import('@/locales/zh-TW.json').then((module) => module.default)
} as const;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
