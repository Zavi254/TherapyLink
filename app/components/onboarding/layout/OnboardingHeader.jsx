import useOnboardingStore from "@/lib/store/onboardingStore";
import { LuShieldCheck } from "react-icons/lu";

export function OnboardingHeader() {
    const { currentStep } = useOnboardingStore();

    return (
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#131811] sticky top-0 z-20 border-b border-[#2c3928]">
            <div className="flex items-center gap-2">
                <LuShieldCheck size={24} />
                <span className="font-bold text-lg">TherapyLink</span>
            </div>
            <div className="text-sm font-medium text-gray-400">
                Step {currentStep} of 4
            </div>
        </div>
    )
}