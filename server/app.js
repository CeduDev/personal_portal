import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import spotify_routes from "./routes/spotify.js";

const app = new Hono();

app.use("/*", cors());
app.use("/*", logger());

// Routes
app.get("/", (c) => {
  return c.json({ message: "Hello world!" });
});

app.route("/", spotify_routes);

export default app;
