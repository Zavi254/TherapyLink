"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <SignIn
                    appearance={{
                        elements: {
                            formButtonPrimary:
                                'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                        }
                    }}
                />
            </div>
        </div>
    )
}