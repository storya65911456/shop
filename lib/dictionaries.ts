import 'server-only';

// 定義支援的語言類型
export type Locale = 'en' | 'zh-TW';

const dictionaries = {
    en: () => import('@/locales/en.json').then((module) => module.default),
    'zh-TW': () => import('@/locales/zh-TW.json').then((module) => module.default)
} as const;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
