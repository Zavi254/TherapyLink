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

        let accountId = user.therapistProfile.stripeAccountId;

        // Create Stripe Connect account if doesn't exist
        if (!accountId) {
            const account = await stripe.accounts.create({
                type: "express",
                country: "US",
                email: user.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                business_type: "individual",
            });

            accountId = account.id;

            // Save Stripe account ID
            await prisma.therapist.update({
                where: { id: user.therapistProfile.id },
                data: { stripeAccountId: accountId }
            });
        }

        // Create Account link for onboarding
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/therapist/onboarding/payment`,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/therapist/onboarding/complete`,
            type: "account_onboarding",
        });

        return NextResponse.json({
            success: true,
            url: accountLink.url,
        });
    } catch (error) {
        console.error("Error creating Stripe Connect Account:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}