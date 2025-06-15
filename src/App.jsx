import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SkillProvider } from "./context/SkillContext";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import AddSkillPage from "./pages/AddSkillPage";
import LogTimePage from "./pages/LogTimePage";
import SkillProgressPage from "./pages/SkillProgressPage";
import SettingsPage from "./pages/SettingsPage";
import { Provider as JotaiProvider } from "jotai";

function App() {
  return (
    <JotaiProvider>
      <SkillProvider>
        <ThemeProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add-skill" element={<AddSkillPage />} />
                <Route path="/log-time" element={<LogTimePage />} />
                <Route path="/log-time/:skillId" element={<LogTimePage />} />
                <Route
                  path="/progress/:skillId"
                  element={<SkillProgressPage />}
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </SkillProvider>
    </JotaiProvider>
  );
}

export default App;
