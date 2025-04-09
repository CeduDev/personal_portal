import { useQuery } from "@/hooks/user-query";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { use, useEffect } from "react";
import { SpotifyProviderContext } from "@/contexts/spotify-context";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>Spotify</div>
      {children}
    </div>
  );
}

function Spotify() {
  const query = useQuery();
  const navigate = useNavigate();
  const context = use(SpotifyProviderContext);
  const ERROR_STATE = "state_mismatch";
  const ERROR_TOKEN = "invalid_token";

  const spotifyLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/spotify/login`;
  };

  const spotifyLogout = () => {
    context.updateLogin("logout");
  };

  useEffect(() => {
    if (query.has("access_token") && query.has("refresh_token")) {
      localStorage.setItem(
        "spotify_access_token",
        query.get("access_token") as string
      );
      localStorage.setItem(
        "spotify_refresh_token",
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
    </Wrapper>
  );
}

export default Spotify;
