import { Camera, LogOut, Mail, Save, StepBack, User, User2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState, useMemo, useCallback } from "react";
import defaultavatar from "../assets/avatar.png";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { 
    logout, 
    authUser, 
    updateProfile, 
    changeUsername, 
  } = useAuthStore();
  
  const [selectedImg, setSelectedImg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    fullName: ''
  });
  
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || '',
    username: authUser?.username || '',
    email: authUser?.email || ''
  });

  // Track if form has been modified
  const isFormModified = useMemo(() => {
    return formData.fullName !== authUser?.fullName ||
           formData.username !== authUser?.username ||
           formData.email !== authUser?.email ||
           selectedImg !== null;
  }, [formData, authUser, selectedImg]);

  // Validate form data
  const validateForm = useCallback(() => {
    const errors = {
      username: '',
      email: '',
      fullName: ''
    };
    
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.fullName) {
      errors.fullName = 'Full name is required';
    }
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // Save profile
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
  
    setIsSaving(true);
    try {
      // Handle username change first if it was modified
      if (formData.username !== authUser?.username) {
        await changeUsername(formData.username);
      }
  
      // Only proceed with other updates if there are changes
      const hasProfileChanges = 
        formData.fullName !== authUser?.fullName ||
        formData.email !== authUser?.email ||
        selectedImg;
  
      if (hasProfileChanges) {
        const updateData = {};
        if (formData.fullName !== authUser?.fullName) {
          updateData.fullName = formData.fullName;
        }
        if (formData.email !== authUser?.email) {
          updateData.email = formData.email;
        }
        if (selectedImg) {
          updateData.profilePic = selectedImg;
        }
  
        await updateProfile(updateData);
      }
  
      toast.success("Profile updated successfully");
      setSelectedImg(null);
    } catch (error) {
      console.error('Save error:', error);
      if (error?.field) {
        setFormErrors(prev => ({
          ...prev,
          [error.field]: error.message
        }));
      } else {
        toast.error(error?.message || "Failed to update profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate profile completion percentage
  const profileCompletion = useMemo(() => {
    const fields = [
      !!authUser?.profilePic || !!selectedImg,  // Profile picture
      !!formData.fullName,                      // Full name
      !!formData.username,                      // Username
      !!formData.email                          // Email
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  }, [authUser?.profilePic, selectedImg, formData]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
    };
  };

  return (
    <div className="min-h-screen text-[#cdfdff] p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#012e3f]/70 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-lg z-20">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#47e2ff] to-[#cdfdff] bg-clip-text text-transparent">Profile Information</h2>
              <p className="text-[#87cfd8] mt-1 text-sm sm:text-base">Manage your personal information</p>
            </div>
            <button 
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all flex items-center justify-center
                ${isSaving || !isFormModified
                  ? 'bg-[#47e2ff]/50 cursor-not-allowed'
                  : 'bg-[#47e2ff] hover:bg-[#38b8d6] hover:shadow-lg'
                } text-[#002233]`}
              onClick={handleSave}
              disabled={isSaving || !isFormModified}
            >
              <Save className="w-4 h-4 mr-2"/>
              <span>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </span>
            </button>
          </div>

          {/* Profile Image and Progress Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">

            {/* Profile Image */}
            <div className="relative group">
              <img
                src={selectedImg || authUser?.profilePic || defaultavatar}
                alt="Profile"
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border-4 border-[#47e2ff] group-hover:border-[#38b8d6] transition-all"
                style={{ minHeight: '96px', minWidth: '96px' }}
              />
              <label 
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-[#47e2ff] hover:bg-[#38b8d6] hover:scale-105 p-2 rounded-full cursor-pointer shadow-lg transition-all duration-200 ${isSaving ? "opacity-50 pointer-events-none" : ""}`}
              >
                <Camera className="w-4 h-4 text-[#002233]"/>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isSaving} 
                />
              </label>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 w-full bg-gradient-to-b from-[#002233] to-[#001522] rounded-lg p-4 flex flex-col">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center sm:text-left">{authUser?.fullName}</h3>
              <div className="w-full bg-[#003847] rounded-full h-1.5 mt-4 overflow-hidden hidden sm:block">
                <div
                  className="bg-gradient-to-r from-[#47e2ff] to-[#38b8d6] h-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="text-sm text-[#87cfd8] mt-2 hidden sm:block">Profile completion: {profileCompletion}%</p>
              <p className="text-[#efefef] text-sm mt-2 text-center sm:text-left hidden sm:block">
                {isSaving ? "Saving changes..." : "Click the camera icon to upload a new profile picture"}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

            {/* Full Name Section */}
            <div className="space-y-2 hidden sm:block">
              <label className="text-sm text-[#87cfd8] flex items-center gap-2">
                <User className="w-4 h-4 text-[#47e2ff]" />
                Full Name
              </label>
              <input 
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-[#003847] rounded-lg border ${
                  formErrors.fullName ? 'border-red-500' : 'border-[#47e2ff]/20'
                } focus:border-[#47e2ff] outline-none transition-colors`}
                placeholder="Enter your full name"
                disabled={isSaving}
              />
              {formErrors.fullName && (
                <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
              )}
            </div>

            {/* Username Section */}
            <div className="space-y-2">
              <label className="text-sm text-[#87cfd8] flex items-center gap-2">
                <User2 className="w-4 h-4 text-[#47e2ff]" />
                Username
              </label>
              <input 
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-[#003847] rounded-lg border ${
                  formErrors.username ? 'border-red-500' : 'border-[#47e2ff]/20'
                } focus:border-[#47e2ff] outline-none transition-colors`}
                placeholder="Enter your username"
                disabled={isSaving}
              />
              {formErrors.username && (
                <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
              )}
            </div>

            {/* Email Section */}
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <label className="text-sm text-[#87cfd8] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#47e2ff]" />
                Email Address
              </label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-[#003847] rounded-lg border ${
                  formErrors.email ? 'border-red-500' : 'border-[#47e2ff]/20'
                } focus:border-[#47e2ff] outline-none transition-colors`}
                placeholder="Enter your email"
                disabled={isSaving}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Account Information */}
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <h2 className="text-lg font-medium mb-4 text-[#87cfd8]">Account Information</h2>
              <div className="space-y-3 text-sm bg-gradient-to-b from-[#002233] to-[#001522] rounded-lg px-2 pb-3">
                <div className="flex items-center justify-between p-3 border-b border-[#efefef]/10">
                  <span>Member Since</span>
                  <span>{new Date(authUser?.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between px-3">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>

            {/* Buttons Section */}
            <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row justify-end mt-4 items-center gap-4 z-50">
              <button className="w-full sm:w-auto px-4 py-2 bg-[#47e2ff] hover:bg-[#38b8d6] rounded-lg text-[#002233] transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSaving}>
                <Link to="/" className="flex items-center justify-center">
                  <StepBack className="w-4 h-4 mr-2"/>
                  <span>Go Back</span>
                </Link>
              </button>

              <button 
                onClick={logout}
                disabled={isSaving}
                className="w-full sm:w-auto px-4 py-2 bg-red-500/90 hover:bg-red-600 rounded-lg text-white transition-all hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ">
                <LogOut className="w-4 h-4 mr-2"/>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;