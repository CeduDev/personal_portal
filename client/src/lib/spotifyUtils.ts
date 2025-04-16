import { toast } from "sonner";
import { SPOTIFY_REFRESH_TOKEN_SK, SPOTIFY_ACCESS_TOKEN_SK } from "./constants";
import {
  refreshTokenType,
  FetchError,
  UserProfile,
  UserProfileType,
  TopArtistsType,
  TopArtists,
  RawTopArtists,
  TopItemsSelected,
  TopItem,
  RawTopSongs,
  TopSongs,
  TopSongsType,
  TopSongsSortByValues,
  TopArtistsSortByValues,
} from "./types/spotify-types";

// Token
const refreshTokens = async (): Promise<void> => {
  const existingToken = localStorage.getItem(SPOTIFY_REFRESH_TOKEN_SK);
  const response = await fetch(
    `/api/spotify/refresh_token?refresh_token=${existingToken}`
  );
  const res = refreshTokenType.parse(await response.json());

  localStorage.setItem(SPOTIFY_ACCESS_TOKEN_SK, res.access_token);
  if (res.refresh_token)
    localStorage.setItem(SPOTIFY_REFRESH_TOKEN_SK, res.refresh_token);
};

// General fetcher
const fetcherGet = async (link: string) => {
  const token = localStorage.getItem(SPOTIFY_ACCESS_TOKEN_SK);
  const response = await fetch(link, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return response;
};

// Profile
export const fetchProfile = async (
  retry = false
): Promise<UserProfileType | null> => {
  try {
    const response = await fetcherGet("https://api.spotify.com/v1/me");

    // Check for errors
    if (!response.ok) {
      const error = FetchError.parse(await response.json()).error;

      // If it's a 401 error and not a retry, refresh the tokens and try again
      if (error.status === 401 && !retry) {
        await refreshTokens();
        return await fetchProfile(true);
      }
      // Set toaster to failed
      toast(
        `Failed to fetch user profile data. Error message: ${error.message}`
      );
      return null;
    }

    return UserProfile.parse(await response.json());
  } catch (e) {
    toast(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Unexpected error when fetching user profile data. Error message: ${e}`
    );
    // Set toaster to failed
    return null;
  }
};

// Top artist
export const fetchTopItems = async (
  retry = false,
  span: TopItemsSelected,
  item_type: TopItem
): Promise<TopArtistsType | TopSongsType | null> => {
  try {
    const response = await fetcherGet(
      `https://api.spotify.com/v1/me/top/${item_type}?time_range=${span}`
    );

    // Check for errors
    if (!response.ok) {
      const error = FetchError.parse(await response.json()).error;

      // If it's a 401 error and not a retry, refresh the tokens and try again
      if (error.status === 401 && !retry) {
        await refreshTokens();

        return await fetchTopItems(true, span, item_type);
      }
      // Set toaster to failed
      toast(
        `Failed to fetch top ${item_type} data. Error message: ${error.message}`
      );
      return null;
    }

    if (item_type == TopItem.ARTISTS) {
      const raw_artists = RawTopArtists.parse(await response.json());

      const topArtistsData = {
        ...raw_artists,
        items: raw_artists.items.map((artist, index) => ({
          ...artist,
          my_rank: index + 1,
        })),
        span: span,
      };

      return TopArtists.parse(topArtistsData);
    } else {
      const raw_songs = RawTopSongs.parse(await response.json());

      const topSongsData = {
        ...raw_songs,
        items: raw_songs.items.map((song, index) => ({
          ...song,
          my_rank: index + 1,
        })),
        span: span,
      };

      return TopSongs.parse(topSongsData);
    }
  } catch (e) {
    console.log(e);
    toast(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Unexpected error when fetching top ${item_type} data. Error message: ${e}`
    );
    // Set toaster to failed
    return null;
  }
};

export const fetchAllTopItems = async (
  item_type: TopItem
): Promise<TopArtistsType[] | TopSongsType[]> => {
  const last_4_weeks = await fetchTopItems(
    false,
    TopItemsSelected.LAST_4_WEEKS,
    item_type
  );
  const last_6_months = await fetchTopItems(
    false,
    TopItemsSelected.LAST_6_MONTHS,
    item_type
  );
  const last_year = await fetchTopItems(
    false,
    TopItemsSelected.LAST_YEAR,
    item_type
  );

  if (last_4_weeks && last_6_months && last_year) {
    if (item_type === TopItem.ARTISTS) {
      return [
        last_4_weeks as TopArtistsType,
        last_6_months as TopArtistsType,
        last_year as TopArtistsType,
      ];
    }

    return [
      last_4_weeks as TopSongsType,
      last_6_months as TopSongsType,
      last_year as TopSongsType,
    ];
  } else {
    toast(
      `Failed to fetch all top ${item_type} data for ${!last_4_weeks && "last 4 weeks,"} ${!last_6_months && "last 6 months,"} ${!last_year && "last year"}`
    );
    throw Error(`Failed to fetch all top ${item_type} data`);
  }
};

// Sorting
export const artistSortByRanking = (
  data: TopArtistsType | null,
  all_data: TopArtistsType[] | null,
  setData: React.Dispatch<React.SetStateAction<TopArtistsType | null>>,
  setAllData: React.Dispatch<React.SetStateAction<TopArtistsType[] | null>>,
  value: TopArtistsSortByValues,
  setArtistSortByValue: React.Dispatch<
    React.SetStateAction<TopArtistsSortByValues>
  >
) => {
  if (data && all_data && all_data.length > 0) {
    const data_ = data;
    const all_data_ = all_data;
    setArtistSortByValue(value);

    switch (value) {
      case TopArtistsSortByValues.MY_RANK: {
        data_.items = data_.items.sort((a, b) => a.my_rank - b.my_rank);
        break;
      }

      case TopArtistsSortByValues.GLOBAL_RANK: {
        data_.items = data_.items.sort((a, b) => b.popularity - a.popularity);
        break;
      }

      case TopArtistsSortByValues.FOLLOWERS: {
        data_.items = data_.items.sort(
          (a, b) => b.followers.total - a.followers.total
        );
        break;
      }

      default:
        console.log("Unsupported sorting type");
    }

    all_data_[all_data_.findIndex((a) => a.span === data_.span)] = data_;
    setAllData(all_data_);
    setData(data_);
  }
};

export const songSortByRanking = (
  data: TopSongsType | null,
  all_data: TopSongsType[] | null,
  setData: React.Dispatch<React.SetStateAction<TopSongsType | null>>,
  setAllData: React.Dispatch<React.SetStateAction<TopSongsType[] | null>>,
  value: TopSongsSortByValues,
  setSongSortByValue: React.Dispatch<React.SetStateAction<TopSongsSortByValues>>
) => {
  if (data && all_data && all_data.length > 0) {
    const data_ = data;
    const all_data_ = all_data;
    setSongSortByValue(value);

    switch (value) {
      case TopSongsSortByValues.MY_RANK: {
        data_.items = data_.items.sort((a, b) => a.my_rank - b.my_rank);
        break;
      }

      case TopSongsSortByValues.GLOBAL_RANK: {
        data_.items = data_.items.sort((a, b) => {
          if (b.popularity === undefined) return 1;
          if (a.popularity === undefined) return -1;
          return b.popularity - a.popularity;
        });
        break;
      }

      case TopSongsSortByValues.DURATION: {
        data_.items = data_.items.sort((a, b) => {
          if (b.duration_ms === undefined) return 1;
          if (a.duration_ms === undefined) return -1;
          return b.duration_ms - a.duration_ms;
        });
        break;
      }

      default:
        console.log("Unsupported sorting type");
    }

    all_data_[all_data_.findIndex((a) => a.span === data_.span)] = data_;
    setAllData(all_data_);
    setData(data_);
  }
};

// Filtering
export const itemFilter = (
  item_type: TopItem,
  all_data: TopArtistsType[] | TopSongsType[] | null,
  setData:
    | React.Dispatch<React.SetStateAction<TopArtistsType | null>>
    | React.Dispatch<React.SetStateAction<TopSongsType | null>>,
  value: TopItemsSelected,
  setValue: React.Dispatch<React.SetStateAction<TopItemsSelected>>
) => {
  if (all_data && all_data.length > 0) {
    setValue(value);
    if (item_type === TopItem.ARTISTS) {
      const setData_ = setData as React.Dispatch<
        React.SetStateAction<TopArtistsType | null>
      >;
      setData_(all_data.find((a) => a.span === value) as TopArtistsType);
    } else {
      const setData_ = setData as React.Dispatch<
        React.SetStateAction<TopSongsType | null>
      >;
      setData_(all_data.find((a) => a.span === value) as TopSongsType);
    }
  }
};
