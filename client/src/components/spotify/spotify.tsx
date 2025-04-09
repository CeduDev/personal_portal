import { useQuery } from "@/hooks/user-query";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { use, useEffect } from "react";
import { SpotifyProviderContext } from "@/contexts/spotify-context";
import {
  SPOTIFY_ACCESS_TOKEN_SK,
  SPOTIFY_REFRESH_TOKEN_SK,
} from "@/lib/constants";
import { z } from "zod";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>Spotify</div>
      {children}
    </div>
  );
}

const refreshTokenType = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
});

function Spotify() {
  const query = useQuery();
  const navigate = useNavigate();
  const context = use(SpotifyProviderContext);
  const ERROR_STATE = "state_mismatch";
  const ERROR_TOKEN = "invalid_token";

  const spotifyLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/spotify/login`;
  };

  const spotifyLogout = () => {
    context.updateLogin("logout");
  };

  const refreshTokens = async () => {
    const existingToken = localStorage.getItem(SPOTIFY_REFRESH_TOKEN_SK);
    const response = await fetch(
      `/api/spotify/refresh_token?refresh_token=${existingToken}`
    );
    const res = refreshTokenType.parse(await response.json());

    localStorage.setItem(SPOTIFY_ACCESS_TOKEN_SK, res.access_token);
    if (res.refresh_token)
      localStorage.setItem(SPOTIFY_REFRESH_TOKEN_SK, res.refresh_token);
  };

  useEffect(() => {
    if (query.has("access_token") && query.has("refresh_token")) {
      localStorage.setItem(
        SPOTIFY_ACCESS_TOKEN_SK,
        query.get("access_token") as string
      );
      localStorage.setItem(
        SPOTIFY_REFRESH_TOKEN_SK,
        query.get("refresh_token") as string
      );

      query.delete("access_token");
      query.delete("refresh_token");
      context.updateLogin("login");
      void navigate("/spotify");
    }
  }, [context, navigate, query]);

  if (query.get("error") === ERROR_STATE) {
    return (
      <Wrapper>
        <div>Error with state</div>
      </Wrapper>
    );
  }

  if (query.get("error") === ERROR_TOKEN) {
    return (
      <Wrapper>
        <div>Error with token</div>
      </Wrapper>
    );
  }

  if (!context.isLoggedIn) {
    return (
      <Wrapper>
        <Button onClick={spotifyLogin}>Spotify Login</Button>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div>You are logged in!</div>
      <Button onClick={spotifyLogout}>Spotify Logout</Button>
      <Button onClick={() => void refreshTokens()}>Refresh token</Button>
    </Wrapper>
  );
}

export default Spotify;
