import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, CalendarIcon, AlertCircle } from "lucide-react";
import { FALLBACK_DEFAULT_SESSION_DURATION } from "@/constants/settingsConstants";
import ValidationAlert from "./ValidationAlert";
import { useLogTimeView } from "@/hooks/useLogTimeView";
import { formatDate, isValidDate, dateToYYYYMMDD } from "@/utils/dateUtils";

const LogSessionDatePicker = ({ value, onChange, error, onBlur }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(value ? new Date(value) : new Date());
  const [month, setMonth] = useState(date);
  const [inputValue, setInputValue] = useState(
    value ? formatDate(new Date(value)) : formatDate(date)
  );

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setMonth(selectedDate);
      setInputValue(formatDate(selectedDate));
      onChange(dateToYYYYMMDD(selectedDate));
      setOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const inputDate = new Date(e.target.value);
    setInputValue(e.target.value);
    if (isValidDate(inputDate)) {
      setDate(inputDate);
      setMonth(inputDate);
      onChange(dateToYYYYMMDD(inputDate));
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="date" className="px-1">
        Date
      </Label>
      <div className="relative">
        <Input
          id="date"
          value={inputValue}
          placeholder="June 01, 2025"
          className={`bg-background pr-10 ${
            error ? "border-red-500 focus:border-red-500" : ""
          }`}
          onChange={handleInputChange}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="size-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

const LogTimeView = ({ skills, onLogSession, defaultDuration }) => {
  const {
    logForm,
    errors,
    isSubmitting,
    alertMessage,
    alertType,
    selectedSkill,
    isFormValid,
    notesCharCount,
    maxNotesLength,
    handleFieldChange,
    handleFieldBlur,
    handleSkillChange,
    handleSubmit,
    handleCancel,
    setAlertMessage,
  } = useLogTimeView({ skills, onLogSession, defaultDuration });

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Log Practice Time</h2>
          <p className="text-muted-foreground">Record your practice session</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
          <CardDescription>
            {selectedSkill
              ? `Logging time for: ${selectedSkill.name}`
              : "Select a skill and enter your practice details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skill">Skill</Label>
              <Select
                value={logForm.skillId}
                onValueChange={handleSkillChange}
                onOpenChange={(open) => {
                  if (!open) handleFieldBlur("skillId");
                }}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.skillId ? "border-red-500 focus:border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  {skills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.skillId && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="size-4" />
                  <span>{errors.skillId}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder={`e.g., ${FALLBACK_DEFAULT_SESSION_DURATION}`}
                value={logForm.duration}
                onChange={(e) => handleFieldChange("duration", e.target.value)}
                onBlur={() => handleFieldBlur("duration")}
                className={
                  errors.duration ? "border-red-500 focus:border-red-500" : ""
                }
                min="5"
                max="1440"
              />
              {errors.duration && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="size-4" />
                  <span>{errors.duration}</span>
                </div>
              )}
            </div>

            <LogSessionDatePicker
              value={logForm.date}
              onChange={(date) => handleFieldChange("date", date)}
              onBlur={() => handleFieldBlur("date")}
              error={errors.date}
            />

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <div className="relative">
                <Textarea
                  id="notes"
                  placeholder="What did you practice? Any breakthroughs or challenges?"
                  value={logForm.notes}
                  onChange={(e) => handleFieldChange("notes", e.target.value)}
                  onBlur={() => handleFieldBlur("notes")}
                  className={`${
                    errors.notes ? "border-red-500 focus:border-red-500" : ""
                  } pr-16`}
                  rows={3}
                />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {notesCharCount}/{maxNotesLength}
                </div>
              </div>
              {errors.notes && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="size-4" />
                  <span>{errors.notes}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? "Logging..." : "Log Session"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ValidationAlert
        isVisible={alertMessage}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage("")}
      />
    </div>
  );
};

export default LogTimeView;
