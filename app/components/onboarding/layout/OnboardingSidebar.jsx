import useOnboardingStore from '@/lib/store/onboardingStore';
import { LuInfo, LuShieldCheck } from 'react-icons/lu';

export function OnboardingSidebar() {
    const { currentStep, completedSteps } = useOnboardingStore();

    const steps = [
        { number: 1, title: 'Basic Info', path: '/therapist/onboarding/basic-info' },
        { number: 2, title: 'Credentials', path: '/therapist/onboarding/credentials' },
        { number: 3, title: 'Availability', path: '/therapist/onboarding/availability' },
        { number: 4, title: 'Payment Setup', path: '/therapist/onboarding/payment' },
    ];

    const getStepStatus = (stepNumber) => {
        if (completedSteps.includes(stepNumber)) return 'completed';
        if (currentStep === stepNumber) return 'current';
        return 'upcoming';
    };

    return (
        <aside className="w-72 hidden lg:flex flex-col h-full border-r border-[#2c3928] bg-[#131811] p-4 shrink-0">
            <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-2">
                        <div className="bg-blue-500/20 flex items-center justify-center aspect-square rounded-full size-10 text-blue-500">
                            <LuShieldCheck size={24} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-white text-lg font-bold leading-normal">TherapyLink</h1>
                            <p className="text-gray-400 text-xs font-normal leading-normal">Therapist Portal</p>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <nav className="flex flex-col gap-6 px-2 mt-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                                Onboarding Progress
                            </p>

                            {steps.map((step, index) => {
                                const status = getStepStatus(step.number);
                                const isLast = index === steps.length - 1;

                                return (
                                    <div key={step.number}>
                                        <div className={`flex items-center gap-3 group ${status === 'upcoming' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                            }`}>
                                            <div className={`flex items-center justify-center size-8 rounded-full text-sm font-bold border-2 ${status === 'completed'
                                                ? 'bg-green-500 text-white border-green-500'
                                                : status === 'current'
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                                    : 'bg-transparent text-gray-400 border-gray-600'
                                                }`}>
                                                {status === 'completed' ? (
                                                    <span className="material-symbols-outlined text-sm">check</span>
                                                ) : (
                                                    step.number
                                                )}
                                            </div>
                                            <span className={`text-sm ${status === 'completed' || status === 'current'
                                                ? 'text-white font-bold'
                                                : 'text-gray-400 font-medium'
                                                }`}>
                                                {step.title}
                                            </span>
                                        </div>

                                        {!isLast && (
                                            <div className={`w-0.5 h-6 ml-4 my-1 ${status === 'completed' ? 'bg-green-500' : 'bg-[#2c3928]'
                                                } ${status === 'upcoming' ? 'opacity-50' : ''}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </nav>
                </div>

                {/* Help Card */}
                <div className="bg-[#1e271c] p-4 rounded-xl border border-[#2c3928] mt-auto">
                    <div className="flex gap-3">
                        <LuInfo size={24} color="text-blue-500" />
                        <div>
                            <p className="text-sm font-bold text-white mb-1">Need Help?</p>
                            <p className="text-xs text-gray-400">
                                Contact our support team if you have trouble completing your profile.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}