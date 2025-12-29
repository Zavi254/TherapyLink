'use client';

import { useEffect, useRef, useState } from 'react';
import useOnboardingStore from '@/lib/store/onboardingStore';
import { useOnboarding } from '@/lib/hooks/useOnboarding';
import { useFormValidation } from '@/lib/hooks/useFormValidation';
import { basicInfoSchema } from '@/lib/validations/onboardingSchema';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { NavigationButtons } from '../shared/NavigationButtons';
import { UploadButton } from '@/lib/uploadthing';
import Image from 'next/image';
import { LuCamera, LuPencil } from 'react-icons/lu';

export function BasicInfoForm() {
    const { basicInfo, updateBasicInfo, setCurrentStep } = useOnboardingStore();
    const { loading, saveStep, goToNextStep } = useOnboarding();
    const { errors, validate, clearError } = useFormValidation(basicInfoSchema);

    const uploadButtonRef = useRef(null);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => setCurrentStep(1), [setCurrentStep]);

    const handleChange = (field, value) => {
        // Special handling for specialization to store the full label
        if (field === "specialization") {
            const selected = specializationOptions.find(opt => opt.value === value);
            updateBasicInfo({
                specialization: value,
                specializationLabel: selected?.label || value
            });
        } else {
            updateBasicInfo({ [field]: value });
        }
        clearError(field);
    };

    const specializationOptions = [
        { value: 'pt', label: 'Physical Therapy' },
        { value: 'ot', label: 'Occupational Therapy' },
        { value: 'slp', label: 'Speech-Language Pathology' },
        { value: 'mhc', label: 'Mental Health Counseling' },
        { value: 'rd', label: 'Registered Dietitian' },
    ];


    // Trigger the hidden upload button
    const triggerUpload = () => {
        const input = uploadButtonRef.current?.querySelector('input[type="file"]');
        input?.click();
    }

    const handleContinue = async () => {
        if (!validate(basicInfo)) {
            return;
        }

        try {
            // Save to backend
            await saveStep("/api/therapist/onboarding/basic-info", basicInfo);

            // Navigate to next step
            goToNextStep("/therapist/onboarding/credentials");
        } catch (error) {
            console.error('Error saving basic info:', error);
            alert('Failed to save information. Please try again.');
        }
    };

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Basic Information</h1>
                <p className="text-gray-400">
                    Let&apos;s start building your professional profile. Patients will see this information when browsing therapists.
                </p>
            </header>

            <div className="flex flex-col gap-8">
                {/* Profile Photo Section */}
                <div className="bg-[#1e271c] border border-[#2c3928] rounded-2xl p-6 md:p-8">
                    <h3 className="text-lg font-bold text-white mb-4">Profile Photo</h3>
                    <div className="flex items-center gap-6">
                        {/* Image Preview */}
                        <div className="relative group">
                            <div
                                onClick={triggerUpload}
                                className="size-24 rounded-full bg-[#2c3928] flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-400 hover:border-blue-500 transition-colors cursor-pointer"
                            >
                                {basicInfo.profilePhotoUrl ? (
                                    <Image src={basicInfo.profilePhotoUrl} width={96} height={96} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <LuCamera size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                )}
                            </div>

                            <div
                                onClick={triggerUpload}
                                className="absolute bottom-0 right-0 bg-blue-600 size-8 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                            >
                                <LuPencil size={12} className='text-white' />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-white font-medium mb-1">Upload your photo</p>
                            <p className="text-xs text-gray-400 mb-3">
                                Photos help patients connect with you.<br />
                                Use a professional headshot with good lighting.
                            </p>
                            <div className="flex gap-3">
                                {/* Custom upload button */}
                                <button
                                    type="button"
                                    onClick={triggerUpload}
                                    className="text-blue-500 text-sm font-bold hover:underline"
                                >
                                    Upload
                                </button>

                                {basicInfo.profilePhotoUrl && (
                                    <button
                                        onClick={() => handleChange("profilePhotoUrl", null)}
                                        className="text-red-400 text-sm font-bold hover:underline"
                                    >
                                        Remove
                                    </button>
                                )}

                                {/* Progress bar */}
                                {isUploading && (
                                    <div className="flex items-center gap-2">
                                        <div className="mt-2 w-24 h-2 bg-[#2c3928] rounded overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {uploadProgress}%
                                        </span>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Hidden UploadThing Button */}
                        <div
                            ref={uploadButtonRef}
                            className="opacity-0 pointer-events-none absolute">
                            <UploadButton
                                endpoint={"profileImage"}
                                onUploadBegin={(filename) => {
                                    setIsUploading(true);
                                    setUploadProgress(0);
                                }}
                                onUploadProgress={(p) => {
                                    setUploadProgress(p)
                                }}
                                onClientUploadComplete={(res) => {
                                    setUploadProgress(100);
                                    setTimeout(() => {
                                        setIsUploading(false);
                                        setUploadProgress(null);
                                    }, 500); // show completion for 500ms
                                    if (res?.[0]) handleChange("profilePhotoUrl", res[0].url);
                                }}
                                onUploadError={(error) => {
                                    setIsUploading(false);
                                    setUploadProgress(null);
                                    alert(`Upload failed: ${error.message}`);
                                }}
                            />
                        </div>

                    </div>
                </div>

                {/* Form Fields */}
                <form className="flex flex-col gap-6 bg-[#1e271c] border border-[#2c3928] rounded-2xl p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            id="firstName"
                            label="First Name"
                            placeholder="e.g. Sarah"
                            value={basicInfo.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                            error={errors.firstName}
                        />
                        <Input
                            id="lastName"
                            label="Last Name"
                            placeholder="e.g. Jenkins"
                            value={basicInfo.lastName}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                            error={errors.lastName}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            id="phone"
                            label="Phone Number"
                            type="tel"
                            placeholder="(555) 000-0000"
                            value={basicInfo.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            error={errors.phone}
                        />
                        <Input
                            id="experience"
                            label="Years of Experience"
                            type="number"
                            placeholder="e.g. 8"
                            value={basicInfo.experience}
                            onChange={(e) => handleChange('experience', e.target.value)}
                            error={errors.experience}
                        />
                    </div>

                    <Select
                        id="specialization"
                        label="Primary Specialization"
                        placeholder="Select your specialization"
                        options={specializationOptions}
                        value={basicInfo.specialization}
                        onChange={(e) => handleChange('specialization', e.target.value)}
                        error={errors.specialization}
                    />

                    <Textarea
                        id="bio"
                        label="Professional Bio"
                        placeholder="Describe your approach to therapy and your background..."
                        rows={5}
                        maxLength={500}
                        value={basicInfo.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        error={errors.bio}
                        showCount
                    />
                </form>

                <NavigationButtons
                    showBack={false}
                    onContinue={handleContinue}
                    continueText="Continue to Credentials"
                    loading={loading}
                />
            </div>
        </>
    );
}