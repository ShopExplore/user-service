const platformConstants = {
  role: ["user", "admin", "supplier"] as const,
  weekDays: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const,
  otpPurpose: ["verify-acct", "reset-password"] as const,
  paginationConfig: {
    perPage: 20,
    allowedPerPageValues: [20, 30, 50, 100] as const,
  },
  userInviteStatus: ["pending", "accepted"] as const,
  requestStatus: ["granted", "declined", "pending"] as const,
};

export default platformConstants;
