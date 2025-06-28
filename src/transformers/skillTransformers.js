function transformSkillToClient(skill) {
  const {
    id,
    user_id: userId,
    name,
    default_session_duration: defaultSessionDuration,
    target_hours: targetHours,
    created_at: createdAt,
    updated_at: updatedAt,
  } = skill;
  return {
    id,
    userId,
    name,
    settings: {
      defaultSessionDuration,
      targetHours,
    },
    createdAt,
    updatedAt,
  };
}

function transformSkillsToClient(skills) {
  return skills.map(transformSkillToClient);
}

function transformSkillToServer(skill) {
  const {
    id,
    userId: user_id,
    name,
    defaultSessionDuration: default_session_duration,
    targetHours: target_hours,
    createdAt: created_at,
    updatedAt: updated_at,
  } = skill;

  return {
    id,
    user_id,
    name,
    default_session_duration,
    target_hours,
    created_at,
    updated_at,
  };
}

function transformSkillsToServer(skills) {
  return skills.map(transformSkillToServer);
}

export {
  transformSkillToClient,
  transformSkillsToClient,
  transformSkillToServer,
  transformSkillsToServer,
};
