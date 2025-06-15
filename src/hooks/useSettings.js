import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSkillContext } from "@/context/SkillContext";
import {
  FALLBACK_DEFAULT_SESSION_DURATION,
  FALLBACK_THEME,
  SETTINGS_ERROR_MESSAGES,
} from "@/constants/settingsConstants";
import { validateSettingsForm } from "@/schemas/settingsSchema";

export const useSettings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSkillContext();

  const [localSettings, setLocalSettings] = useState({
    theme: settings?.theme ?? FALLBACK_THEME,
    defaultSessionDuration:
      settings?.defaultSessionDuration ?? FALLBACK_DEFAULT_SESSION_DURATION,
  });
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [exitError, setExitError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  // Validate form data
  const validateForm = () => {
    const formData = {
      theme: localSettings.theme,
      defaultSessionDuration: String(localSettings.defaultSessionDuration),
    };

    const result = validateSettingsForm(formData);

    if (!result.success) {
      const errors = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0];
        errors[field] = error.message;
      });
      setFieldErrors(errors);
      return false;
    }

    setFieldErrors({});
    return true;
  };

  // Validate single field in real-time
  const validateField = (fieldName, value) => {
    const formData = {
      theme: localSettings.theme,
      defaultSessionDuration: String(localSettings.defaultSessionDuration),
    };

    // Update the field being validated
    formData[fieldName] = value;

    const result = validateSettingsForm(formData);

    if (!result.success) {
      const fieldError = result.error.errors.find(
        (error) => error.path[0] === fieldName
      );
      if (fieldError) {
        setFieldErrors((prev) => ({
          ...prev,
          [fieldName]: fieldError.message,
        }));
      } else {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } else {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Handle duration input change with real-time validation
  const handleDurationChange = (e) => {
    const value = e.target.value;
    const numericValue = parseInt(value) || 0;
    setLocalSettings((prev) => ({
      ...prev,
      defaultSessionDuration: numericValue,
    }));
    validateField("defaultSessionDuration", value);
    // Clear exit error when user starts fixing the issue
    if (exitError) {
      setExitError("");
    }
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    return JSON.stringify(localSettings) !== JSON.stringify(settings);
  };

  // Check if form has errors
  const hasErrors = () => {
    return Object.keys(fieldErrors).length > 0;
  };

  // Handle navigation attempts
  const handleNavigation = (path) => {
    if (hasUnsavedChanges() && validateForm()) {
      setShowUnsavedDialog(true);
    } else {
      navigate(path);
    }
  };

  // Handle back button
  const handleBackClick = () => {
    handleNavigation("/");
  };

  // Handle apply changes
  const handleApplyChanges = () => {
    if (!validateForm()) {
      setExitError(SETTINGS_ERROR_MESSAGES.FIX_BEFORE_SAVING);
      return;
    }

    updateSettings(localSettings);
    setShowUnsavedDialog(false);
    setExitError("");

    // Show success message
    setAlertMessage("Settings applied successfully!");
    setAlertType("success");

    // Navigate after a delay to show the success message
    setTimeout(() => {
      setAlertMessage("");
      navigate("/");
    }, 1500);
  };

  const handleCloseChanges = () => {
    setShowUnsavedDialog(false);
  };

  // Handle save button
  const handleSave = () => {
    if (!validateForm()) {
      setExitError(SETTINGS_ERROR_MESSAGES.FIX_BEFORE_SAVING);
      return;
    }

    updateSettings(localSettings);
    setExitError("");

    // Show success message
    setAlertMessage("Settings saved successfully!");
    setAlertType("success");

    // Navigate after a delay to show the success message
    setTimeout(() => {
      setAlertMessage("");
      navigate("/");
    }, 1500);
  };

  // Handle reset to defaults
  const handleReset = () => {
    setLocalSettings({
      theme: FALLBACK_THEME,
      defaultSessionDuration: FALLBACK_DEFAULT_SESSION_DURATION,
    });
    setFieldErrors({});
    setExitError("");

    // Show success message
    setAlertMessage("Settings reset to defaults!");
    setAlertType("success");

    // Clear success message after delay
    setTimeout(() => {
      setAlertMessage("");
    }, 1500);
  };

  // Handle theme change
  const handleThemeChange = (value) => {
    setLocalSettings({ ...localSettings, theme: value });
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    const themeCycle = ["light", "dark", "system"];
    const currentIndex = themeCycle.indexOf(localSettings.theme);
    const nextIndex = (currentIndex + 1) % themeCycle.length;
    const nextTheme = themeCycle[nextIndex];
    setLocalSettings({
      ...localSettings,
      theme: nextTheme,
    });
  };

  // Get theme icon
  const getThemeIcon = () => {
    switch (localSettings.theme) {
      case "light":
        return "light";
      case "dark":
        return "dark";
      case "system":
        return "system";
      default:
        return "light";
    }
  };

  return {
    // State
    localSettings,
    showUnsavedDialog,
    fieldErrors,
    exitError,
    alertMessage,
    alertType,

    // Computed values
    hasErrors,

    // Actions
    handleDurationChange,
    handleBackClick,
    handleApplyChanges,
    handleCloseChanges,
    handleSave,
    handleReset,
    handleThemeChange,
    handleThemeToggle,
    getThemeIcon,
    clearExitError: () => setExitError(""),
    setAlertMessage,
  };
};
