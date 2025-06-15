import React from "react";
import { useSkillContext } from "../context/SkillContext";
import LogTimeView from "../components/LogTimeView";

const LogTimePage = () => {
  const { skills, logSession, settings } = useSkillContext();

  return (
    <LogTimeView
      skills={skills}
      onLogSession={logSession}
      defaultDuration={settings.defaultSessionDuration}
    />
  );
};

export default LogTimePage;
