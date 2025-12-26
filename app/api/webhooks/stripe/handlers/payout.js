export async function handlePayoutPaid(payout) {
    console.log("Payout paid:", payout.id, payout.amount / 100);
}

export async function handlePayoutFailed(payout) {
    console.error("Payout failed:", payout.id);
}