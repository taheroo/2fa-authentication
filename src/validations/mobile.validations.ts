import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";

export const mobileSchema = z.string().transform((arg, ctx) => {
  const phone = parsePhoneNumberFromString(arg, {
    // Set this to use a default country when the phone number omits country code
    defaultCountry: "DE",

    // Set to false to require that the whole string is exactly a phone number,
    // otherwise, it will search for a phone number anywhere within the string
    extract: false,
  });

  // When it's good
  if (phone && phone.isValid()) {
    return phone.number;
  }

  // When it's not
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Invalid phone number",
  });
  return z.NEVER;
});
