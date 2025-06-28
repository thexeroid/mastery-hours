import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentDate, formatDate } from "@/utils/dateUtils";
import useLocalStorage from "@/hooks/useLocalStorage";
import { withFallback } from "@/utils/fallbackUtils";
import { addDays, formatDistanceToNow, differenceInDays } from "date-fns";
import supabase from "@/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { toCamelCase, toSnakeCase } from "@/utils/caseUtils";
import {
  transformSkillsToClient,
  transformSkillToClient,
} from "@/transformers/skillTransformers";

const SkillContext = createContext();

export const useSkillContext = () => {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error("useSkillContext must be used within a SkillProvider");
  }
  return context;
};

export const SkillProvider = ({ children }) => {
  const {
    user: { id: userId },
  } = useAuth();

  const [skills, setSkills] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [settings, setSettings] = useState({
    theme: withFallback(null, "theme"),
    defaultSessionDuration: withFallback(null, "defaultSessionDuration"),
  });

  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    skills: true,
    sessions: true,
    settings: true,
  });

  // Check if all data is loaded
  const isDataLoaded =
    !loadingStates.skills && !loadingStates.sessions && !loadingStates.settings;

  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoadingStates((prev) => ({ ...prev, skills: true }));
        let { data: skills, error } = await supabase
          .from("skills")
          .select("*")
          .eq("user_id", userId);

        if (error) throw error;
        setSkills(transformSkillsToClient(skills));
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoadingStates((prev) => ({ ...prev, skills: false }));
      }
    }

    fetchSkills();
  }, [userId]);

  useEffect(() => {
    async function fetchSessions() {
      try {
        setLoadingStates((prev) => ({ ...prev, sessions: true }));
        let { data: sessions, error } = await supabase
          .from("sessions")
          .select("*")
          .eq("user_id", userId);

        if (error) throw error;
        setSessions(toCamelCase(sessions));
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoadingStates((prev) => ({ ...prev, sessions: false }));
      }
    }

    fetchSessions();
  }, [userId]);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoadingStates((prev) => ({ ...prev, settings: true }));
        let { data: settings, error } = await supabase
          .from("settings")
          .select("*")
          .eq("user_id", userId);

        if (error) throw error;
        setSettings(toCamelCase(settings?.[0] ?? []));
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoadingStates((prev) => ({ ...prev, settings: false }));
      }
    }

    fetchSettings();
  }, [userId]);

  const addSkill = async (skillName) => {
    const { data, error } = await supabase
      .from("skills")
      .insert(toSnakeCase({ name: skillName, userId }))
      .select();

    if (!error) {
      const newSkills = [...skills, transformSkillToClient(data[0])];
      setSkills(newSkills);
    }
  };

  const deleteSkill = async (skillId) => {
    const newSkills = skills.filter((s) => s.id !== skillId);
    const newSessions = sessions.filter((s) => s.skillId !== skillId);

    const { error } = await supabase.from("skills").delete().eq("id", skillId);

    if (!error) {
      setSkills(newSkills);
      setSessions(newSessions);
    }
  };

  const updateSkillSettings = async (skillId, newSettings) => {
    const { defaultSessionDuration, targetHours } = newSettings;
    const { data, error } = await supabase
      .from("skills")
      .update(toSnakeCase({ defaultSessionDuration, targetHours }))
      .eq("id", skillId)
      .select();

    if (!error) {
      const updatedSkills = skills.map((skill) =>
        skill.id === skillId ? transformSkillToClient(data[0]) : skill
      );

      setSkills(updatedSkills);
    }
  };

  const logSession = async (logForm) => {
    const { skillId, duration, date, notes } = logForm;

    const { data, error } = await supabase
      .from("sessions")
      .insert(
        toSnakeCase({
          skillId,
          userId,
          duration,
          date,
          notes,
        })
      )
      .select();

    if (!error) {
      const newSessions = [...sessions, toCamelCase(data[0])];
      setSessions(newSessions);
    }
  };

  const updateSettings = async (newSettings) => {
    const { data, error } = await supabase
      .from("settings")
      .update(toSnakeCase(newSettings))
      .eq("user_id", userId)
      .select();

    if (!error) {
      setSettings(toCamelCase(data[0]));
    }
  };

  const getSkillMetrics = (skillId) => {
    const skillSessions = sessions.filter((s) => s.skillId === skillId);
    if (skillSessions.length === 0) return null;

    const skill = skills.find((s) => s.id === skillId);
    const targetHours = withFallback(
      skill?.settings?.targetHours,
      "targetHours"
    );

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
    const daysDiff = differenceInDays(today, startDate) + 1;

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
    loadingStates,
    isDataLoaded,
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
