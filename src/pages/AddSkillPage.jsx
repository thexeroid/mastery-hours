import React from "react";
import { useSkillContext } from "../context/SkillContext";
import AddSkillView from "../components/AddSkillView";

const AddSkillPage = () => {
  const { addSkill } = useSkillContext();

  return <AddSkillView onAddSkill={addSkill} />;
};

export default AddSkillPage;
