import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSkillContext } from "@/context/SkillContext";
import { withFallback } from "@/utils/fallbackUtils";
import { SETTINGS_ERROR_MESSAGES } from "@/constants/settingsConstants";
import { validateSettingsForm } from "@/schemas/settingsSchema";

export const useSettings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSkillContext();

  // Track only the changes (delta) from original settings
  const [settingsDelta, setSettingsDelta] = useState({});
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [exitError, setExitError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [isSaving, setIsSaving] = useState(false);

  // Compute current settings by merging original settings with delta
  const currentSettings = useMemo(() => {
    const originalSettings = {
      theme: withFallback(settings?.theme, "theme"),
      defaultSessionDuration: withFallback(
        settings?.defaultSessionDuration,
        "defaultSessionDuration"
      ),
    };

    return {
      ...originalSettings,
      ...settingsDelta,
    };
  }, [settings, settingsDelta]);

  // Validate form data
  const validateForm = () => {
    const formData = {
      theme: currentSettings.theme,
      defaultSessionDuration: String(currentSettings.defaultSessionDuration),
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
      theme: currentSettings.theme,
      defaultSessionDuration: String(currentSettings.defaultSessionDuration),
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
    const originalValue = withFallback(
      settings?.defaultSessionDuration,
      "defaultSessionDuration"
    );

    if (numericValue === originalValue) {
      // Remove from delta if it matches original
      setSettingsDelta((prev) => {
        const newDelta = { ...prev };
        delete newDelta.defaultSessionDuration;
        return newDelta;
      });
    } else {
      // Add to delta if it's different
      setSettingsDelta((prev) => ({
        ...prev,
        defaultSessionDuration: numericValue,
      }));
    }

    validateField("defaultSessionDuration", value);
    // Clear exit error when user starts fixing the issue
    if (exitError) {
      setExitError("");
    }
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    return Object.keys(settingsDelta).length > 0;
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

    updateSettings(currentSettings);
    setSettingsDelta({}); // Clear delta after saving
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
    setExitError("");

    navigate("/");
  };

  const handleCancelChanges = () => {
    setShowUnsavedDialog(false);
  };

  // Handle save button
  const handleSave = async () => {
    if (!validateForm()) {
      setExitError(SETTINGS_ERROR_MESSAGES.FIX_BEFORE_SAVING);
      return;
    }

    setIsSaving(true);
    try {
      await updateSettings(currentSettings);
      setSettingsDelta({}); // Clear delta after saving
      setExitError("");

      // Show success message
      setAlertMessage("Settings saved successfully!");
      setAlertType("success");

      // Navigate after a delay to show the success message
      setTimeout(() => {
        setAlertMessage("");
        navigate("/");
      }, 500);
    } catch (error) {
      setAlertMessage("Failed to save settings. Please try again.");
      setAlertType("error");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle reset to defaults
  const handleReset = () => {
    const originalSettings = {
      theme: withFallback(null, "theme"),
      defaultSessionDuration: withFallback(null, "defaultSessionDuration"),
    };

    // Calculate delta from current settings to defaults
    const newDelta = {};
    if (currentSettings.theme !== withFallback(null, "theme")) {
      newDelta.theme = withFallback(null, "theme");
    }

    if (
      currentSettings.defaultSessionDuration !==
      withFallback(null, "defaultSessionDuration")
    ) {
      newDelta.defaultSessionDuration = withFallback(
        null,
        "defaultSessionDuration"
      );
    }

    setSettingsDelta(newDelta);
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
    const originalValue = withFallback(settings?.theme, "theme");

    if (value === originalValue) {
      // Remove from delta if it matches original
      setSettingsDelta((prev) => {
        const newDelta = { ...prev, theme: undefined };
        return newDelta;
      });
    } else {
      // Add to delta if it's different
      setSettingsDelta((prev) => ({
        ...prev,
        theme: value,
      }));
    }
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    const themeCycle = ["light", "dark", "system"];
    const currentIndex = themeCycle.indexOf(currentSettings.theme);
    const nextIndex = (currentIndex + 1) % themeCycle.length;
    const nextTheme = themeCycle[nextIndex];

    const originalValue = withFallback(settings?.theme, "theme");

    if (nextTheme === originalValue) {
      // Remove from delta if it matches original
      setSettingsDelta((prev) => {
        const newDelta = { ...prev };
        delete newDelta.theme;
        return newDelta;
      });
    } else {
      // Add to delta if it's different
      setSettingsDelta((prev) => ({
        ...prev,
        theme: nextTheme,
      }));
    }
  };

  // Get theme icon
  const getThemeIcon = () => {
    switch (currentSettings.theme) {
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
    currentSettings,
    showUnsavedDialog,
    fieldErrors,
    exitError,
    alertMessage,
    alertType,
    isSaving,

    // Computed values
    hasErrors,

    // Actions
    handleDurationChange,
    handleBackClick,
    handleApplyChanges,
    handleCloseChanges,
    handleCancelChanges,
    handleSave,
    handleReset,
    handleThemeChange,
    handleThemeToggle,
    getThemeIcon,
    clearExitError: () => setExitError(""),
    setAlertMessage,
  };
};
