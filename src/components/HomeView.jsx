import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Calendar,
  Clock,
  Plus,
  Target,
  Trash2,
  Settings,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useTheme } from "@/context/ThemeContext";
import { useSkillContext } from "@/context/SkillContext";
import MilestoneHUD from "./MilestoneHUD";
import SkillSettingsDialog from "./SkillSettingsDialog";
import { CardSpinner } from "@/components/ui/spinner";

const HomeView = ({
  skills,
  sessions,
  onDeleteSkill,
  onLogTime,
  onViewProgress,
  getSkillMetrics,
  loadingStates,
}) => {
  const navigate = useNavigate();
  const { settings, updateSkillSettings } = useSkillContext();
  const { theme, updateTheme } = useTheme();
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    skillId: null,
    skillName: "",
  });
  const [settingsDialog, setSettingsDialog] = useState({
    isOpen: false,
    skill: null,
  });

  const handleDeleteClick = (skillId, skillName) => {
    setDeleteDialog({
      isOpen: true,
      skillId,
      skillName,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.skillId) {
      try {
        await onDeleteSkill(deleteDialog.skillId);
      } catch (error) {
        console.error("Failed to delete skill:", error);
      }
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      skillId: null,
      skillName: "",
    });
  };

  const handleSettingsClick = (skill) => {
    setSettingsDialog({
      isOpen: true,
      skill,
    });
  };

  const handleCloseSettingsDialog = () => {
    setSettingsDialog({
      isOpen: false,
      skill: null,
    });
  };

  const handleSaveSkillSettings = async (newSettings) => {
    if (settingsDialog.skill) {
      try {
        await updateSkillSettings(settingsDialog.skill.id, newSettings);
      } catch (error) {
        console.error("Failed to update skill settings:", error);
      }
    }
  };

  const getThemeIcon = () => {
    const nextTheme = getNextThemeName();
    switch (nextTheme) {
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

  const handleThemeToggle = () => {
    const themeCycle = ["light", "dark", "system"];
    const currentIndex = themeCycle.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeCycle.length;
    const nextTheme = themeCycle[nextIndex];
    updateTheme(nextTheme);
  };

  const getNextThemeName = () => {
    const themeCycle = ["light", "dark", "system"];
    const currentIndex = themeCycle.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeCycle.length;
    return themeCycle[nextIndex];
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Skill Hours Tracker
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your deliberate practice and build mastery
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleThemeToggle}
            variant="outline"
            size="lg"
            title={`Switch to ${getNextThemeName()} mode`}
          >
            {getThemeIcon()}
          </Button>
          <Button
            onClick={() => navigate("/settings")}
            variant="outline"
            size="lg"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => navigate("/add-skill")} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {loadingStates?.skills ? (
          <CardSpinner text="Loading skills..." />
        ) : skills?.length > 0 ? (
          skills.map((skill) => {
            const metrics = getSkillMetrics(skill.id);
            return (
              <Card
                key={skill.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{skill.name}</CardTitle>
                      {loadingStates?.sessions ? (
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium animate-pulse bg-muted h-4 w-16 rounded"></span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              <span className="animate-pulse bg-muted h-4 w-20 rounded"></span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span className="animate-pulse bg-muted h-4 w-24 rounded"></span>
                            </div>
                            <Badge
                              variant="secondary"
                              className="animate-pulse bg-muted"
                            >
                              Loading...
                            </Badge>
                          </div>
                        </CardDescription>
                      ) : metrics ? (
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">
                                {metrics.totalHours}h total
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              <span>{metrics.totalSessions} sessions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {metrics.daysPracticed} days over{" "}
                                {metrics.timeRange} days
                              </span>
                            </div>
                            <Badge variant="secondary">
                              Last: {metrics.lastDate}
                            </Badge>
                          </div>
                        </CardDescription>
                      ) : (
                        <CardDescription>
                          No sessions logged yet
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onLogTime(skill.id)}
                        size="sm"
                        variant="default"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Log Time
                      </Button>
                      <Button
                        onClick={() => onViewProgress(skill)}
                        size="sm"
                        variant="outline"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Progress
                      </Button>
                      <Button
                        onClick={() => handleSettingsClick(skill)}
                        size="sm"
                        variant="ghost"
                        title="Skill Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(skill.id, skill.name)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {loadingStates?.sessions ? (
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="animate-pulse bg-muted h-4 w-24 rounded"></span>
                        <span className="animate-pulse bg-muted h-4 w-32 rounded"></span>
                      </div>
                      <div className="animate-pulse bg-muted h-2 w-full rounded"></div>
                      <div className="animate-pulse bg-muted h-16 w-full rounded"></div>
                    </div>
                  </CardContent>
                ) : metrics ? (
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        Consistency:{" "}
                        {Math.round(
                          (metrics.daysPracticed / metrics.timeRange) * 100
                        )}
                        %
                      </span>
                      <span>
                        Avg: {metrics.avgMinutesPerSession}min/session
                      </span>
                    </div>
                    <Progress
                      value={Math.round(
                        (metrics.daysPracticed / metrics.timeRange) * 100
                      )}
                      className="mt-2"
                    />

                    {/* 1000-Hour Milestone HUD */}
                    <div className="mt-4">
                      <MilestoneHUD metrics={metrics} />
                    </div>
                  </CardContent>
                ) : null}
              </Card>
            );
          })
        ) : (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <div className="text-muted-foreground mb-4">
                <BarChart3 size={48} className="mx-auto" />
              </div>
              <CardTitle className="mb-2">No skills tracked yet</CardTitle>
              <CardDescription className="mb-4">
                Add your first skill to start tracking your deliberate practice
                hours.
              </CardDescription>
              <Button onClick={() => navigate("/add-skill")}>
                Add Your First Skill
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        skillName={deleteDialog.skillName}
      />

      <SkillSettingsDialog
        isOpen={settingsDialog.isOpen}
        onClose={handleCloseSettingsDialog}
        onSave={handleSaveSkillSettings}
        skill={settingsDialog.skill}
        currentSettings={settingsDialog.skill?.settings}
      />
    </div>
  );
};

export default HomeView;
