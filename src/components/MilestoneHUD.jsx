import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, Calendar, Trophy } from "lucide-react";
import clsx from "clsx";

const MilestoneHUD = ({ metrics, className }) => {
  if (!metrics) return null;

  const {
    totalHours,
    targetHours,
    hoursRemaining,
    hoursAbove,
    progressPercentage,
    estimatedTimeText,
    isMilestoneReached,
  } = metrics;

  return (
    <Card
      className={clsx(
        "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 dark:from-purple-950/50 dark:to-blue-950/50 dark:border-purple-800",
        className
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">
              {targetHours}-Hour Mastery Goal
            </h3>
          </div>
          {isMilestoneReached && (
            <Badge
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              <Trophy className="w-3 h-3 mr-1" />
              Milestone Reached!
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-3 bg-purple-100 dark:bg-purple-900/30"
            />
          </div>

          {/* Current Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">
                {totalHours} / {targetHours} hours
              </span>
            </div>
            {isMilestoneReached ? (
              <Badge
                variant="outline"
                className="text-green-700 border-green-300 dark:text-green-400 dark:border-green-600"
              >
                +{hoursAbove.toFixed(1)}h above goal
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-orange-700 border-orange-300 dark:text-orange-400 dark:border-orange-600"
              >
                {hoursRemaining.toFixed(1)}h remaining
              </Badge>
            )}
          </div>

          {/* Estimated Completion */}
          {estimatedTimeText && !isMilestoneReached && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                Estimated completion:{" "}
                <span className="font-medium">{estimatedTimeText}</span>
              </span>
            </div>
          )}

          {/* Milestone Reached Message */}
          {isMilestoneReached && (
            <div className="text-sm text-green-700 dark:text-green-400 font-medium">
              🎉 Congratulations! You've reached the {targetHours}-hour mastery
              milestone!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneHUD;
