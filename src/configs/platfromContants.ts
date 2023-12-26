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
  productCategories: [
    "electronics",
    "clothing",
    "Furniture",
    "beauty and personal care",
    "books",
    "foods and Beverages",
    "jewelry",
    "automotive",
  ] as const,
  paginationConfig: {
    perPage: 20,
    allowedPerPageValues: [20, 30, 50, 100] as const,
  },
  userInviteStatus: ["pending", "accepted"] as const,
  paymentDriver: ["paystack", "flutterwave", "stripe"] as const,
  paymentStatus: ["pending", "successful", "failed"] as const,
  paymentCurrency: ["NGN", "USD"] as const,
  orderStatus: ["pending", "in-process", "shipping", "delivered"] as const,
};

export default platformConstants;
