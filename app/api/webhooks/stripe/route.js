import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { handleStripeEvent } from "./handlers";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
    try {
        const body = await req.text();
        const signature = (await headers()).get("stripe-signature");

        if (!signature) {
            return NextResponse.json({ error: "No signature provided" }, { status: 400 });
        }

        const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

        console.log("Stripe event:", event.type);

        await handleStripeEvent(event);

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}