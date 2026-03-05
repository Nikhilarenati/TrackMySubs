import dayjs from "dayjs";

export const DEADLINE_URGENT_DAYS = 2;
export const DEADLINE_WARNING_DAYS = 7;
export const TRIAL_CANCEL_WARNING_DAYS = 3;

export const daysUntil = (date) => {
  if (!date) return 0;

  const diff = dayjs(date).diff(dayjs(), "day", true);
  if (Number.isNaN(diff)) return 0;

  return Math.max(0, Math.ceil(diff));
};

export const formatPretty = (date) => {
  if (!date) return "-";

  const parsed = dayjs(date);
  if (!parsed.isValid()) return "-";

  return parsed.format("MMM D, YYYY");
};

export const getTrialStatus = (trialEndsAt) => {
  const daysLeft = daysUntil(trialEndsAt);
  const isUrgent = daysLeft < TRIAL_CANCEL_WARNING_DAYS;

  return {
    daysLeft,
    isUrgent,
  };
};

export const isDeadlineUrgent = (date) => {
  return daysUntil(date) <= DEADLINE_URGENT_DAYS;
};

export const getDeadlineLevel = (date) => {
  const daysLeft = daysUntil(date);

  if (daysLeft <= DEADLINE_URGENT_DAYS) return "urgent";
  if (daysLeft <= DEADLINE_WARNING_DAYS) return "warning";
  return "safe";
};
