import { app } from "./app";
import { PORT } from "./constants";
import logger from "./services/logger";

app.listen(PORT, () => {
  logger.info(`[server]: Server is running at http://localhost:${PORT}`);
});
