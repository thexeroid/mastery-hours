import React from "react";
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
  ArrowLeft,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Plus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSkillContext } from "@/context/SkillContext";
import MilestoneHUD from "./MilestoneHUD";

const SkillProgressView = ({
  skills,
  sessions,
  getSkillMetrics,
  getDailyHours,
}) => {
  const { settings } = useSkillContext();
  const { skillId } = useParams();
  const navigate = useNavigate();

  const selectedSkill = skills.find((s) => s.id === skillId);
  const metrics = getSkillMetrics(skillId);
  const dailyHours = getDailyHours(skillId);

  const skillSessions = sessions.filter((s) => s.skillId === selectedSkill?.id);

  if (!selectedSkill) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Skill not found</h2>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  // Empty state when no sessions are logged
  if (!metrics) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/`)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold">
              {selectedSkill.name} Progress
            </h2>
            <p className="text-muted-foreground">
              Your deliberate practice journey
            </p>
          </div>
        </div>

        <Card className="text-center py-16">
          <CardContent className="pt-6">
            <div className="text-muted-foreground mb-6">
              <TrendingUp size={64} className="mx-auto" />
            </div>
            <CardTitle className="text-2xl mb-4">
              No sessions logged yet
            </CardTitle>
            <CardDescription className="text-lg mb-6 max-w-md mx-auto">
              Start tracking your progress by logging your first practice
              session for <strong>{selectedSkill.name}</strong>. Every session
              brings you closer to mastery!
            </CardDescription>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate(`/log-time/${selectedSkill.id}`)}
                size="lg"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Log First Session
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} size="lg">
                Back to Skills
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/`)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold">{selectedSkill.name} Progress</h2>
          <p className="text-muted-foreground">
            Your deliberate practice journey
          </p>
        </div>
      </div>

      {/* Insight Summary */}
      <Card className="my-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 dark:from-blue-950/50 dark:to-purple-950/50 dark:border-blue-800">
        <CardContent>
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            <span className="text-lg font-bold">Insight:</span> You've practiced{" "}
            <strong>{selectedSkill.name}</strong> for{" "}
            <strong>{metrics.totalHours} hours</strong> over{" "}
            <strong>{metrics.timeRange} days</strong> ({metrics.daysPracticed}{" "}
            practice days). Your consistency rate is{" "}
            <strong>
              {Math.round((metrics.daysPracticed / metrics.timeRange) * 100)}%
            </strong>{" "}
            with an average of{" "}
            <strong>{metrics.avgMinutesPerSession} minutes per session</strong>.
          </p>
        </CardContent>
      </Card>

      {/* 1000-Hour Milestone HUD */}
      <MilestoneHUD metrics={metrics} className="mb-6" />

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metrics.totalHours}h
            </div>
            <p className="text-sm text-muted-foreground">Total Hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {metrics.totalSessions}
            </div>
            <p className="text-sm text-muted-foreground">Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {metrics.daysPracticed}
            </div>
            <p className="text-sm text-muted-foreground">Days Practiced</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round((metrics.daysPracticed / metrics.timeRange) * 100)}%
            </div>
            <p className="text-sm text-muted-foreground">Consistency</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Daily Practice Hours
            </CardTitle>
            <CardDescription>Your recent practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyHours.slice(0, 10).map((day) => (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-muted-foreground font-medium">
                    {day.displayDate}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={Math.min(
                          (parseFloat(day.hours) /
                            (selectedSkill.settings.defaultSessionDuration /
                              60)) *
                            100,
                          100
                        )}
                        className="flex-1"
                      />
                      <Badge variant="secondary" className="text-xs">
                        {day.hours}h
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Session History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Sessions
            </CardTitle>
            <CardDescription>Your latest practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skillSessions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 8)
                .map((session) => (
                  <div
                    key={session.id}
                    className="border-l-2 border-primary/20 pl-4 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                      <Badge variant="outline">
                        {Math.round(session.duration)}m
                      </Badge>
                    </div>
                    {session.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {session.notes}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillProgressView;
