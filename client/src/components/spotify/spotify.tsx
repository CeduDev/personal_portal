import { useQuery } from "@/hooks/user-query";
import { Button } from "../ui/button";
import { LoadingButton } from "../ui/loading-button";
import { useNavigate } from "react-router";
import { use, useEffect, useState } from "react";
import { SpotifyProviderContext } from "@/contexts/spotify-context";
import {
  SPOTIFY_ACCESS_TOKEN_SK,
  SPOTIFY_REFRESH_TOKEN_SK,
} from "@/lib/constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { cn } from "@/lib/generalUtils";
import { GlobalProviderContext } from "@/contexts/global-context";
import {
  // Artist,
  TopArtistsType,
  UserProfileType,
} from "@/lib/types/spotify-types";
import { fetchProfile, fetchTopArtists } from "@/lib/spotifyUtils";
import { Link } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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

// const ArtistCard = ({
//   artist,
//   ranking,
// }: {
//   artist: Artist;
//   ranking: number;
// }) => {
//   return (
//     <Card key={artist.id} className="@container/card">
//       <CardHeader className="relative justify-items-center">
//         <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//           <div className="flex items-center gap-0">
//             {ranking}. {artist.name}
//             <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
//               <a href={artist.external_urls.spotify} target="_blank">
//                 <Link className="size-3" />
//               </a>
//             </Badge>
//           </div>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <img src={artist.images.at(-1)?.url} />
//       </CardContent>
//     </Card>
//   );
// };

const Spotify = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const spotifyContext = use(SpotifyProviderContext);
  const siteHeaderContext = use(GlobalProviderContext).siteHeader;
  const ERROR_STATE = "state_mismatch";
  const ERROR_TOKEN = "invalid_token";

  // const [refreshTokenLoading, setRefreshTokenLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [topArtists, setTopArtists] = useState<TopArtistsType | null>(null);

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
      fetchProfile()
        .then((res) => {
          if (res) setUserProfile(res);
        })
        .catch((e) => console.log(e));

      fetchTopArtists()
        .then((res) => {
          if (res) setTopArtists(res);
        })
        .catch((e) => console.log(e));

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
    // <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    //   <div className="w-full max-w-sm">
    //     <LoadingButton
    //       loading={fetchProfileLoading}
    //       onClick={() => void fetchProfile()}
    //     >
    //       Fetch Profile
    //     </LoadingButton>
    //   </div>
    // </div>
    <div>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 mb-4">
        <Card className="@container/card">
          <CardHeader className="relative justify-items-center">
            <CardDescription>User</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <div className="flex items-center gap-0">
                {userProfile?.display_name}
                <Badge
                  variant="outline"
                  className="flex gap-1 rounded-lg text-xs"
                >
                  <a href={userProfile?.external_urls.spotify} target="_blank">
                    <Link className="size-3" />
                  </a>
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 mb-4">
        <Card className="@container/card">
          <CardHeader className="relative justify-items-center">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              Top Artists
            </CardTitle>
          </CardHeader>
          <CardContent className="mx-10">
            <Carousel className="w-full">
              <CarouselContent>
                {topArtists?.items.map((artist, index) => (
                  <CarouselItem className="basis-1/5" key={artist.id}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <Dialog>
                            <DialogTrigger>
                              {/* <Button variant="outline">Open popover</Button> */}
                              <span className="font-semibold">
                                <h5>{artist.name}</h5>
                                <img src={artist.images.at(-1)?.url} />
                              </span>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>{artist.name}</DialogTitle>
                                <DialogDescription>
                                  Your nr. {index + 1} artist
                                  <img src={artist.images[0].url} />
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <p>Global follower: {artist.followers.total}</p>
                                <p>Global popularity: {artist.popularity}</p>
                                <p>Your top songs from this artist:</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>
      {/* <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {topArtists && <ArtistCard artist={topArtists.items[0]} ranking={1} />}
      </div> */}
    </div>
  );
};

export default Spotify;
