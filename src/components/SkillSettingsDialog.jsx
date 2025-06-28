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
  withFallback,
} from "@/utils/fallbackUtils";
import { validateSkillSettingsForm } from "@/schemas/skillSettingsSchema";
import { useSettings } from "@/hooks/useSettings";

const SkillSettingsDialog = ({
  isOpen,
  onClose,
  onSave,
  skill,
  currentSettings,
}) => {
  const [inputValues, setInputValues] = useState({
    defaultSessionDuration: FALLBACK_DEFAULT_SESSION_DURATION.toString(),
    targetHours: DEFAULT_TARGET_HOURS.toString(),
  });

  const { currentSettings: settings } = useSettings();
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Update inputValues when dialog opens or currentSettings changes
  useEffect(() => {
    if (isOpen) {
      const defaultDuration = withFallback(
        currentSettings?.defaultSessionDuration ||
          settings?.defaultSessionDuration,
        "defaultSessionDuration"
      );
      const targetHours = withFallback(
        currentSettings?.targetHours,
        "targetHours"
      );

      setInputValues({
        defaultSessionDuration: defaultDuration.toString(),
        targetHours: targetHours.toString(),
      });

      // Clear errors when dialog opens
      setFieldErrors({});
      setIsSaving(false);
    }
  }, [isOpen, currentSettings, settings]);

  // Validate form data
  const validateForm = () => {
    const result = validateSkillSettingsForm(inputValues);

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
    const fieldSettings = { ...inputValues, [fieldName]: value };
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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        defaultSessionDuration:
          parseInt(inputValues.defaultSessionDuration) ||
          FALLBACK_DEFAULT_SESSION_DURATION,
        targetHours: parseInt(inputValues.targetHours) || DEFAULT_TARGET_HOURS,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save skill settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setInputValues({
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
              value={inputValues.defaultSessionDuration}
              onChange={(e) => {
                const value = e.target.value;
                setInputValues({
                  ...inputValues,
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
              disabled={isSaving}
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
              value={inputValues.targetHours}
              onChange={(e) => {
                const value = e.target.value;
                setInputValues({
                  ...inputValues,
                  targetHours: value,
                });
                validateField("targetHours", value);
              }}
              min="1"
              max="10000"
              placeholder={DEFAULT_TARGET_HOURS}
              className={fieldErrors.targetHours ? "border-destructive" : ""}
              disabled={isSaving}
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
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkillSettingsDialog;
