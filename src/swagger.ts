import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { PORT } from "./constants";

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
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
      {
        url: "https://api.scanmeet.com",
        description: "Production server",
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
