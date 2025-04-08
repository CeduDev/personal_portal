import { useQuery } from "@/hooks/user-query";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { useEffect } from "react";

function Spotify() {
  const query = useQuery();
  const navigate = useNavigate();
  const ERROR_STATE = "state_mismatch";
  const ERROR_TOKEN = "invalid_token";

  const spotifyLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/spotify/login`;
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
      void navigate("/spotify");
    }
  }, [navigate, query]);

  if (query.get("error") === ERROR_STATE) {
    return (
      <div>
        <div>Spotify</div>
        <div>Error with state</div>
      </div>
    );
  }

  if (query.get("error") === ERROR_TOKEN) {
    return (
      <div>
        <div>Spotify</div>
        <div>Error with token</div>
      </div>
    );
  }

  return (
    <div>
      <div>Spotify</div>
      <Button onClick={spotifyLogin}>Spotify Login</Button>
    </div>
  );
}

export default Spotify;
