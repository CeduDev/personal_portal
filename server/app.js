import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import { getCookie, setCookie, deleteCookie } from "@hono/hono/cookie";
import { randomBytes } from "node:crypto";
import querystring from "node:querystring";
import { Buffer } from "node:buffer";

const app = new Hono();
const BASE_URL = Deno.env.get("BASE_URL");
const BASE_URL_DOMAIN = Deno.env.get("BASE_URL_DOMAIN");
const ENV = Deno.env.get("ENV");
const FRONTEND_URL = Deno.env.get("FRONTEND_URL");
const SPOTIFY_CLIENT_ID = Deno.env.get("SPOTIFY_CLIENT_ID");
const SPOTIFY_SECRET = Deno.env.get("SPOTIFY_SECRET");
const SPOTIFY_STATE_KEY = Deno.env.get("SPOTIFY_STATE_KEY");

app.use("/*", cors());
app.use("/*", logger());

app.get("/", (c) => {
  return c.json({ message: "Hello world!" });
});

const generateRandomString = (length) => {
  return randomBytes(60).toString("hex").slice(0, length);
};

// Spotify routes
app.get("/spotify/login", async function (c) {
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email";

  setCookie(c, SPOTIFY_STATE_KEY, state, {
    domain: BASE_URL_DOMAIN,
    path: "/",
    sameSite: "lax",
    secure: ENV !== "dev", // Set to true in production with HTTPS
  });

  return c.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: `${BASE_URL}/spotify/callback`,
        state: state,
      })
  );
});

app.get("/spotify/callback", async function (c) {
  const code = c.req.query("code") || null;
  const state = c.req.query("state") || null;
  const storedState = getCookie(c, SPOTIFY_STATE_KEY) || null;
  deleteCookie(c, SPOTIFY_STATE_KEY);

  if (state === null || state !== storedState) {
    return c.redirect(
      `${FRONTEND_URL}/spotify?` +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    // Fetch the tokens from Spotify
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            new Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_SECRET).toString(
              "base64"
            ),
        },
        body: querystring.stringify({
          code: code,
          redirect_uri: `${BASE_URL}/spotify/callback`,
          grant_type: "authorization_code",
        }),
      }
    );

    if (tokenResponse.ok) {
      const tokenJson = await tokenResponse.json();
      const access_token = tokenJson.access_token;
      const refresh_token = tokenJson.refresh_token;

      return c.redirect(
        `${FRONTEND_URL}/spotify?` +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
          })
      );
    } else {
      return c.redirect(
        `${FRONTEND_URL}/spotify?` +
          querystring.stringify({
            error: "invalid_token",
          })
      );
    }
  }
});

app.get("/spotify/refresh_token", async (c) => {
  const refresh_token = c.req.query("refresh_token");

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_SECRET).toString(
          "base64"
        ),
    },
    body: querystring.stringify({
      refresh_token: refresh_token,
      grant_type: "refresh_token",
    }),
  });
  const tokenJson = await tokenResponse.json();

  if (tokenResponse.ok) {
    return c.json({
      access_token: tokenJson.access_token,
      // Optionally include refresh_token if returned/rotated by Spotify
      refresh_token: tokenJson.refresh_token,
    });
  } else {
    return c.json({ error: "invalid_token" });
  }
});

export default app;
