'use client';

import { useState, useEffect } from 'react';
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

    const [formData, setFormData] = useState(basicInfo);
    const [photoPreview, setPhotoPreview] = useState(basicInfo.profilePhotoUrl);

    useEffect(() => {
        setCurrentStep(1);
    }, [setCurrentStep]);

    const specializationOptions = [
        { value: 'pt', label: 'Physical Therapy' },
        { value: 'ot', label: 'Occupational Therapy' },
        { value: 'slp', label: 'Speech-Language Pathology' },
        { value: 'mhc', label: 'Mental Health Counseling' },
        { value: 'rd', label: 'Registered Dietitian' },
    ];

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        clearError(field);
    };

    const handleContinue = async () => {
        if (!validate(formData)) {
            return;
        }

        try {
            // Save to Zustand store
            updateBasicInfo(formData);

            // Save to backend
            await saveStep("/api/therapist/onboarding/basic-info", formData);

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
                        <div className="relative group">
                            <div className="size-24 rounded-full bg-[#2c3928] flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-400 hover:border-blue-500 transition-colors">
                                {photoPreview ? (
                                    <Image src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <LuCamera size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-blue-600 size-8 rounded-full flex items-center justify-center shadow-lg">
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
                                <UploadButton
                                    endpoint={"profileImage"}
                                    onClientUploadComplete={(res) => {
                                        if (res && res[0]) {
                                            const url = res[0].ufsUrl;
                                            setPhotoPreview(url);
                                            handleChange("profilePhotoUrl", url);
                                        }
                                    }}
                                    onUploadError={(error) => {
                                        alert(`Upload failed: ${error.message}`);
                                    }}
                                    className='text-blue-500 text-sm font-bold hover:underline cursor-pointer ut-button:bg-blue-600 ut-button:ut-readying:bg-blue-600/50'
                                />
                                {photoPreview && (
                                    <button
                                        onClick={() => {
                                            setPhotoPreview(null);
                                            handleChange("profilePhotoUrl", null);
                                        }}
                                        className="text-red-400 text-sm font-bold hover:underline"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
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
                            value={formData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                            error={errors.firstName}
                        />
                        <Input
                            id="lastName"
                            label="Last Name"
                            placeholder="e.g. Jenkins"
                            value={formData.lastName}
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
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            error={errors.phone}
                        />
                        <Input
                            id="experience"
                            label="Years of Experience"
                            type="number"
                            placeholder="e.g. 8"
                            value={formData.experience}
                            onChange={(e) => handleChange('experience', e.target.value)}
                            error={errors.experience}
                        />
                    </div>

                    <Select
                        id="specialization"
                        label="Primary Specialization"
                        placeholder="Select your specialization"
                        options={specializationOptions}
                        value={formData.specialization}
                        onChange={(e) => handleChange('specialization', e.target.value)}
                        error={errors.specialization}
                    />

                    <Textarea
                        id="bio"
                        label="Professional Bio"
                        placeholder="Describe your approach to therapy and your background..."
                        rows={5}
                        maxLength={500}
                        value={formData.bio}
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