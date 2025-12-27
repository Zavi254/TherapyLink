import { Button } from "../ui/Button";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

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
                    icon={<LuArrowLeft size={20} />}
                    iconPosition="left"
                >
                    Back
                </Button>
            )}

            <Button
                variant="primary"
                onClick={onContinue}
                icon={<LuArrowRight size={20} />}
                loading={loading}
                disabled={disabled}
                className="w-full md:w-auto"
            >
                {continueText}
            </Button>
        </div>
    )
}