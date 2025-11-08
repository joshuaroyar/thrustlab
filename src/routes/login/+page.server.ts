import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions = {
	mockLogin: async ({ cookies }) => {
		// Set mock authentication cookie
		cookies.set('mock-auth', 'true', {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});
		
		throw redirect(303, '/dashboard');
	},
	
	logout: async ({ cookies }) => {
		// Delete mock authentication cookie
		cookies.delete('mock-auth', { path: '/' });
		
		throw redirect(303, '/');
	}
} satisfies Actions;
