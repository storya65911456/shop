import db from '@/db/db';
import { lucia } from '@/lib/auth';
import { github } from '@/lib/github';
import { OAuth2RequestError } from 'arctic';
import { generateIdFromEntropySize } from 'lucia';
import { cookies } from 'next/headers';

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const storedState = (await cookies()).get('github_oauth_state')?.value ?? null;
    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: 400
        });
    }

    try {
        const tokens = await github.validateAuthorizationCode(code);
        const accessToken =
            typeof tokens.accessToken === 'function'
                ? tokens.accessToken()
                : tokens.accessToken;

        const githubUserResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'User-Agent': 'next-auth',
                Accept: 'application/json'
            }
        });

        if (!githubUserResponse.ok) {
            console.error('GitHub API Error:', {
                status: githubUserResponse.status,
                statusText: githubUserResponse.statusText
            });
            throw new Error('Failed to fetch GitHub user');
        }

        const githubUser: GitHubUser = await githubUserResponse.json();
        console.log('GitHub user:', githubUser);

        const userId = generateIdFromEntropySize(10);

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

interface GitHubUser {
    id: string;
    login: string;
}
