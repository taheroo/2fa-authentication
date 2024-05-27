import twilio from "twilio";
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER,
} from "../constants";

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const sendOtp = (mobile: string, otp: string) => {
  return client.messages.create({
    body: `Your verification code is ${otp}`,
    from: TWILIO_FROM_NUMBER,
    to: mobile,
  });
};
