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
            sign: string;
        };
        link: {
            login: string;
            sign: string;
        };
        divider: string;
    };
    account: {
        menu: {
            profile: string;
            editPassword: string;
        };
        profile: {
            title: string;
            fileList: string;
            fileListDescription: string;
            fileListItems: {
                username: string;
                nickname: string;
                email: string;
            };
            fileListItemsPicture: {
                text1: string;
                text2: string;
            };
            button: {
                select: string;
                save: string;
            };
        };
    };
    header: {
        language: string;
        languageDropdown: {
            'zh-TW': string;
            en: string;
        };
        searchPlaceholder: string;
        button: {
            login: string;
            sign: string;
            logout: string;
            back: string;
            help: string;
            notification: string;
            seller: string;
            follow: string;
        };
        account: {
            myAccount: string;
            profile: string;
            orders: string;
        };
    };
}

const dictionaries = {
    en: () => import('../locales/en.json').then((module) => module.default),
    'zh-TW': () => import('../locales/zh-TW.json').then((module) => module.default)
} as const;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
