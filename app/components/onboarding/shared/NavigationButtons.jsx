import { Button } from "../ui/Button";

export function NavigationButtons({
    onBack,
    onContinue,
    showBack = true,
    continueText = "Continue",
    loading = false,
    disabled = false
}) {
    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 justify-between pt-4">
            {showBack && (
                <Button
                    variant="secondary"
                    onClick={onBack}
                    icon={<span className="material-symbols-outlined">arrow_back</span>}
                    iconPosition="left"
                >
                    Back
                </Button>
            )}

            <Button
                variant="primary"
                onClick={onContinue}
                icon={<span className="material-symbols-outlined">arrow_forward</span>}
                loading={loading}
                disabled={disabled}
                className="w-full md:w-auto"
            >
                {continueText}
            </Button>
        </div>
    )
}