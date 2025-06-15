/**
 * Date utility functions for consistent timezone handling
 */

/**
 * Convert a Date object to YYYY-MM-DD format
 * @param {Date} date - Date object to convert
 * @returns {string} Date in YYYY-MM-DD format
 */
export const dateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Get current date in user's local timezone as YYYY-MM-DD format
 * This ensures the date is always in the user's local timezone, not UTC
 */
export const getCurrentDate = () => {
  return dateToYYYYMMDD(new Date());
};

/**
 * Get current date in a specific timezone
 * @param {string} timezone - IANA timezone identifier (e.g., 'America/New_York')
 * @returns {string} Date in YYYY-MM-DD format
 */
export const getCurrentDateInTimezone = (timezone) => {
  try {
    const now = new Date();
    const options = {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const dateString = now.toLocaleDateString("en-CA", options); // en-CA gives YYYY-MM-DD format
    return dateString;
  } catch (error) {
    console.warn(
      `Invalid timezone: ${timezone}, falling back to local timezone`
    );
    return getCurrentDate();
  }
};

/**
 * Format a date string to a more readable format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, locale = "en-US") => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Get relative date string (e.g., "2 days ago", "today")
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Relative date string
 */
export const getRelativeDate = (dateString) => {
  try {
    const targetDate = new Date(dateString);
    const today = new Date();

    // Reset time to compare only dates
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today - targetDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays === -1) return "tomorrow";
    if (diffDays > 0) return `${diffDays} days ago`;
    if (diffDays < 0) return `in ${Math.abs(diffDays)} days`;

    return formatDate(dateString);
  } catch (error) {
    console.error("Error getting relative date:", error);
    return dateString;
  }
};

/**
 * Check if a date string is valid
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return (
      date instanceof Date &&
      !isNaN(date) &&
      dateString.match(/^\d{4}-\d{2}-\d{2}$/)
    );
  } catch (error) {
    return false;
  }
};

/**
 * Get user's timezone
 * @returns {string} IANA timezone identifier
 */
export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
