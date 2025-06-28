import React from "react";
import { useSkillContext } from "@/context/SkillContext";
import { FullScreenSpinner, PageSpinner } from "@/components/ui/spinner";

const DataLoader = ({ children, fallback = "fullscreen" }) => {
  const { loadingStates, isDataLoaded } = useSkillContext();

  // Show loading spinner while any data is being fetched
  if (!isDataLoaded) {
    if (fallback === "fullscreen") {
      return <FullScreenSpinner text="Loading your data..." />;
    } else if (fallback === "page") {
      return <PageSpinner text="Loading page..." />;
    }
  }

  return children;
};

export default DataLoader;
