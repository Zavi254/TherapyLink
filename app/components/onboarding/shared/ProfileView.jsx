"use client";

import useOnboardingStore from "@/lib/store/onboardingStore";
import Image from "next/image";
import { LuEye, LuClock, LuCheck, LuUser, LuBriefcase, LuStar } from "react-icons/lu";

export function ProfilePreview() {
    const { basicInfo, completedSteps } = useOnboardingStore();

    const isVerified = completedSteps.includes(2);
    const hasAvailability = completedSteps.includes(3);

    return (
        <div className="sticky top-8">
            <div className="flex items-center gap-2 mb-4">
                <LuEye className="text-gray-400" size={20} />
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    Profile Preview
                </h3>
            </div>

            <div className="bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Verification Badge */}
                <div className="absolute top-4 right-4 z-10">
                    {isVerified ? (
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                            <LuCheck className="text-green-700" size={14} />
                            <span>Verified</span>
                        </div>
                    ) : (
                        <div className="animate-pulse flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 shadow-sm">
                            <LuClock className="text-yellow-700" size={16} />
                            <span>Verification Pending</span>
                        </div>
                    )}
                </div>

                {/* Header Banner */}
                <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600 relative">
                    <div className="absolute -bottom-10 left-6 p-1 bg-white rounded-full">
                        <div className="size-20 bg-gray-200 rounded-full bg-cover bg-center flex items-center justify-center text-4xl">
                            {basicInfo.profilePhotoUrl ? (
                                <Image
                                    src={basicInfo.profilePhotoUrl}
                                    alt="Profile"
                                    className="size-20 rounded-full object-cover"
                                />
                            ) : (
                                <LuUser className="text-gray-400" size={40} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="pt-12 px-6 pb-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {basicInfo.firstName || basicInfo.lastName
                                    ? `${basicInfo.firstName || ""} ${basicInfo.lastName || ""}`.trim()
                                    : "Your Name"
                                }
                            </h2>
                            <p className="text-sm text-blue-600 font-semibold">
                                {basicInfo.specialization || "Your Specialization"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <LuBriefcase className="text-gray-500" size={18} />
                            <span>{basicInfo.experience || '0'} Yrs Exp.</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <LuStar className="text-yellow-500" size={18} />
                            <span className="text-gray-900 font-bold">5.0</span>
                            <span>(New)</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            About
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {basicInfo.bio || "Your professional bio will appear here..."}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold opacity-90 cursor-default">
                            Book Session
                        </button>
                        <button className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold opacity-90 cursor-default">
                            Message
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
                This is how your profile will appear to patients
            </p>
        </div >
    )
}