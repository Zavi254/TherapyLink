import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OnboardingPageWrapper } from "@/app/components/onboarding/layout/OnboardingPageWrapper";
import { BasicInfoForm } from "@/app/components/onboarding/steps/BasicInfoForm";

export default async function BasicInfoPage() {
    const { userId } = await auth();

    if (!userId) redirect("/sign-in");

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: { therapistProfile: true },
    });

    if (!user || user.role !== "THERAPIST") redirect("/dashboard");
    // If already completed onboarding, redirect to dashboard
    if (user.therapistProfile?.onboardingComplete) redirect("/dashboard");


    return (
        <OnboardingPageWrapper>
            <BasicInfoForm />
        </OnboardingPageWrapper>
    )

}