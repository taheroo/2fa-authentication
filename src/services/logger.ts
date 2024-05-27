import pino from "pino";

// Redact sensitive fields
const redact = ["password"]
  .map((field) => [`*.${field}`, `*[*].${field}`, field])
  .reduce((acc, paths) => [...acc, ...paths], []);

const logger = pino({
  hooks: {
    logMethod(inputArgs, method, level) {
      if (inputArgs.length >= 2) {
        const arg1 = inputArgs.shift();
        const arg2 = inputArgs.shift();
        return method.apply(this, [arg2, arg1, ...inputArgs]);
      }
      return method.apply(this, inputArgs);
    },
  },
  redact: {
    paths: redact,
    censor: "**GDPR COMPLIANT**",
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
      translateTime: "SYS:standard",
    },
  },
});

export default logger;
