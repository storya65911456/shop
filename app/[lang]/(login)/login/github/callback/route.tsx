import db from '@/db/db';
import { createAuthSession } from '@/lib/auth';
import { github } from '@/lib/github';
import { createUser, findUserByEmail, findUserByGithubId } from '@/lib/user';
import { OAuth2RequestError } from 'arctic';
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

        const emailsResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'User-Agent': 'next-auth',
                Accept: 'application/json'
            }
        });

        const emails: Array<{ email: string; primary: boolean; verified: boolean }> =
            await emailsResponse.json();
        const primaryEmail = emails.find((email) => email.primary)?.email;

        let userId: string | undefined;
        let existingUser = await findUserByGithubId(githubUser.id);

        if (!existingUser && primaryEmail) {
            existingUser = await findUserByEmail(primaryEmail);
        }

        if (existingUser) {
            if (!existingUser.github_id) {
                db.prepare(
                    `
                    UPDATE users 
                    SET github_id = ?, 
                        provider = CASE 
                            WHEN provider = 'local' THEN 'github' 
                            ELSE provider 
                        END,
                        name = COALESCE(?, name)
                    WHERE id = ?
                `
                ).run(
                    githubUser.id,
                    githubUser.name || githubUser.login,
                    existingUser.id
                );
            }
            userId = existingUser.id.toString();
        } else {
            userId = await createUser({
                email: primaryEmail,
                name: githubUser.name || githubUser.login,
                provider: 'github',
                github_id: githubUser.id
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

interface GitHubUser {
    id: string;
    login: string;
    name?: string;
}
