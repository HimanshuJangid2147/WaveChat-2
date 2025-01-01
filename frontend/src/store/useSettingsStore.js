import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';


const notificationSound = new Audio('/assets/sounds/wave.mp3');
// Helper function to apply font size
const applyFontSize = (fontSize) => {
  const fontSizes = {
    small: '14px',
    medium: '16px',
    large: '18px'
  };
  document.documentElement.style.fontSize = fontSizes[fontSize] || '16px';
};

export const useSettingsStore = create((set, get) => ({
  settings: null,
  isFetchingSettings: false,
  isUpdatingSettings: false,

  playNotificationSound: () => {
    const state = get();
    if (state.settings?.messageSound) {
      notificationSound.play().catch(error => {
        console.error('Error playing notification sound:', error);
      });
    }
  },

  fetchSettings: async () => {
    set({ isFetchingSettings: true });
    try {
      const response = await axiosInstance.get('/settings');
      const settingsData = response.data;
      
      // Apply font size when settings are fetched
      if (settingsData.fontSize) {
        applyFontSize(settingsData.fontSize);
      }

      set({ 
        settings: settingsData,
        isFetchingSettings: false 
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      set({ 
        settings: null, 
        isFetchingSettings: false 
      });
      toast.error(error?.response?.data?.message || 'Failed to load settings');
    }
  },

  updateSettings: async (newSettings) => {
    set({ isUpdatingSettings: true });
    try {
      if (newSettings.notifications) {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            toast.error('Permission to send notifications was denied');
            set({ isUpdatingSettings: false });
            return false;
          }
        }
      }

      const response = await axiosInstance.put('/settings', newSettings);
      const updatedSettings = response.data;
      
      // Apply font size immediately after update
      if (updatedSettings.fontSize) {
        applyFontSize(updatedSettings.fontSize);
      }

      set({ 
        settings: updatedSettings,
        isUpdatingSettings: false 
      });

      toast.success('Settings updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      set({ isUpdatingSettings: false });
      toast.error(error?.response?.data?.message || 'Failed to update settings');
      return false;
    }
  },

  resetSettings: async () => {
    set({ isUpdatingSettings: true });
    try {
      const response = await axiosInstance.post('/settings/reset');
      const defaultSettings = response.data;
      
      // Apply default font size
      applyFontSize(defaultSettings.fontSize);

      set({ 
        settings: defaultSettings,
        isUpdatingSettings: false 
      });

      toast.success('Settings reset to defaults');
      return true;
    } catch (error) {
      console.error('Error resetting settings:', error);
      set({ isUpdatingSettings: false });
      toast.error(error?.response?.data?.message || 'Failed to reset settings');
      return false;
    }
  }
}));