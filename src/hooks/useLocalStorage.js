const useLocalStorage = () => {
  const getItem = (key, defaultValue = null) => {
    try {
      if (!key || typeof key !== "string") {
        console.warn("useLocalStorage: Invalid key provided");
        return defaultValue;
      }

      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      return JSON.parse(item);
    } catch (error) {
      console.error("useLocalStorage: Error reading from localStorage:", error);
      return defaultValue;
    }
  };

  const setItem = (key, value) => {
    try {
      if (!key || typeof key !== "string") {
        console.warn("useLocalStorage: Invalid key provided");
        return false;
      }

      if (value === undefined) {
        console.warn("useLocalStorage: Cannot store undefined value");
        return false;
      }

      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("useLocalStorage: Error writing to localStorage:", error);
      return false;
    }
  };

  const removeItem = (key) => {
    try {
      if (!key || typeof key !== "string") {
        console.warn("useLocalStorage: Invalid key provided");
        return false;
      }

      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(
        "useLocalStorage: Error removing from localStorage:",
        error
      );
      return false;
    }
  };

  const clear = () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("useLocalStorage: Error clearing localStorage:", error);
      return false;
    }
  };

  const hasItem = (key) => {
    try {
      if (!key || typeof key !== "string") {
        return false;
      }
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error("useLocalStorage: Error checking localStorage:", error);
      return false;
    }
  };

  return { getItem, setItem, removeItem, clear, hasItem };
};

export default useLocalStorage;
