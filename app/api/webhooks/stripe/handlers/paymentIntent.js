import { prisma } from "@/lib/prisma";

export async function handlePaymentIntentSucceeded(paymentIntent) {
    await updateAppointment(paymentIntent.id, "CONFIRMED");
}

export async function handlePaymentIntentFailed(paymentIntent) {
    await updateAppointment(paymentIntent.id, "CANCELLED");
}

export async function handlePaymentIntentCanceled(paymentIntent) {
    await updateAppointment(paymentIntent.id, "CANCELLED");
}

async function updateAppointment(paymentIntentId, status) {
    const appointment = await prisma.appointment.findUnique({
        where: { paymentIntentId }
    });

    if (!appointment) return;

    await prisma.appointment.update({
        where: { id: appointment.id },
        data: { status },
    });

    console.log(`Appointment ${appointment.id} -> ${status}`)
}