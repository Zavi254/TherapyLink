"use client";

import { OnboardingLayout } from "./OnboardingLayout";
import { ProfilePreview } from "../shared/ProfileView";

export function OnboardingPageWrapper({ children }) {
    return (
        <OnboardingLayout>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <div className="w-full lg:w-3/5 flex flex-col gap-8">
                    {children}
                </div>
                <div className="w-full lg:w-2/5 hidden md:block">
                    <ProfilePreview />
                </div>
            </div>
        </OnboardingLayout>
    )
}