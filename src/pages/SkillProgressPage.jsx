import React from "react";
import { useSkillContext } from "../context/SkillContext";
import SkillProgressView from "../components/SkillProgressView";

const SkillProgressPage = () => {
  const { skills, sessions, getSkillMetrics, getDailyHours, loadingStates } =
    useSkillContext();

  return (
    <SkillProgressView
      skills={skills}
      sessions={sessions}
      getSkillMetrics={getSkillMetrics}
      getDailyHours={getDailyHours}
      loadingStates={loadingStates}
    />
  );
};

export default SkillProgressPage;
