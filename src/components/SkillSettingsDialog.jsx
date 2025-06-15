import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Target, Clock } from "lucide-react";
import {
  DEFAULT_TARGET_HOURS,
  FALLBACK_DEFAULT_SESSION_DURATION,
} from "@/constants/settingsConstants";
import { validateSkillSettingsForm } from "@/schemas/skillSettingsSchema";
import ValidationAlert from "./ValidationAlert";

const SkillSettingsDialog = ({
  isOpen,
  onClose,
  onSave,
  skill,
  currentSettings,
}) => {
  const [settings, setSettings] = useState({
    defaultSessionDuration:
      currentSettings?.defaultSessionDuration?.toString() ||
      FALLBACK_DEFAULT_SESSION_DURATION.toString(),
    targetHours:
      currentSettings?.targetHours?.toString() ||
      DEFAULT_TARGET_HOURS.toString(),
  });

  const [fieldErrors, setFieldErrors] = useState({});

  // Update settings when currentSettings changes (when dialog opens with different skill)
  useEffect(() => {
    setSettings({
      defaultSessionDuration:
        currentSettings?.defaultSessionDuration?.toString() ||
        FALLBACK_DEFAULT_SESSION_DURATION.toString(),
      targetHours:
        currentSettings?.targetHours?.toString() ||
        DEFAULT_TARGET_HOURS.toString(),
    });
    // Clear errors when settings change
    setFieldErrors({});
  }, [currentSettings]);

  // Validate form data
  const validateForm = () => {
    const result = validateSkillSettingsForm(settings);

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

  // Real-time validation on input change
  const validateField = (fieldName, value) => {
    const fieldSettings = { ...settings, [fieldName]: value };
    const result = validateSkillSettingsForm(fieldSettings);

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
        setFieldErrors((prev) => ({ ...prev, [fieldName]: undefined }));
      }
    } else {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };

  console.log({ currentSettings, settings });

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    onSave({
      defaultSessionDuration:
        parseInt(settings.defaultSessionDuration) ||
        FALLBACK_DEFAULT_SESSION_DURATION,
      targetHours: parseInt(settings.targetHours) || DEFAULT_TARGET_HOURS,
    });
    onClose();
  };

  const handleReset = () => {
    setSettings({
      defaultSessionDuration: FALLBACK_DEFAULT_SESSION_DURATION.toString(),
      targetHours: DEFAULT_TARGET_HOURS.toString(),
    });
    setFieldErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {skill?.name} Settings
          </DialogTitle>
          <DialogDescription>
            Configure skill-specific settings for {skill?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="defaultDuration"
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Default Session Duration (minutes)
            </Label>
            <Input
              id="defaultDuration"
              type="number"
              value={settings.defaultSessionDuration}
              onChange={(e) => {
                const value = e.target.value;
                setSettings({
                  ...settings,
                  defaultSessionDuration: value,
                });
                validateField("defaultSessionDuration", value);
              }}
              min="5"
              max="1440"
              placeholder={FALLBACK_DEFAULT_SESSION_DURATION}
              className={
                fieldErrors.defaultSessionDuration ? "border-destructive" : ""
              }
            />
            {fieldErrors.defaultSessionDuration && (
              <p className="text-sm text-destructive">
                {fieldErrors.defaultSessionDuration}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              This will be pre-filled when logging time for this skill
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetHours" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Mastery Goal (hours)
            </Label>
            <Input
              id="targetHours"
              type="number"
              value={settings.targetHours}
              onChange={(e) => {
                const value = e.target.value;
                setSettings({
                  ...settings,
                  targetHours: value,
                });
                validateField("targetHours", value);
              }}
              min="1"
              max="10000"
              placeholder={DEFAULT_TARGET_HOURS}
              className={fieldErrors.targetHours ? "border-destructive" : ""}
            />
            {fieldErrors.targetHours && (
              <p className="text-sm text-destructive">
                {fieldErrors.targetHours}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              The number of hours to reach mastery (default: 1000 hours)
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkillSettingsDialog;
