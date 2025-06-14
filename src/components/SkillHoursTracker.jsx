import React, { useState, useEffect } from "react";
import {
  Plus,
  Clock,
  Calendar,
  BarChart3,
  Edit2,
  Trash2,
  ArrowLeft,
} from "lucide-react";

const SkillHoursTracker = () => {
  const [skills, setSkills] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentView, setCurrentView] = useState("home");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [newSkillName, setNewSkillName] = useState("");
  const [logForm, setLogForm] = useState({
    skillId: "",
    duration: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Load data from memory on component mount
  useEffect(() => {
    // Initialize with sample data for demo
    const sampleSkills = [
      { id: "1", name: "Guitar", createdAt: "2024-05-01" },
      { id: "2", name: "Spanish", createdAt: "2024-05-15" },
    ];
    const sampleSessions = [
      {
        id: "1",
        skillId: "1",
        duration: 120,
        date: "2024-06-10",
        notes: "Practiced scales",
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
        notes: "New song practice",
      },
      {
        id: "5",
        skillId: "2",
        duration: 45,
        date: "2024-06-14",
        notes: "Grammar exercises",
      },
    ];
    setSkills(sampleSkills);
    setSessions(sampleSessions);
  }, []);

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill = {
      id: Date.now().toString(),
      name: newSkillName,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setSkills([...skills, newSkill]);
    setNewSkillName("");
  };

  const deleteSkill = (skillId) => {
    setSkills(skills.filter((s) => s.id !== skillId));
    setSessions(sessions.filter((s) => s.skillId !== skillId));
  };

  const logSession = () => {
    if (!logForm.skillId || !logForm.duration) return;
    const newSession = {
      id: Date.now().toString(),
      skillId: logForm.skillId,
      duration: parseInt(logForm.duration),
      date: logForm.date,
      notes: logForm.notes,
    };
    setSessions([...sessions, newSession]);
    setLogForm({
      skillId: "",
      duration: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setCurrentView("home");
  };

  const getSkillMetrics = (skillId) => {
    const skillSessions = sessions.filter((s) => s.skillId === skillId);
    if (skillSessions.length === 0) return null;

    const totalMinutes = skillSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const totalSessions = skillSessions.length;
    const dates = skillSessions.map((s) => new Date(s.date)).sort();
    const startDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const daysPracticed = new Set(skillSessions.map((s) => s.date)).size;
    const avgMinutesPerSession = Math.round(totalMinutes / totalSessions);

    return {
      totalHours,
      totalSessions,
      startDate: startDate.toLocaleDateString(),
      lastDate: lastDate.toLocaleDateString(),
      daysPracticed,
      avgMinutesPerSession,
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
        displayDate: new Date(date).toLocaleDateString(),
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const renderHome = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Skill Hours Tracker
        </h1>
        <button
          onClick={() => setCurrentView("addSkill")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Skill
        </button>
      </div>

      <div className="grid gap-4">
        {skills.map((skill) => {
          const metrics = getSkillMetrics(skill.id);
          return (
            <div
              key={skill.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {skill.name}
                  </h3>
                  <div className="text-gray-600">
                    {metrics ? (
                      <div className="flex gap-6 text-sm">
                        <span className="font-medium">
                          {metrics.totalHours}h total
                        </span>
                        <span>{metrics.totalSessions} sessions</span>
                        <span>{metrics.daysPracticed} days practiced</span>
                        <span>Last: {metrics.lastDate}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        No sessions logged yet
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setLogForm({ ...logForm, skillId: skill.id });
                      setCurrentView("logTime");
                    }}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Clock size={16} />
                    Log Time
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSkill(skill);
                      setCurrentView("skillProgress");
                    }}
                    className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <BarChart3 size={16} />
                    View Progress
                  </button>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BarChart3 size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No skills tracked yet
          </h3>
          <p className="text-gray-600 mb-4">
            Add your first skill to start tracking your deliberate practice
            hours.
          </p>
          <button
            onClick={() => setCurrentView("addSkill")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Skill
          </button>
        </div>
      )}
    </div>
  );

  const renderAddSkill = () => (
    <div className="max-w-md mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentView("home")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Add New Skill</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skill Name
          </label>
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="e.g., Guitar, Spanish, Programming..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={addSkill}
            disabled={!newSkillName.trim()}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
          >
            Add Skill
          </button>
          <button
            onClick={() => setCurrentView("home")}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderLogTime = () => (
    <div className="max-w-md mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentView("home")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          Log Practice Session
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skill
          </label>
          <select
            value={logForm.skillId}
            onChange={(e) =>
              setLogForm({ ...logForm, skillId: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a skill...</option>
            {skills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={logForm.duration}
            onChange={(e) =>
              setLogForm({ ...logForm, duration: e.target.value })
            }
            placeholder="e.g., 60"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={logForm.date}
            onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            value={logForm.notes}
            onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
            placeholder="What did you work on?"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={logSession}
            disabled={!logForm.skillId || !logForm.duration}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors"
          >
            Log Session
          </button>
          <button
            onClick={() => setCurrentView("home")}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderSkillProgress = () => {
    if (!selectedSkill) return null;

    const metrics = getSkillMetrics(selectedSkill.id);
    const dailyHours = getDailyHours(selectedSkill.id);
    const skillSessions = sessions.filter(
      (s) => s.skillId === selectedSkill.id
    );

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setCurrentView("home")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedSkill.name} Progress
          </h2>
        </div>

        {metrics && (
          <>
            {/* Metrics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.totalHours}h
                </div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {metrics.totalSessions}
                </div>
                <div className="text-sm text-gray-600">Sessions</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {metrics.daysPracticed}
                </div>
                <div className="text-sm text-gray-600">Days Practiced</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {metrics.avgMinutesPerSession}m
                </div>
                <div className="text-sm text-gray-600">Avg/Session</div>
              </div>
            </div>

            {/* Daily Hours Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Daily Practice Hours
              </h3>
              <div className="space-y-2">
                {dailyHours.slice(0, 14).map((day) => (
                  <div key={day.date} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-gray-600">
                      {day.displayDate}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                      <div
                        className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.min(
                            (parseFloat(day.hours) / 4) * 100,
                            100
                          )}%`,
                        }}
                      >
                        <span className="text-white text-xs font-medium">
                          {day.hours}h
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Session History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Sessions
              </h3>
              <div className="space-y-3">
                {skillSessions
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 10)
                  .map((session) => (
                    <div
                      key={session.id}
                      className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(session.date).toLocaleDateString()} •{" "}
                          {Math.round(session.duration)}m
                        </div>
                        {session.notes && (
                          <div className="text-sm text-gray-600 mt-1">
                            {session.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "home" && renderHome()}
      {currentView === "addSkill" && renderAddSkill()}
      {currentView === "logTime" && renderLogTime()}
      {currentView === "skillProgress" && renderSkillProgress()}
    </div>
  );
};

export default SkillHoursTracker;
