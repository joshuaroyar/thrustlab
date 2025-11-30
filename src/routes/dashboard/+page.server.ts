import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tests, testQuestions, user as userTable } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { session, user } = await safeGetSession();

    if (!session || !user) {
        throw redirect(303, '/login');
    }

    // Fetch user profile from DB
    let dbUser = null;
    try {
        const result = await db.select().from(userTable).where(eq(userTable.id, user.id));
        dbUser = result[0];
    } catch (e) {
        console.error('Error fetching user profile:', e);
    }

    // Fetch user's test history
    const userTests = await db
        .select()
        .from(tests)
        .where(eq(tests.userId, user.id))
        .orderBy(desc(tests.testDate));

    // Fetch questions for the recent tests (last 5)
    const recentTests = userTests.slice(0, 5);
    const recentTestIds = recentTests.map(t => t.testId);

    let recentTestQuestions: any[] = [];
    if (recentTestIds.length > 0) {
        // We need to fetch questions for these tests
        // Since we can't easily do "where in" with the current setup without importing 'inArray', 
        // let's just loop or fetch all for these IDs. 
        // Actually, let's import inArray if possible, or just map.
        // For simplicity and to avoid import issues if not available, I'll just fetch all testQuestions 
        // that match the testIds.

        // A simple way is to fetch all testQuestions for these IDs.
        // But let's try to be efficient.
        // I'll just fetch them one by one or use a raw query if needed, but let's try to use the ORM.
        // I'll assume I can filter by testId.

        const allQuestions = await db.select().from(testQuestions);
        recentTestQuestions = allQuestions.filter(q => q.testId !== null && recentTestIds.includes(q.testId));
    }

    // Calculate stats
    const totalTests = userTests.length;
    const averageScore = totalTests > 0
        ? Math.round(userTests.reduce((acc, t) => acc + t.marks, 0) / totalTests)
        : 0;

    // Calculate progress (unique modules completed)
    const uniqueModules = new Set(userTests.map(t => t.moduleNo));
    const totalModules = 3; // Assuming 3 modules for now based on Test Bay
    const progress = Math.round((uniqueModules.size / totalModules) * 100);

    return {
        user: {
            username: dbUser?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'User',
            fullName: dbUser?.fullName || user.user_metadata?.full_name || 'Pilot',
            email: user.email
        },
        stats: {
            progress,
            totalTests,
            averageScore
        },
        recentActivity: recentTests.map(t => ({
            id: t.testId,
            moduleName: t.moduleName,
            date: t.testDate,
            score: t.marks,
            passed: t.marks >= 70,
            questions: recentTestQuestions.filter(q => q.testId === t.testId)
        }))
    };
};
