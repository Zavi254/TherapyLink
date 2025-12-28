import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AvailabilityForm from "@/app/components/onboarding/steps/AvailabilityForm";
import { OnboardingPageWrapper } from "@/app/components/onboarding/OnboardingPageWrapper";

export default async function AvailabilityPage() {
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
        <OnboardingPageWrapper>
            <AvailabilityForm />
        </OnboardingPageWrapper>
    )

}