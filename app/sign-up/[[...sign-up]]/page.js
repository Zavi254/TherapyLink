"use client";

import { SignUp, useSignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function SignUpPage() {
    const [role, setRole] = useState('PATIENT');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pathname = usePathname();
    const { signUp } = useSignUp();

    // Hide role selection on verification pages
    const showRoleSelection = !pathname.includes('/verify');

    // Monitor sign up status
    useEffect(() => {
        if (signUp?.status === "complete") {
            // schedule state update after current render to avoid cascading renders
            const id = setTimeout(() => setIsSubmitting(false), 0);
            return () => clearTimeout(id);
        }
    }, [signUp?.status]);

    const handleRoleChange = (newRole) => {
        if (!isSubmitting) {
            setRole(newRole);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {showRoleSelection && (
                    <>
                        <div>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Join as a patient or therapist
                            </p>
                        </div>

                        {/* Role selection */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                I want to sign up as:
                            </label>
                            <div className="space-y-3">
                                <label
                                    className={`flex items-center p-4 border-2 rounded-lg transition-colors ${isSubmitting
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'cursor-pointer hover:bg-gray-50'
                                        }`}
                                    style={{ borderColor: role === 'PATIENT' ? '#4F46E5' : '#E5E7EB' }}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="PATIENT"
                                        checked={role === "PATIENT"}
                                        onChange={(e) => handleRoleChange(e.target.value)}
                                        disabled={isSubmitting}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                                    />
                                    <div className="ml-3">
                                        <span className="block text-sm font-medium text-gray-900">
                                            Patient
                                        </span>
                                        <span className="block text-sm text-gray-500">
                                            Book therapy sessions
                                        </span>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-center p-4 border-2 rounded-lg transition-colors ${isSubmitting
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'cursor-pointer hover:bg-gray-50'
                                        }`}
                                    style={{ borderColor: role === 'THERAPIST' ? '#4F46E5' : '#E5E7EB' }}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="THERAPIST"
                                        checked={role === "THERAPIST"}
                                        onChange={(e) => handleRoleChange(e.target.value)}
                                        disabled={isSubmitting}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                                    />
                                    <div className="ml-3">
                                        <span className="block text-sm font-medium text-gray-900">
                                            Therapist
                                        </span>
                                        <span className="block text-sm text-gray-500">
                                            Offer therapy services
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </>
                )}

                {/* Clerk Sign Up Component */}
                <div onClick={() => setIsSubmitting(true)}>
                    <SignUp
                        appearance={{
                            elements: {
                                formButtonPrimary:
                                    'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                            },
                        }}
                        unsafeMetadata={{ role }}
                        forceRedirectUrl={role === 'THERAPIST' ? 'therapist/onboarding/basic-info' : '/dashboard'}
                    />
                </div>
            </div>
        </div>
    )

}