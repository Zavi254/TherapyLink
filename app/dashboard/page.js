import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: {
            patientProfile: true,
            therapistProfile: true,
        },
    });

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Welcome, {user.firstName || 'User'}
                        </h1>
                        <p className="text-gray-600 mb-2">
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <strong>Role:</strong> {user.role}
                        </p>
                        <p className="text-gray-600">
                            <strong>User ID:</strong> {user.id}
                        </p>

                        {user.role === 'THERAPIST' && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h2 className="text-xl font-semibold text-blue-900 mb-2">
                                    Therapist Profile
                                </h2>
                                <p className="text-blue-700">
                                    Onboarding Status: {user.therapistProfile?.onboardingComplete ? 'Complete' : 'Incomplete'}
                                </p>
                            </div>
                        )}

                        {user.role === 'PATIENT' && (
                            <div className="mt-6 p-4 bg-green-50 rounded-lg">
                                <h2 className="text-xl font-semibold text-green-900 mb-2">
                                    Patient Profile
                                </h2>
                                <p className="text-green-700">
                                    Ready to book your first session!
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )

}