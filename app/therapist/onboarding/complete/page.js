import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FiCheckCircle } from "react-icons/fi";
import { LuArrowRight } from "react-icons/lu";

export default async function OnboardingCompletePage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: { therapistProfile: true },
    });

    if (!user || user.role !== "THERAPIST") {
        redirect("/dashboard");
    }

    // Call API to verify and complete onboarding
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/therapist/onboarding/complete`, {
        method: "POST",
    });

    return (
        <div className="min-h-screen bg-[#0e120d] flex items-center justify-center p-4">
            <div className="bg-[#1e271c] border border-[#2c3928] rounded-2xl p-8 md:p-12 max-w-2xl w-full text-center">
                <div className="size-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">

                    <FiCheckCircle size={32} className="text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">
                    Welcome to TherapyLink!
                </h1>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    Your onboarding is complete. Your profile is now live and patients can start booking sessions with you.
                </p>
                <a
                    href="/dashboard"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
                >
                    Go to Dashboard
                    <LuArrowRight size={24} />
                </a>
            </div>
        </div>
    )

}