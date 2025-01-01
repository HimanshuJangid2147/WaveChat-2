import { Link, Navigate } from "react-router-dom";
import { Bell, User, StepBack, Eye } from "lucide-react";
import { useSettingsStore } from "../store/useSettingsStore";
import { useAuthStore } from "../store/useAuthStore";

const SettingsPage = () => {
  const {
    settings,
    isFetchingSettings,
    isUpdatingSettings,
    updateSettings,
    resetSettings,
  } = useSettingsStore();

  const { authUser } = useAuthStore();

  // Redirect if not authenticated
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  const handleSettingChange = async (setting, value) => {
    if (isUpdatingSettings) return;
    const success = await updateSettings({
      ...settings,
      [setting]: value,
    });

    if (!success && setting === "notifications") {
      const checkboxElement = document.querySelector(
        `input[name="${setting}"]`
      );
      if (checkboxElement) checkboxElement.checked = false;
    }
  };

  const handleResetSettings = async () => {
    if (isUpdatingSettings) return;
    if (
      window.confirm("Are you sure you want to reset all settings to default?")
    ) {
      await resetSettings();
    }
  };

  if (isFetchingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#cdfdff] p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#012e3f]/70 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-lg">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#47e2ff] to-[#cdfdff] bg-clip-text text-transparent">
                App Settings
              </h2>
              <p className="text-[#87cfd8] mt-1 text-sm sm:text-base">
                Customize your app experience
              </p>
            </div>

            <div className="flex items-center gap-2">
            {/* Reset Button */}
            <div className="flex gap-2 mt-4">
              <button
                className={`px-4 py-2 bg-[#003847] hover:bg-[#004d5e] rounded-lg transition-colors text-sm ${
                  isUpdatingSettings ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleResetSettings}
                disabled={isUpdatingSettings}
              >
                Reset to Defaults
              </button>
            </div>
            {/* Back Button */}
            <div className="flex gap-2 mt-4">
              <button
                className={`px-4 py-2 bg-[#47e2ff] hover:bg-[#38b8d6] rounded-lg text-[#002233] transition-all hover:shadow-lg ${
                  isUpdatingSettings ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isUpdatingSettings}
              >
                <Link to="/" className="flex items-center justify-center">
                  <StepBack className="w-4 h-4 mr-2" />
                  <span>Go Back</span>
                </Link>
              </button>
            </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Appearance Settings */}
            <div className="bg-gradient-to-b from-[#002233] to-[#001522] rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 text-[#87cfd8] flex items-center gap-2">
                <User className="w-4 h-4 text-[#47e2ff]" />
                Appearance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border-b border-[#efefef]/10">
                  <span>Font Size</span>
                  <select
                    value={settings?.fontSize || "medium"}
                    onChange={(e) =>
                      handleSettingChange("fontSize", e.target.value)
                    }
                    disabled={isUpdatingSettings}
                    className={`px-4 py-2 bg-[#003847] rounded-lg border border-[#47e2ff]/20 focus:border-[#47e2ff] outline-none transition-colors text-sm ${
                      isUpdatingSettings ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-gradient-to-b from-[#002233] to-[#001522] rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 text-[#87cfd8] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#47e2ff]" />
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border-b border-[#efefef]/10">
                  <span>Push Notifications</span>
                  <ToggleSwitch
                    name="notifications"
                    checked={settings?.notifications}
                    onChange={(e) =>
                      handleSettingChange("notifications", e.target.checked)
                    }
                    disabled={isUpdatingSettings}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border-b border-[#efefef]/10">
                  <span>Message Sounds</span>
                  <ToggleSwitch
                    name="messageSound"
                    checked={settings?.messageSound}
                    onChange={(e) =>
                      handleSettingChange("messageSound", e.target.checked)
                    }
                    disabled={isUpdatingSettings}
                  />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gradient-to-b from-[#002233] to-[#001522] rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 text-[#87cfd8] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#47e2ff]" />
                Privacy
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border-b border-[#efefef]/10">
                  <div>
                    <span>Online Status</span>
                    <p className="text-sm text-[#87cfd8]/70">
                      Show when you&apos;re active
                    </p>
                  </div>
                  <ToggleSwitch
                    name="onlineStatus"
                    checked={settings?.onlineStatus}
                    onChange={(e) =>
                      handleSettingChange("onlineStatus", e.target.checked)
                    }
                    disabled={isUpdatingSettings}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border-b border-[#efefef]/10">
                  <div>
                    <span>Read Receipts</span>
                    <p className="text-sm text-[#87cfd8]/70">
                      Show when you&apos;ve read messages
                    </p>
                  </div>
                  <ToggleSwitch
                    name="readReceipts"
                    checked={settings?.readReceipts}
                    onChange={(e) =>
                      handleSettingChange("readReceipts", e.target.checked)
                    }
                    disabled={isUpdatingSettings}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Toggle Switch Component
const ToggleSwitch = ({ name, checked, onChange, disabled }) => (
  <label
    className={`relative inline-flex items-center ${
      disabled ? "cursor-not-allowed" : "cursor-pointer"
    }`}
  >
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="sr-only peer"
    />
    <div
      className={`w-11 h-6 bg-[#003847] rounded-full peer 
      peer-checked:after:translate-x-full after:content-[''] 
      after:absolute after:top-[2px] after:left-[2px] 
      after:bg-[#47e2ff] after:rounded-full after:h-5 
      after:w-5 after:transition-all 
      peer-checked:bg-[#004d5e] ${disabled ? "opacity-50" : ""}`}
    ></div>
  </label>
);

export default SettingsPage;
