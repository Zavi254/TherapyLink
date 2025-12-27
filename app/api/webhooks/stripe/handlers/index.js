import { handleAccountUpdated } from "./account";
import {
    handlePaymentIntentSucceeded,
    handlePaymentIntentFailed,
    handlePaymentIntentCanceled,
} from "./paymentIntent";
import { handleTransferCreated, handleTransferFailed } from "./transfer";
import { handlePayoutPaid, handlePayoutFailed } from "./payout";

export async function handleStripeEvent(event) {
    switch (event.type) {
        case "account.updated":
            return handleAccountUpdated(event.data.object);

        case "payment_intent.succeeded":
            return handlePaymentIntentSucceeded(event.data.object);

        case "payment_intent.payment_failed":
            return handlePaymentIntentFailed(event.data.object);

        case "payment_intent.canceled":
            return handlePaymentIntentCanceled(event.data.object);

        case "transfer.created":
            return handleTransferCreated(event.data.object);

        case "transfer.failed":
            return handleTransferFailed(event.data.object);

        case "payout.paid":
            return handlePayoutPaid(event.data.object);

        case "payout.failed":
            return handlePayoutFailed(event.data.object);

        default:
            console.log("Unhandled event:", event.type);
    }
}