import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Settings,
  Clock,
  Globe,
  Bell,
  Palette,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import UnsavedChangesDialog from "../components/UnsavedChangesDialog";
import ValidationAlert from "../components/ValidationAlert";
import { useSettings } from "@/hooks/useSettings";

const SettingsPage = () => {
  const {
    localSettings,
    showUnsavedDialog,
    fieldErrors,
    exitError,
    handleDurationChange,
    handleBackClick,
    handleApplyChanges,
    handleCloseChanges,
    handleSave,
    handleReset,
    handleThemeChange,
    handleThemeToggle,
    getThemeIcon,
    clearExitError,
  } = useSettings();

  const getThemeIconComponent = () => {
    switch (getThemeIcon()) {
      case "light":
        return <Sun className="w-4 h-4" />;
      case "dark":
        return <Moon className="w-4 h-4" />;
      case "system":
        return <Monitor className="w-4 h-4" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={handleBackClick}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Practice Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Practice Goals
            </CardTitle>
            <CardDescription>
              Set your daily practice targets and session preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultSessionDuration">
                Default Session Duration (minutes)
              </Label>
              <Input
                id="defaultSessionDuration"
                type="number"
                min="5"
                max="1440"
                step="5"
                value={String(localSettings.defaultSessionDuration)}
                onChange={handleDurationChange}
                className={
                  fieldErrors.defaultSessionDuration
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {fieldErrors.defaultSessionDuration && (
                <p className="text-sm text-destructive">
                  {fieldErrors.defaultSessionDuration}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Pre-filled duration when logging new sessions
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Display
            </CardTitle>
            <CardDescription>
              Customize how information is displayed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <div className="flex gap-2">
                <Select
                  value={localSettings.theme}
                  onValueChange={handleThemeChange}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleThemeToggle}
                  title="Toggle theme"
                >
                  {getThemeIconComponent()}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Choose your preferred color scheme
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
        </div>
      </div>

      {showUnsavedDialog && (
        <UnsavedChangesDialog
          isOpen={showUnsavedDialog}
          onApply={handleApplyChanges}
          onClose={handleCloseChanges}
        />
      )}

      {exitError && (
        <ValidationAlert
          isVisible={exitError}
          message={exitError}
          onClose={() => clearExitError()}
        />
      )}
    </div>
  );
};

export default SettingsPage;
