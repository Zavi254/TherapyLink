export async function handleTransferCreated(transfer) {
    console.log("Transfer created:", transfer.id, transfer.amount / 100);
}

export async function handleTransferFailed(transfer) {
    console.error("Transfer failed:", transfer.id);
}