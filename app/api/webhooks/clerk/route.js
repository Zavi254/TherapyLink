import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing svix headers', { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature
        });
    } catch (error) {
        console.error('Error verifying webhook:', error);
        return new Response('Error: Verification failed', { status: 400 });
    }

    const eventType = evt.type;

    // Handle user.created event
    if (eventType === "user.created") {
        const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;

        try {
            const user = await prisma.user.create({
                data: {
                    clerkId: id,
                    email: email_addresses[0].email_address,
                    firstName: first_name || null,
                    lastName: last_name || null,
                    role: unsafe_metadata?.role || 'PATIENT',
                },
            });

            // Create patient or therapist profile based on role
            if (user.role === 'PATIENT') {
                await prisma.patient.create({
                    data: {
                        userId: user.id,
                    },
                });
            } else if (user.role === 'THERAPIST') {
                await prisma.therapist.create({
                    data: {
                        userId: user.id,
                        hourlyRate: 0, // Will be set during onboarding
                        licenseNumber: '', // Will be set during onboarding
                        specialization: [],
                    },
                });
            }

            console.log('User synced to database:', user.id);
        } catch (error) {
            console.error('Error creating user:', error);
            return new Response('Error: Database sync failed', { status: 500 });
        }
    }

    // Handle user.updated event
    if (eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name } = evt.data;

        try {
            await prisma.user.update({
                where: { clerkId: id },
                data: {
                    email: email_addresses[0].email_address,
                    firstName: first_name || null,
                    lastName: last_name || null,
                },
            });

            console.log('User updated in database');
        } catch (error) {
            console.error('Error updating user:', error);
        }

    }

    // Handle user.deleted event
    if (eventType === "user.deleted") {
        const { id } = evt.data;

        try {
            await prisma.user.delete({
                where: { clerkId: id },
            });

            console.log('User deleted from database');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    return new Response('Webhook processed successfully', { status: 200 });
}