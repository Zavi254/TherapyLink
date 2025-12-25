import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OnboardingLayout } from "@/app/components/onboarding/layout/OnboardingLayout";
import PaymentSetup from "@/app/components/onboarding/steps/PaymentSetup";
import { ProfilePreview } from "@/app/components/onboarding/shared/ProfileView";

export default async function PaymentPage() {
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

    if (user.therapistProfile?.onboardingComplete) {
        redirect("/dashboard");
    }

    return (
        <OnboardingLayout>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <div className="w-full lg:w-3/5 flex flex-col gap-8">
                    <PaymentSetup />
                </div>
                <div className="w-full lg:w-2/5 hidden md:block">
                    <ProfilePreview />
                </div>
            </div>
        </OnboardingLayout>
    )

}