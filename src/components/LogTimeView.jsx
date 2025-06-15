import React, { useState, useEffect } from "react";
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
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCurrentDate,
  formatDate,
  isValidDate,
  dateToYYYYMMDD,
} from "@/utils/dateUtils";
import { FALLBACK_DEFAULT_SESSION_DURATION } from "@/constants/settingsConstants";

const LogSessionDatePicker = ({ value, onChange }) => {
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
          className="bg-background pr-10"
          onChange={handleInputChange}
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
    </div>
  );
};

const LogTimeView = ({ skills, onLogSession, defaultDuration }) => {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const selectedSkill = skills.find((s) => s.id === skillId);
  const skillDefaultDuration =
    selectedSkill?.settings?.defaultSessionDuration || defaultDuration;

  const [logForm, setLogForm] = useState({
    skillId: skillId || "",
    duration: skillDefaultDuration,
    date: getCurrentDate(),
    notes: "",
  });

  // Update form when skillId changes (e.g., when navigating from different skills)
  useEffect(() => {
    if (skillId) {
      const skill = skills.find((s) => s.id === skillId);
      const skillDefaultDuration =
        skill?.settings?.defaultSessionDuration || defaultDuration;
      setLogForm((prev) => ({
        ...prev,
        skillId,
        duration: skillDefaultDuration,
      }));
    }
  }, [skillId, skills, defaultDuration]);

  const handleSkillChange = (value) => {
    setLogForm((prev) => ({ ...prev, skillId: value }));

    // Navigate to the skill-specific route when a skill is selected
    if (value) {
      navigate(`/log-time/${value}`);
    } else {
      navigate("/log-time");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!logForm.skillId || !logForm.duration) return;

    onLogSession(logForm);
    setLogForm({
      skillId: skillId || "",
      duration: "",
      date: getCurrentDate(),
      notes: "",
    });
    navigate("/");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
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
              <Select value={logForm.skillId} onValueChange={handleSkillChange}>
                <SelectTrigger className="w-full">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder={`e.g., ${FALLBACK_DEFAULT_SESSION_DURATION}`}
                value={logForm.duration}
                onChange={(e) =>
                  setLogForm({ ...logForm, duration: e.target.value })
                }
                min="1"
                max="1440"
              />
            </div>

            <LogSessionDatePicker
              value={logForm.date}
              onChange={(date) => setLogForm({ ...logForm, date })}
            />

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="What did you practice? Any breakthroughs or challenges?"
                value={logForm.notes}
                onChange={(e) =>
                  setLogForm({ ...logForm, notes: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!logForm.skillId || !logForm.duration}
              >
                Log Session
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogTimeView;
