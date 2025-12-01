import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tests, testQuestions, user as userTable } from '$lib/server/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { session, user } = await safeGetSession();

    if (!session || !user) {
        throw redirect(303, '/login');
    }

    // Parallelize initial fetches
    const [userProfileResult, userTests] = await Promise.all([
        db.select().from(userTable).where(eq(userTable.id, user.id)),
        db.select()
            .from(tests)
            .where(eq(tests.userId, user.id))
            .orderBy(desc(tests.testDate))
    ]);

    const dbUser = userProfileResult[0];

    // Fetch questions for the recent tests (last 5)
    const recentTests = userTests.slice(0, 5);
    const recentTestIds = recentTests.map(t => t.testId);

    let recentTestQuestions: any[] = [];
    if (recentTestIds.length > 0) {
        // Optimized query using inArray
        recentTestQuestions = await db
            .select()
            .from(testQuestions)
            .where(inArray(testQuestions.testId, recentTestIds));
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
