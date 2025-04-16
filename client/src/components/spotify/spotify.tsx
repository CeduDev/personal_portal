import { useQuery } from "@/hooks/user-query";
import { Button } from "../ui/button";
import { LoadingButton } from "../ui/loading-button";
import { useNavigate } from "react-router";
import { use, useEffect } from "react";
import { SpotifyProviderContext } from "@/contexts/spotify-context";
import {
  ERROR_STATE,
  ERROR_TOKEN,
  SPOTIFY_ACCESS_TOKEN_SK,
  SPOTIFY_REFRESH_TOKEN_SK,
} from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { cn } from "@/lib/generalUtils";
import { GlobalProviderContext } from "@/contexts/global-context";
import UserProfile from "./spotifyUserProfile";
import TopArtists from "./spotifyTopArtists";

const SingleItemWrapper = ({
  title,
  login,
}: {
  title: string;
  login: () => void;
}) => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="@container/card">
            <CardHeader>
              <CardTitle className="text-2xl text-center">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={login}>Spotify Login</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const HeaderComponent = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick: () => void;
}) => {
  return (
    <div className="flex w-full items-right justify-end p-1">
      <LoadingButton onClick={onClick}>{buttonText}</LoadingButton>
    </div>
  );
};

const Spotify = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const spotifyContext = use(SpotifyProviderContext);
  const siteHeaderContext = use(GlobalProviderContext).siteHeader;

  // Utils
  const spotifyLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/spotify/login`;
  };

  const spotifyLogout = () => {
    spotifyContext.updateLogin("logout");
  };

  // OnMount
  useEffect(() => {
    siteHeaderContext.updateTitle("Spotify");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effects
  useEffect(() => {
    if (spotifyContext.isLoggedIn) {
      siteHeaderContext.updateComponentsToRender(
        <HeaderComponent
          buttonText={"Spotify Logout"}
          onClick={spotifyLogout}
        />
      );
    } else {
      siteHeaderContext.updateComponentsToRender(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotifyContext.isLoggedIn]);

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
      spotifyContext.updateLogin("login");
      void navigate("/spotify");
    }
  }, [spotifyContext, navigate, query]);

  // HTML returns
  if (query.has("error")) {
    let title = "Unexpected error, check URL query for error";

    if (query.get("error") === ERROR_STATE) {
      title = "Error with state, try again...";
    }

    if (query.get("error") === ERROR_TOKEN) {
      title = "Error with token, try again...";
    }

    return <SingleItemWrapper title={title} login={spotifyLogin} />;
  }

  if (!spotifyContext.isLoggedIn) {
    return (
      <SingleItemWrapper
        title="Please login using your Spotify account"
        login={spotifyLogin}
      />
    );
  }

  return (
    <div>
      <UserProfile />
      <TopArtists />
    </div>
  );
};

export default Spotify;
