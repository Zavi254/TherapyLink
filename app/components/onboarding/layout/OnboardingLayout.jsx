import { OnboardingSidebar } from "./OnboardingSidebar";
import { OnboardingHeader } from "./OnboardingHeader";

export function OnboardingLayout({ children }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#0e120d]">
            <OnboardingSidebar />

            <main className="flex-1 flex flex-col h-full relative overflow-y-auto overflow-x-hidden scrollbar-hide">
                <OnboardingHeader />
                <div className="w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12 pb-24">
                    {children}
                </div>
            </main>
        </div>
    )
}