import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            include: { therapistProfile: true },
        });

        if (!user || user.role !== "THERAPIST") {
            return NextResponse.json(
                { error: "User not found or not a therapist" },
                { status: 404 }
            );
        }
        // Check if Stripe account is fully onboarded
        if (user.therapistProfile.stripeAccountId) {
            const account = await stripe.accounts.retrieve(
                user.therapistProfile.stripeAccountId
            );

            const isOnboardingComplete = account.charges_enabled && account.payouts_enabled;

            // Mark onboarding as complete
            await prisma.therapist.update({
                where: { id: user.therapistProfile.id },
                data: {
                    stripeOnboardingComplete: isOnboardingComplete,
                    onboardingComplete: isOnboardingComplete,
                    isActive: isOnboardingComplete,
                },
            });

            return NextResponse.json({
                success: true,
                onboardingComplete: isOnboardingComplete,
            });
        }

        return NextResponse.json(
            { error: "Stripe account not found" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error completin onboarding:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}