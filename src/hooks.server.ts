import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

// Mock user for testing (bypasses database)
const MOCK_USER = {
	id: 'test-user-123',
	username: 'testuser'
};

const MOCK_SESSION = {
	id: 'test-session-123',
	userId: 'test-user-123',
	expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days from now
};

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	
	// Check for mock authentication cookie
	const mockAuth = event.cookies.get('mock-auth');
	
	if (mockAuth === 'true') {
		// Use mock user for testing
		event.locals.user = MOCK_USER;
		event.locals.session = MOCK_SESSION;
		return resolve(event);
	}

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

export const handle: Handle = handleAuth;
