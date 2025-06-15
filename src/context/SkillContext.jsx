import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentDate, formatDate } from "@/utils/dateUtils";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  DEFAULT_TARGET_HOURS,
  FALLBACK_DEFAULT_SESSION_DURATION,
  FALLBACK_THEME,
} from "@/constants/settingsConstants";
import { addDays, formatDistanceToNow } from "date-fns";

const SkillContext = createContext();

export const useSkillContext = () => {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error("useSkillContext must be used within a SkillProvider");
  }
  return context;
};

export const SkillProvider = ({ children }) => {
  const { getItem, setItem } = useLocalStorage();

  const [skills, setSkills] = useState(() => {
    const savedSkills = getItem("skills");
    return savedSkills || [];
  });

  const [sessions, setSessions] = useState(() => {
    const savedSessions = getItem("sessions");
    return savedSessions || [];
  });

  const [settings, setSettings] = useState(() => {
    const savedSettings = getItem("settings");
    return (
      savedSettings || {
        theme: FALLBACK_THEME,
        defaultSessionDuration: FALLBACK_DEFAULT_SESSION_DURATION,
      }
    );
  });

  console.log({ settings });

  // Load sample data if no data exists
  useEffect(() => {
    if (skills.length === 0 && sessions.length === 0) {
      const sampleSkills = [
        {
          id: "1",
          name: "Guitar",
          createdAt: "2024-05-01",
          settings: {
            defaultSessionDuration: 90,
            targetHours: 1000,
          },
        },
        {
          id: "2",
          name: "Spanish",
          createdAt: "2024-05-15",
          settings: {
            defaultSessionDuration: 45,
            targetHours: 500,
          },
        },
        {
          id: "3",
          name: "React Development",
          createdAt: "2024-04-20",
          settings: {
            defaultSessionDuration: 120,
            targetHours: 2000,
          },
        },
      ];
      const sampleSessions = [
        {
          id: "1",
          skillId: "1",
          duration: 120,
          date: "2024-06-10",
          notes: "Practiced scales and arpeggios",
        },
        {
          id: "2",
          skillId: "1",
          duration: 90,
          date: "2024-06-12",
          notes: "Worked on chord transitions",
        },
        {
          id: "3",
          skillId: "2",
          duration: 60,
          date: "2024-06-11",
          notes: "Duolingo + conversation practice",
        },
        {
          id: "4",
          skillId: "1",
          duration: 75,
          date: "2024-06-14",
          notes: "New song practice - Wonderwall",
        },
        {
          id: "5",
          skillId: "2",
          duration: 45,
          date: "2024-06-14",
          notes: "Grammar exercises and vocab",
        },
        {
          id: "6",
          skillId: "3",
          duration: 180,
          date: "2024-06-13",
          notes: "Built a todo app with hooks",
        },
        {
          id: "7",
          skillId: "3",
          duration: 150,
          date: "2024-06-14",
          notes: "Learning Next.js routing",
        },
        {
          id: "8",
          skillId: "1",
          duration: 60,
          date: "2024-06-13",
          notes: "Fingerpicking exercises",
        },
      ];
      setSkills(sampleSkills);
      setSessions(sampleSessions);
      setItem("skills", sampleSkills);
      setItem("sessions", sampleSessions);
    }
  }, []);

  const addSkill = (skillName) => {
    const newSkill = {
      id: Date.now().toString(),
      name: skillName,
      createdAt: getCurrentDate(),
      settings: {
        defaultSessionDuration: settings.defaultSessionDuration,
        targetHours: DEFAULT_TARGET_HOURS,
      },
    };
    const newSkills = [...skills, newSkill];
    setSkills(newSkills);
    setItem("skills", newSkills);
  };

  const deleteSkill = (skillId) => {
    const newSkills = skills.filter((s) => s.id !== skillId);
    const newSessions = sessions.filter((s) => s.skillId !== skillId);

    setSkills(newSkills);
    setItem("skills", newSkills);
    setSessions(newSessions);
    setItem("sessions", newSessions);
  };

  const logSession = (logForm) => {
    const newSession = {
      id: Date.now().toString(),
      skillId: logForm.skillId,
      duration: parseInt(logForm.duration),
      date: logForm.date,
      notes: logForm.notes,
    };

    const newSessions = [...sessions, newSession];
    setSessions(newSessions);
    setItem("sessions", newSessions);
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    setItem("settings", newSettings);
  };

  const updateSkillSettings = (skillId, newSettings) => {
    const updatedSkills = skills.map((skill) =>
      skill.id === skillId
        ? {
            ...skill,
            settings: {
              ...skill.settings,
              ...newSettings,
            },
          }
        : skill
    );
    setSkills(updatedSkills);
    setItem("skills", updatedSkills);
  };

  const getSkillMetrics = (skillId) => {
    const skillSessions = sessions.filter((s) => s.skillId === skillId);
    if (skillSessions.length === 0) return null;

    const skill = skills.find((s) => s.id === skillId);
    const targetHours = skill?.settings?.targetHours || 1000;

    const totalMinutes = skillSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const totalSessions = skillSessions.length;
    const dates = skillSessions
      .map((s) => new Date(s.date))
      .sort((a, b) => a - b);
    const startDate = dates[0];
    const today = new Date();
    const daysPracticed = new Set(skillSessions.map((s) => s.date)).size;
    const avgMinutesPerSession = Math.round(totalMinutes / totalSessions);

    // Use today's date instead of last session date for more accurate calculations
    const daysDiff = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const sortedDates = skillSessions.map((s) => s.date).sort();

    // 1000-hour milestone calculations
    const hoursRemaining = Math.max(0, targetHours - parseFloat(totalHours));
    const hoursAbove = Math.max(0, parseFloat(totalHours) - targetHours);
    const progressPercentage = Math.min(
      (parseFloat(totalHours) / targetHours) * 100,
      100
    );

    // Calculate estimated completion date using today as the reference point
    let estimatedCompletionDate = null;
    let estimatedTimeText = null;

    if (daysDiff > 0 && parseFloat(totalHours) > 0 && hoursRemaining > 0) {
      // Calculate average hours per day based on actual practice days, not total days
      const avgHoursPerDay = parseFloat(totalHours) / daysPracticed;

      if (avgHoursPerDay > 0) {
        const daysToTarget = hoursRemaining / avgHoursPerDay;
        const completionDate = addDays(today, Math.ceil(daysToTarget));

        estimatedCompletionDate = completionDate;

        // Use date-fns for accurate human-readable time formatting
        estimatedTimeText = formatDistanceToNow(completionDate, {
          addSuffix: false,
        });
      }
    }

    return {
      totalHours,
      totalSessions,
      startDate: formatDate(sortedDates[0]),
      lastDate: formatDate(sortedDates[sortedDates.length - 1]),
      daysPracticed,
      avgMinutesPerSession,
      timeRange: daysDiff,
      // 1000-hour milestone data
      targetHours,
      hoursRemaining,
      hoursAbove,
      progressPercentage,
      estimatedCompletionDate,
      estimatedTimeText,
      isMilestoneReached: parseFloat(totalHours) >= targetHours,
    };
  };

  const getDailyHours = (skillId) => {
    const skillSessions = sessions.filter((s) => s.skillId === skillId);
    const dailyTotals = {};

    skillSessions.forEach((session) => {
      const date = session.date;
      dailyTotals[date] = (dailyTotals[date] || 0) + session.duration;
    });

    return Object.entries(dailyTotals)
      .map(([date, minutes]) => ({
        date,
        hours: (minutes / 60).toFixed(1),
        displayDate: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const value = {
    skills,
    sessions,
    settings,
    addSkill,
    deleteSkill,
    logSession,
    updateSettings,
    updateSkillSettings,
    getSkillMetrics,
    getDailyHours,
  };

  return (
    <SkillContext.Provider value={value}>{children}</SkillContext.Provider>
  );
};
