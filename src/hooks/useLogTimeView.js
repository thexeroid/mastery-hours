import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentDate } from "@/utils/dateUtils";
import {
  validateLogSession,
  validateLogSessionField,
} from "@/schemas/logSessionSchema";

export const useLogTimeView = ({ skills, onLogSession, defaultDuration }) => {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const selectedSkill = skills.find((s) => s.id === skillId);
  const skillDefaultDuration =
    selectedSkill?.settings?.defaultSessionDuration || defaultDuration;

  const [logForm, setLogForm] = useState({
    skillId: skillId || "",
    duration: String(skillDefaultDuration || ""),
    date: getCurrentDate(),
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  // Update form when skillId changes (e.g., when navigating from different skills)
  useEffect(() => {
    if (skillId) {
      const skill = skills.find((s) => s.id === skillId);
      const skillDefaultDuration =
        skill?.settings?.defaultSessionDuration || defaultDuration;
      setLogForm((prev) => ({
        ...prev,
        skillId,
        duration: String(skillDefaultDuration || ""),
      }));
    }
  }, [skillId, skills, defaultDuration]);

  const validateField = (field, value) => {
    const result = validateLogSessionField(field, value);
    if (!result.success) {
      setErrors((prev) => ({ ...prev, [field]: result.error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFieldChange = (field, value) => {
    setLogForm((prev) => ({ ...prev, [field]: value }));

    // Real-time validation for all fields
    validateField(field, value);
  };

  const handleFieldBlur = (field) => {
    // Just validate the field on blur for extra safety
    validateField(field, logForm[field]);
  };

  const handleSkillChange = (value) => {
    handleFieldChange("skillId", value);

    // Navigate to the skill-specific route when a skill is selected
    if (value) {
      navigate(`/log-time/${value}`);
    }
  };

  const showValidationAlert = (message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const validation = validateLogSession(logForm);

    if (!validation.success) {
      const newErrors = {};
      validation.error.errors.forEach((error) => {
        newErrors[error.path[0]] = error.message;
      });
      setErrors(newErrors);

      // Show validation alert
      showValidationAlert(
        "Please fix the validation errors before submitting."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await onLogSession(logForm);

      // Show success alert
      showValidationAlert("Session logged successfully!", "success");

      setLogForm({
        skillId: skillId || "",
        duration: "",
        date: getCurrentDate(),
        notes: "",
      });
      setErrors({});

      // Navigate after a short delay to show the success message
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      // Show error alert
      showValidationAlert(
        `Failed to log session: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    logForm.skillId &&
    logForm.duration &&
    logForm.date;

  const notesCharCount = logForm.notes.length;
  const maxNotesLength = 1000;

  return {
    // State
    logForm,
    errors,
    isSubmitting,
    alertMessage,
    alertType,
    selectedSkill,

    // Computed values
    isFormValid,
    notesCharCount,
    maxNotesLength,

    // Event handlers
    handleFieldChange,
    handleFieldBlur,
    handleSkillChange,
    handleSubmit,
    handleCancel,
    showValidationAlert,

    // Utility functions
    setAlertMessage,
  };
};
