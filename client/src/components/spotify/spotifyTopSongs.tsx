import { use, useEffect, useState } from "react";
import { cn } from "@/lib/generalUtils";
import {
  songSortByRanking,
  songFilter,
  fetchAllTopSongs,
} from "@/lib/spotifyUtils";
import {
  TopSongsSortByValues,
  TopSongsSelected,
  TopSongsType,
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

const TopSongs = () => {
  const spotifyContext = use(SpotifyProviderContext);
  // const [songSortByValue, setSongSortByValue] =
  //   useState<TopSongsSortByValues>(TopSongsSortByValues.MY_RANK);
  // const [selectedSongsSpan, setSelectedSongsSpan] =
  //   useState<TopSongsSelected>(TopSongsSelected.LAST_4_WEEKS);
  // const [topSongs, setTopSongs] = useState<TopSongsType | null>(null);
  // const [allTopSongs, setAllTopSongs] = useState<TopSongsType[] | null>(
  //   null
  // );
  // const [topSongsLoading, setTopSongsLoading] = useState(false);

  // useEffect(() => {
  //   if (spotifyContext.isLoggedIn) {
  //     if (!allTopSongs) {
  //       setTopSongsLoading(true);
  //       fetchAllTopSongs()
  //         .then((res) => {
  //           setAllTopSongs(res);
  //           setTopSongs(res[0]);
  //         })
  //         .catch((e) => console.log(e))
  //         .finally(() => setTopSongsLoading(false));
  //     }
  //   }
  // }, [allTopSongs, spotifyContext.isLoggedIn]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 mb-4">
      {/* <Card className="@container/card">
        <CardHeader className="grid grid-cols-3 items-center relative">
          <div></div>
          <div className="text-center">
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              Top Songs
            </CardTitle>
          </div>
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Sort by</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup
                  value={songSortByValue}
                  onValueChange={(value) =>
                    songSortByRanking(
                      topSongs,
                      allTopSongs,
                      setTopSongs,
                      setAllTopSongs,
                      value as TopSongsSortByValues,
                      setSongSortByValue
                    )
                  }
                >
                  <DropdownMenuRadioItem value={TopSongsSortByValues.MY_RANK}>
                    My Rank
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value={TopSongsSortByValues.GLOBAL_RANK}
                  >
                    Global Rank
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value={TopSongsSortByValues.FOLLOWERS}
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
                  value={selectedSongsSpan}
                  onValueChange={(value) =>
                    songFilter(
                      allTopSongs,
                      setTopSongs,
                      value as TopSongsSelected,
                      setSelectedSongsSpan
                    )
                  }
                >
                  <DropdownMenuRadioItem
                    value={TopSongsSelected.LAST_4_WEEKS}
                  >
                    Last 4 weeks
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value={TopSongsSelected.LAST_6_MONTHS}
                  >
                    Last 6 months
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={TopSongsSelected.LAST_YEAR}>
                    Last 12 months
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="mx-10">
          {topSongsLoading ? (
            <Spinner />
          ) : (
            <Carousel className="w-full">
              <CarouselContent>
                {topSongs?.items.map((song) => (
                  <CarouselItem className="basis-1/5" key={song.id}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <Dialog>
                            <DialogTrigger>
                              <span className="font-semibold">
                                <h5>
                                  Rank {song.my_rank}: {song.name}
                                </h5>
                                <img
                                  src={song.images.at(-1)?.url}
                                  className={cn(`h-full w-full`)}
                                />
                              </span>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>{song.name}</DialogTitle>
                                <DialogDescription>
                                  Your nr. {song.my_rank} song
                                  <img src={song.images[0].url} />
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <p>Global follower: {song.followers.total}</p>
                                <p>Global popularity: {song.popularity}</p>
                                <p>Your top songs from this song:</p>
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
      </Card> */}
    </div>
  );
};

export default TopSongs;
