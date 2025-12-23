'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useOnboardingStore from '@/lib/store/onboardingStore';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { NavigationButtons } from '../shared/NavigationButtons';
import Image from 'next/image';

export function BasicInfoForm() {
    const router = useRouter();
    const { basicInfo, updateBasicInfo, setCurrentStep, markStepComplete } = useOnboardingStore();

    const [formData, setFormData] = useState(basicInfo);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

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
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handlePhotoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Photo must be less than 5MB');
                return;
            }
            setProfilePhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
            handleChange('profilePhoto', file);
        }
    };

    const handlePhotoRemove = () => {
        setProfilePhoto(null);
        setPhotoPreview(null);
        handleChange('profilePhoto', null);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName?.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName?.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!formData.phone?.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone) && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.experience) {
            newErrors.experience = 'Years of experience is required';
        } else if (formData.experience < 0 || formData.experience > 50) {
            newErrors.experience = 'Please enter a valid number of years';
        }
        if (!formData.specialization) {
            newErrors.specialization = 'Please select a specialization';
        }
        if (!formData.bio?.trim()) {
            newErrors.bio = 'Professional bio is required';
        } else if (formData.bio.length < 50) {
            newErrors.bio = 'Bio must be at least 50 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Save to Zustand store
            updateBasicInfo(formData);

            // Optional: Save to backend
            // const response = await fetch('/api/therapist/onboarding/basic-info', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         firstName: formData.firstName,
            //         lastName: formData.lastName,
            //         phone: formData.phone,
            //         experience: formData.experience,
            //         specialization: formData.specialization,
            //         bio: formData.bio,
            //     }),
            // });

            // if (!response.ok) {
            //     throw new Error('Failed to save basic info');
            // }

            markStepComplete(1);

            router.push('/therapist/onboarding/credentials');
        } catch (error) {
            console.error('Error saving basic info:', error);
            alert('Failed to save information. Please try again.');
        } finally {
            setLoading(false);
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
                        <div className="relative group cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoSelect}
                                className="hidden"
                                id="profile-photo"
                            />
                            <label htmlFor="profile-photo" className="cursor-pointer">
                                <div className="size-24 rounded-full bg-[#2c3928] flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-400 hover:border-blue-500 transition-colors">
                                    {photoPreview ? (
                                        <Image src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-blue-500 transition-colors">
                                            add_a_photo
                                        </span>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-blue-600 size-8 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="material-symbols-outlined text-white text-sm">edit</span>
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-white font-medium mb-1">Upload your photo</p>
                            <p className="text-xs text-gray-400 mb-3">
                                Photos help patients connect with you.<br />
                                Use a professional headshot with good lighting.
                            </p>
                            <div className="flex gap-3">
                                <label htmlFor="profile-photo" className="text-blue-500 text-sm font-bold hover:underline cursor-pointer">
                                    Upload
                                </label>
                                {photoPreview && (
                                    <button
                                        onClick={handlePhotoRemove}
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