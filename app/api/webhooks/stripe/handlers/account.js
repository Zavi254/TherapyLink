import { prisma } from "@/lib/prisma";

export async function handleAccountUpdated(account) {
    const therapist = await prisma.therapist.findUnique({
        where: { stripeAccountId: account.id },
    });

    if (!therapist) return;

    const isComplete = account.charges_enabled && account.payouts_enabled;

    await prisma.therapist.update({
        where: { id: therapist.id },
        data: {
            stripeOnboardingComplete: isComplete,
            isActive: isComplete,
        },
    });

    console.log("Updated therapist:", therapist.id);
}