export const i18n = {
    defaultLocale: 'en',
    locales: ['en', 'zh-tw'] as const
} as const;

export type Locale = (typeof i18n.locales)[number];
