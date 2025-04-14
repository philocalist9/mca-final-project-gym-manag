'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { UserRole } from '@/models/ClientUser';
import { authUtils } from '@/lib/authUtils';
import { useSession } from '@/components/SessionProvider';

// User interface to match requirements
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | '';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  fitnessProfile?: {
    goal?: string;
    bodyType?: string;
    currentWeight?: number;
    targetWeight?: number;
    height?: number;
    fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
    preferredTrainer?: string;
  };
  settings?: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
  };
  profileImage?: string;
}

// Form sections type for tab navigation
type FormSection = 'basic' | 'address' | 'fitness' | 'settings';

// Placeholder function to calculate BMI
const calculateBMI = (weight: number, height: number): number => {
  if (!weight || !height) return 0;
  // BMI = weight(kg) / (height(m))²
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

export default function ProfilePage() {
  // Get session data
  const { session } = useSession();
  
  // State for the user profile data
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Form data for editing
  const [formData, setFormData] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    role: UserRole.MEMBER,
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    fitnessProfile: {
      goal: '',
      bodyType: '',
      currentWeight: 0,
      targetWeight: 0,
      height: 0,
      fitnessLevel: 'beginner',
      preferredTrainer: '',
    },
    settings: {
      emailNotifications: true,
      smsNotifications: false,
    },
    profileImage: '',
  });

  // UI state
  const [activeSection, setActiveSection] = useState<FormSection>('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Calculate BMI when weight or height changes
  const bmi = formData.fitnessProfile?.currentWeight && formData.fitnessProfile?.height
    ? calculateBMI(formData.fitnessProfile.currentWeight, formData.fitnessProfile.height)
    : 0;

  // Load user data when session changes
  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  // Fetch user data from API or session
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      
      if (!session || !session.user) {
        setIsLoading(false);
        return;
      }
      
      const userData = session.user;
      
      // Mock extended profile data (would come from API in real app)
      const mockProfile: UserProfile = {
        id: userData.id || '',
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || UserRole.MEMBER,
        phone: '555-123-4567',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        address: {
          street: '123 Fitness Ave',
          city: 'Gymville',
          state: 'CA',
          zipCode: '90210',
        },
        fitnessProfile: {
          goal: 'Muscle Gain',
          bodyType: 'Mesomorph',
          currentWeight: 75,
          targetWeight: 80,
          height: 180,
          fitnessLevel: 'intermediate',
          preferredTrainer: 'Alex Johnson',
        },
        settings: {
          emailNotifications: true,
          smsNotifications: false,
        },
        // Use a local profile image rather than an external URL
        profileImage: '/default-avatar.svg',
      };
      
      setUser(mockProfile);
      setFormData(mockProfile);
      setImagePreview(mockProfile.profileImage || null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setIsLoading(false);
    }
  };

  // Handle basic info changes
  const handleBasicInfoChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle address info changes
  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  // Handle fitness profile changes
  const handleFitnessChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numerical values
    const processedValue = ['currentWeight', 'targetWeight', 'height'].includes(name)
      ? Number(value) || 0
      : value;
    
    setFormData(prev => ({
      ...prev,
      fitnessProfile: {
        ...prev.fitnessProfile,
        [name]: processedValue
      }
    }));
  };

  // Handle settings changes
  const handleSettingsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: checked
      }
    }));
  };

  // Handle profile image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result as string;
      setImagePreview(imageDataUrl);
      setFormData(prev => ({
        ...prev,
        profileImage: imageDataUrl
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle remove profile image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      profileImage: ''
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // In a real app, this would send the data to your backend API
      // For now, we'll just simulate a successful update
      setTimeout(() => {
        setUser({...formData});
        setIsEditing(false);
        setMessage({ 
          type: 'success', 
          text: 'Profile updated successfully!' 
        });
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to update profile. Please try again.' 
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="loader"></div>
    </div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-4">
        <h2 className="text-xl mb-4">User Not Found</h2>
        <p>Please log in to view your profile.</p>
      </div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          {/* Profile Navigation */}
          <div className="w-full md:w-1/4 bg-gray-50 p-4">
            <div className="mb-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                {imagePreview ? (
                  <Image 
                    src={imagePreview} 
                    alt="Profile" 
                    width={128} 
                    height={128} 
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-2xl">{user.name.charAt(0)}</span>
                  </div>
                )}
                
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <label htmlFor="profile-image" className="cursor-pointer bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </label>
                    <input 
                      id="profile-image" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </div>
                )}
              </div>
              
              {isEditing && imagePreview && (
                <button 
                  onClick={handleRemoveImage}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove Photo
                </button>
              )}
              
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            
            <nav>
              <ul>
                <li className="mb-2">
                  <button 
                    onClick={() => setActiveSection('basic')}
                    className={`w-full text-left px-4 py-2 rounded ${activeSection === 'basic' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                  >
                    Basic Information
                  </button>
                </li>
                <li className="mb-2">
                  <button 
                    onClick={() => setActiveSection('address')}
                    className={`w-full text-left px-4 py-2 rounded ${activeSection === 'address' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                  >
                    Address
                  </button>
                </li>
                <li className="mb-2">
                  <button 
                    onClick={() => setActiveSection('fitness')}
                    className={`w-full text-left px-4 py-2 rounded ${activeSection === 'fitness' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                  >
                    Fitness Profile
                  </button>
                </li>
                <li className="mb-2">
                  <button 
                    onClick={() => setActiveSection('settings')}
                    className={`w-full text-left px-4 py-2 rounded ${activeSection === 'settings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                  >
                    Account Settings
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Profile Content */}
          <div className="w-full md:w-3/4 p-6">
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              {activeSection === 'basic' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleBasicInfoChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleBasicInfoChange}
                        disabled={true} // Email can't be changed
                        className="w-full p-2 border rounded bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleBasicInfoChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth || ''}
                        onChange={handleBasicInfoChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender || ''}
                        onChange={handleBasicInfoChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Address Information */}
              {activeSection === 'address' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.address?.street || ''}
                        onChange={handleAddressChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.address?.city || ''}
                        onChange={handleAddressChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.address?.state || ''}
                        onChange={handleAddressChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.address?.zipCode || ''}
                        onChange={handleAddressChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Fitness Profile */}
              {activeSection === 'fitness' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Fitness Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Fitness Goal</label>
                      <select
                        name="goal"
                        value={formData.fitnessProfile?.goal || ''}
                        onChange={handleFitnessChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Goal</option>
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Muscle Gain">Muscle Gain</option>
                        <option value="Strength Training">Strength Training</option>
                        <option value="Endurance">Endurance</option>
                        <option value="Flexibility">Flexibility</option>
                        <option value="General Fitness">General Fitness</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Body Type</label>
                      <select
                        name="bodyType"
                        value={formData.fitnessProfile?.bodyType || ''}
                        onChange={handleFitnessChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Body Type</option>
                        <option value="Ectomorph">Ectomorph</option>
                        <option value="Mesomorph">Mesomorph</option>
                        <option value="Endomorph">Endomorph</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Current Weight (kg)</label>
                      <input
                        type="number"
                        name="currentWeight"
                        value={formData.fitnessProfile?.currentWeight || ''}
                        onChange={handleFitnessChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Target Weight (kg)</label>
                      <input
                        type="number"
                        name="targetWeight"
                        value={formData.fitnessProfile?.targetWeight || ''}
                        onChange={handleFitnessChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.fitnessProfile?.height || ''}
                        onChange={handleFitnessChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">BMI</label>
                      <input
                        type="number"
                        value={bmi}
                        disabled
                        className="w-full p-2 border rounded bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Fitness Level</label>
                      <select
                        name="fitnessLevel"
                        value={formData.fitnessProfile?.fitnessLevel || ''}
                        onChange={handleFitnessChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Preferred Trainer</label>
                      <input
                        type="text"
                        name="preferredTrainer"
                        value={formData.fitnessProfile?.preferredTrainer || ''}
                        onChange={handleFitnessChange}
                        disabled={!isEditing}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeSection === 'settings' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3">Notification Preferences</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          name="emailNotifications"
                          checked={formData.settings?.emailNotifications || false}
                          onChange={handleSettingsChange}
                          disabled={!isEditing}
                          className="mr-2 h-5 w-5"
                        />
                        <label htmlFor="emailNotifications">Email Notifications</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="smsNotifications"
                          name="smsNotifications"
                          checked={formData.settings?.smsNotifications || false}
                          onChange={handleSettingsChange}
                          disabled={!isEditing}
                          className="mr-2 h-5 w-5"
                        />
                        <label htmlFor="smsNotifications">SMS Notifications</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3">Security</h4>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                      disabled={!isEditing}
                    >
                      Change Password
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-3">Account Actions</h4>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      disabled={!isEditing}
                    >
                      Deactivate Account
                    </button>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 