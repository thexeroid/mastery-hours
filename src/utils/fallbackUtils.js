// Centralized fallback values for the entire application
const fallbacks = {
  // Settings defaults
  theme: "system",
  defaultSessionDuration: 60,
  targetHours: 1000,

  // Validation and form defaults
  minSessionDuration: 5,
  maxSessionDuration: 1440,
  sessionDurationStep: 5,

  // UI defaults
  defaultAlertDuration: 1500,

  // Date defaults
  defaultDateFormat: "yyyy-MM-dd",
};

/**
 * Main function to apply fallback to any value
 * @param {any} value - The value to check
 * @param {string} fallbackKey - The key to use for fallback
 * @returns {any} The value if it exists, otherwise the fallback value
 */
export function withFallback(value, fallbackKey) {
  return value ?? fallbacks[fallbackKey];
}

/**
 * Get a fallback value by key
 * @param {string} key - The fallback key
 * @returns {any} The fallback value
 */
export function getFallback(key) {
  return fallbacks[key];
}

/**
 * Get a fallback value with a custom default if not found
 * @param {string} key - The fallback key
 * @param {any} defaultValue - Custom default if key not found
 * @returns {any} The fallback value or custom default
 */
export function getFallbackWithDefault(key, defaultValue) {
  return fallbacks[key] ?? defaultValue;
}

/**
 * Add a fallback value (useful for runtime configuration)
 * @param {string} key - The fallback key
 * @param {any} value - The fallback value
 */
export function addFallback(key, value) {
  fallbacks[key] = value;
}

/**
 * Get multiple fallback values at once
 * @param {string[]} keys - Array of fallback keys
 * @returns {object} Object with key-value pairs
 */
export function getFallbacks(keys) {
  const result = {};
  keys.forEach((key) => {
    result[key] = fallbacks[key];
  });
  return result;
}

/**
 * Get all fallbacks
 * @returns {object} All fallback values
 */
export function getAllFallbacks() {
  return { ...fallbacks };
}

// Convenience exports for commonly used fallbacks
export const FALLBACK_THEME = fallbacks.theme;
export const FALLBACK_DEFAULT_SESSION_DURATION =
  fallbacks.defaultSessionDuration;
export const DEFAULT_TARGET_HOURS = fallbacks.targetHours;
export const MIN_SESSION_DURATION = fallbacks.minSessionDuration;
export const MAX_SESSION_DURATION = fallbacks.maxSessionDuration;
export const SESSION_DURATION_STEP = fallbacks.sessionDurationStep;
export const DEFAULT_ALERT_DURATION = fallbacks.defaultAlertDuration;
