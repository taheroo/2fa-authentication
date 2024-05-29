import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { SWAGGER_URL } from "./constants";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SecureAuthAPI",
      version: "1.0.0",
      description: "A simple Express API for user authentication with 2FA",
    },
    servers: [
      {
        url: SWAGGER_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/models/*.ts"],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
