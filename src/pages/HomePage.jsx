import React from "react";
import { useNavigate } from "react-router-dom";
import { useSkillContext } from "../context/SkillContext";
import HomeView from "../components/HomeView";

const HomePage = () => {
  const navigate = useNavigate();
  const { skills, sessions, deleteSkill, getSkillMetrics, loadingStates } =
    useSkillContext();

  const handleLogTime = (skillId) => {
    navigate(`/log-time/${skillId}`);
  };

  const handleViewProgress = (skill) => {
    navigate(`/progress/${skill.id}`);
  };

  return (
    <HomeView
      skills={skills}
      sessions={sessions}
      onDeleteSkill={deleteSkill}
      onLogTime={handleLogTime}
      onViewProgress={handleViewProgress}
      getSkillMetrics={getSkillMetrics}
      loadingStates={loadingStates}
    />
  );
};

export default HomePage;
