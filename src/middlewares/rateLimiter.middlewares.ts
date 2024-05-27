import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Rate limiter for request-otp
export const requestOtpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1,
  message: "Too many requests, please try again after a minute",
});
