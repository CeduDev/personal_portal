import { use, useEffect, useState } from "react";
import { cn } from "@/lib/generalUtils";
import {
  artistSortByRanking,
  artistFilter,
  fetchAllTopArtists,
} from "@/lib/spotifyUtils";
import {
  TopArtistsSortByValues,
  TopArtistsSelected,
  TopArtistsType,
} from "@/lib/types/spotify-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import { Spinner } from "../ui/spinner";
import { SpotifyProviderContext } from "@/contexts/spotify-context";

const TopArtists = () => {
  const [artistSortByValue, setArtistSortByValue] =
    useState<TopArtistsSortByValues>(TopArtistsSortByValues.MY_RANK);
  const [selectedArtistsSpan, setSelectedArtistsSpan] =
    useState<TopArtistsSelected>(TopArtistsSelected.LAST_4_WEEKS);
  const [topArtists, setTopArtists] = useState<TopArtistsType | null>(null);
  const [allTopArtists, setAllTopArtists] = useState<TopArtistsType[] | null>(
    null
  );
  const [topArtistsLoading, setTopArtistsLoading] = useState(false);

  const spotifyContext = use(SpotifyProviderContext);

  useEffect(() => {
    if (spotifyContext.isLoggedIn) {
      if (!allTopArtists) {
        setTopArtistsLoading(true);
        fetchAllTopArtists()
          .then((res) => {
            setAllTopArtists(res);
            setTopArtists(res[0]);
          })
          .catch((e) => console.log(e))
          .finally(() => setTopArtistsLoading(false));
      }
    }
  }, [allTopArtists, spotifyContext.isLoggedIn]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 mb-4">
      <Card className="@container/card">
        <CardHeader className="grid grid-cols-3 items-center relative">
          <div></div>
          <div className="text-center">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              Top Artists
            </CardTitle>
          </div>
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Sort by</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup
                  value={artistSortByValue}
                  onValueChange={(value) =>
                    artistSortByRanking(
                      topArtists,
                      allTopArtists,
                      setTopArtists,
                      setAllTopArtists,
                      value as TopArtistsSortByValues,
                      setArtistSortByValue
                    )
                  }
                >
                  <DropdownMenuRadioItem value={TopArtistsSortByValues.MY_RANK}>
                    My Rank
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value={TopArtistsSortByValues.GLOBAL_RANK}
                  >
                    Global Rank
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value={TopArtistsSortByValues.FOLLOWERS}
                  >
                    Followers
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Filter</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup
                  value={selectedArtistsSpan}
                  onValueChange={(value) =>
                    artistFilter(
                      allTopArtists,
                      setTopArtists,
                      value as TopArtistsSelected,
                      setSelectedArtistsSpan
                    )
                  }
                >
                  <DropdownMenuRadioItem
                    value={TopArtistsSelected.LAST_4_WEEKS}
                  >
                    Last 4 weeks
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value={TopArtistsSelected.LAST_6_MONTHS}
                  >
                    Last 6 months
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={TopArtistsSelected.LAST_YEAR}>
                    Last 12 months
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="mx-10">
          {topArtistsLoading ? (
            <Spinner />
          ) : (
            <Carousel className="w-full">
              <CarouselContent>
                {topArtists?.items.map((artist) => (
                  <CarouselItem className="basis-1/5" key={artist.id}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <Dialog>
                            <DialogTrigger>
                              <span className="font-semibold">
                                <h5>
                                  Rank {artist.my_rank}: {artist.name}
                                </h5>
                                <img
                                  src={artist.images.at(-1)?.url}
                                  className={cn(`h-full w-full`)}
                                />
                              </span>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>{artist.name}</DialogTitle>
                                <DialogDescription>
                                  Your nr. {artist.my_rank} artist
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TopArtists;
