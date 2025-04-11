import { toast } from "sonner";
import { SPOTIFY_REFRESH_TOKEN_SK, SPOTIFY_ACCESS_TOKEN_SK } from "./constants";
import {
  refreshTokenType,
  FetchError,
  UserProfile,
  UserProfileType,
  TopArtistsType,
  TopArtists,
} from "./types/spotify-types";

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

const fetcherGet = async (link: string) => {
  const token = localStorage.getItem(SPOTIFY_ACCESS_TOKEN_SK);
  const response = await fetch(link, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return response;
};

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

export const fetchTopArtists = async (
  retry = false
): Promise<TopArtistsType | null> => {
  try {
    const response = await fetcherGet(
      "https://api.spotify.com/v1/me/top/artists"
    );

    // Check for errors
    if (!response.ok) {
      const error = FetchError.parse(await response.json()).error;

      // If it's a 401 error and not a retry, refresh the tokens and try again
      if (error.status === 401 && !retry) {
        await refreshTokens();
        return await fetchTopArtists(true);
      }
      // Set toaster to failed
      toast(
        `Failed to fetch top artists data. Error message: ${error.message}`
      );
      return null;
    }

    return TopArtists.parse(await response.json());
  } catch (e) {
    toast(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Unexpected error when fetching top artists data. Error message: ${e}`
    );
    // Set toaster to failed
    return null;
  }
};
