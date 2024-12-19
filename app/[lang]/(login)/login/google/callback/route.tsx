import db from '@/db/db';
import {
    createAuthSession,
    createUser,
    findUserByEmail,
    findUserByGoogleId
} from '@/lib/auth';
import { google } from '@/lib/google';
import { OAuth2RequestError } from 'arctic';
import { generateIdFromEntropySize } from 'lucia';
import { cookies } from 'next/headers';

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const storedState = (await cookies()).get('google_oauth_state')?.value ?? null;
    const codeVerifier = (await cookies()).get('google_code_verifier')?.value ?? null;
    if (!code || !state || !storedState || !codeVerifier) {
        return new Response(null, {
            status: 400
        });
    }
    if (state !== storedState) {
        return new Response('Please restart the process.', {
            status: 400
        });
    }

    try {
        const tokens = await google.validateAuthorizationCode(code, codeVerifier);
        const accessToken =
            typeof tokens.accessToken === 'function'
                ? tokens.accessToken()
                : tokens.accessToken;

        const googleUserResponse = await fetch(
            'https://openidconnect.googleapis.com/v1/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'User-Agent': 'next-auth',
                    Accept: 'application/json'
                }
            }
        );

        if (!googleUserResponse.ok) {
            console.error('Google API Error:', {
                status: googleUserResponse.status,
                statusText: googleUserResponse.statusText
            });
            throw new Error('Failed to fetch Google user');
        }

        const googleUser: GoogleUser = await googleUserResponse.json();

        let userId: string | undefined;
        let existingUser = await findUserByGoogleId(googleUser.sub);

        if (!existingUser && googleUser.email) {
            existingUser = await findUserByEmail(googleUser.email);
        }

        if (existingUser) {
            if (!existingUser.google_id) {
                db.prepare(
                    `
                    UPDATE users 
                    SET google_id = ?, 
                        provider = CASE 
                            WHEN provider = 'local' THEN 'google' 
                            ELSE provider 
                        END,
                        name = COALESCE(?, name)
                    WHERE id = ?
                `
                ).run(googleUser.sub, googleUser.name, existingUser.id);
            }
            userId = existingUser.id.toString();
        } else {
            userId = await createUser({
                email: googleUser.email,
                name: googleUser.name,
                provider: 'google',
                google_id: googleUser.sub
            });
        }

        await createAuthSession(userId);

        return new Response(null, {
            status: 302,
            headers: {
                Location: '/'
            }
        });
    } catch (e) {
        console.error('Auth error:', e);

        if (e instanceof OAuth2RequestError) {
            return new Response(null, {
                status: 400
            });
        }

        return new Response(null, {
            status: 500
        });
    }
}

interface GoogleUser {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
}
