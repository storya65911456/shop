import { google } from '@/lib/google';
import { generateCodeVerifier, generateState } from 'arctic';
import { cookies } from 'next/headers';

export async function GET(): Promise<Response> {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const scopes = ['openid', 'profile', 'email'];
    const url = google.createAuthorizationURL(state, codeVerifier, scopes);

    (await cookies()).set('google_oauth_state', state, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax'
    });
    (await cookies()).set('google_code_verifier', codeVerifier, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 10, // 10 minutes
        sameSite: 'lax'
    });

    return Response.redirect(url);
}
