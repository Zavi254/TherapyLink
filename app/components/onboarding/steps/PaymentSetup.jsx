"use client";

import { useState, useEffect } from "react";
import useOnboardingStore from "@/lib/store/onboardingStore";
import { useOnboarding } from "@/lib/hooks/useOnboarding";

export function PaymentSetup() {
    const { payment, updatePayment, setCurrentStep } = useOnboardingStore();
    const { loading, goToPreviousStep } = useOnboarding();

    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        setCurrentStep(4);
    }, [setCurrentStep])

    const handleStripeConnect = async () => {
        setIsConnecting(true);

        try {
            // Call API to create Stripe Connect account and get onboarding link
            const response = await fetch("/api/therapist/onboarding/stripe-connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to create Stripe Connect Account");
            }

            const { url } = await response.json();

            // Redirect to Stripe Connect onboarding
            window.location.href = url;
        } catch (error) {
            console.error("Error connecting to Stripe:", error);
            alert("Failed to connect to Stripe. Please try again.");
            setIsConnecting(false);
        }
    }

    const handleSkip = () => {
        // Navigate to dashboard without completing payment setup
        window.location.href = "/dashboard";
    };

    const handleBack = () => {
        goToPreviousStep("/therapist/onboarding/availability");
    };

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Connect Your Bank Account</h1>
                <p className="text-gray-400">Get paid directly after each approved session</p>
            </header>

            <div className="flex flex-col gap-8">
                {/* Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#1e271c] border border-[#2c3928] p-5 rounded-2xl flex flex-col gap-3 hover:border-blue-500/30 transition-colors">
                        <div className="bg-[#635BFF]/10 w-fit p-2 rounded-lg text-[#635BFF]">
                            <span className="material-symbols-outlined">lock_person</span>
                        </div>
                        <p className="text-sm font-medium text-gray-200 leading-snug">
                            We use Stripe Connect for secure payments
                        </p>
                    </div>

                    <div className="bg-[#1e271c] border border-[#2c3928] p-5 rounded-2xl flex flex-col gap-3 hover:border-blue-500/30 transition-colors">
                        <div className="bg-green-500/10 w-fit p-2 rounded-lg text-green-500">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <p className="text-sm font-medium text-gray-200 leading-snug">
                            Earnings deposited within 2 business days
                        </p>
                    </div>

                    <div className="bg-[#1e271c] border border-[#2c3928] p-5 rounded-2xl flex flex-col gap-3 hover:border-blue-500/30 transition-colors">
                        <div className="bg-blue-500/10 w-fit p-2 rounded-lg text-blue-500">
                            <span className="material-symbols-outlined">savings</span>
                        </div>
                        <p className="text-sm font-medium text-gray-200 leading-snug">
                            No hidden fees - you keep 85% of each session
                        </p>
                    </div>
                </div>

                {/* Main Connect Card */}
                <div>
                    <div>

                        <div className="mb-6 relative">
                            <div className="size-24 bg-[#131811] rounded-full flex items-center justify-center border-4 border-[#2c3928] relative z-10 shadow-xl">
                                <span className="material-symbols-outlined text-4xl text-gray-400">
                                    account_balance
                                </span>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-32 bg-[#635BFF]/10 rounded-full animate-pulse"></div>
                            <div className="absolute -right-4 top-0 bg-green-500 text-white p-1.5 rounded-full border-4 border-[#1e271c] shadow-lg z-20">
                                <span className="material-symbols-outlined text-lg">currency_exchange</span>
                            </div>
                        </div>

                        <h3>Connect with Stripe</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
                            You&apos;ll be redirected to Stripe to connect your bank account securely. We never see your banking details.
                        </p>

                        {/* What you'll need */}
                        <div className="w-full max-w-sm bg-[#131811]/50 border border-[#2c3928] rounded-xl p-5 mb-8 text-left">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                                What you&apos;ll need:
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">
                                        check_circle
                                    </span>
                                    <span>Bank account number</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">
                                        check_circle
                                    </span>
                                    <span>Routing number</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">
                                        check_circle
                                    </span>
                                    <span>Tax ID (SSN or EIN)</span>
                                </li>
                            </ul>
                        </div>

                        {/* Connect Button */}
                        <button
                            onClick={handleStripeConnect}
                            disabled={isConnecting}
                            className="bg-[#635BFF] hover:bg-[#534be0] text-white font-bold py-4 px-8 rounded-full w-full max-w-sm flex items-center justify-center gap-3 transition-all shadow-[0_4px_20px_rgba(99,91,255,0.4)] hover:shadow-[0_4px_25px_rgba(99,91,255,0.5)] transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isConnecting ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    <span>Connecting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Connect Stripe Account</span>
                                    <span className="material-symbols-outlined">open_in_new</span>
                                </>
                            )}
                        </button>

                        {/* Skip Option */}
                        <div className="mt-6 flex flex-col items-center gap-3">
                            <button
                                onClick={handleSkip}
                                className="text-sm font-medium text-gray-400 hover:text-white underline decoration-gray-400/30 hover:decoration-white transition-colors"
                            >
                                I&apos;ll do this later
                            </button>
                            <div>
                                <span className="material-symbols-outlined text-yellow-500 text-sm mt-0.5">
                                    warning
                                </span>
                                <span className="text-xs text-yellow-500/90 font-medium text-left">
                                    You won&apos;t be able to receive appointments until this is completed
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Security Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-300 ">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-2xl">verified_user</span>
                            <span className="text-sm font-bold text-white">Secured by Stripe</span>
                        </div>
                        <div className="h-4 w-px bg-[#2c3928]"></div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-2xl">lock</span>
                            <span className="text-sm font-bold text-white">Bank-level encryption</span>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="flex justify-start pt-4">
                        <button
                            onClick={handleBack}
                            className="text-gray-400 hover:text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 group"
                        >
                            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
                                arrow_back
                            </span>
                            Back
                        </button>
                    </div>

                </div>

            </div>
        </>
    )

}