import type { Locale } from '@/lib/dictionaries';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const locales = ['en', 'zh-TW'] as const;

// 獲取偏好語言
function getLocale(request: NextRequest): Locale {
    // 檢查 cookie
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && locales.includes(cookieLocale as Locale)) {
        return cookieLocale as Locale;
    }

    // 檢查 Accept-Language header
    const acceptLanguage = request.headers.get('Accept-Language');
    if (acceptLanguage) {
        if (acceptLanguage.startsWith('zh')) {
            return 'zh-TW';
        }
    }

    // 預設語言
    return 'en';
}

export function middleware(request: NextRequest) {
    // 檢查路徑中是否已包含語言設定
    const { pathname } = request.nextUrl;
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    // 如果沒有語言設定，進行重定向
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        // 跳過所有內部路徑 (_next)
        '/((?!_next).*)'
    ]
};
