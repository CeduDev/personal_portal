import { toast } from "sonner";
import { SPOTIFY_REFRESH_TOKEN_SK, SPOTIFY_ACCESS_TOKEN_SK } from "./constants";
import {
  refreshTokenType,
  FetchError,
  UserProfile,
  UserProfileType,
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

const fetcher = async () => {
  const token = localStorage.getItem(SPOTIFY_ACCESS_TOKEN_SK);
  const response = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return response;
};

export const fetchProfile = async (): Promise<UserProfileType | null> => {
  console.log("calling fetch profile");
  try {
    const response = await fetcher();

    // Check for errors
    if (!response.ok) {
      const error = FetchError.parse(await response.json()).error;

      // If it's a 401 error and not a retry, refresh the tokens and try again
      if (error.status === 401) {
        await refreshTokens();
        const res = await fetcher();
        if (!res.ok) {
          const err = FetchError.parse(await res.json()).error;
          toast(
            `Failed to fetch user profile data. Error message: ${err.message}`
          );
          return null;
        }

        return UserProfile.parse(await res.json());
      }
      toast(
        `Failed to fetch user profile data. Error message: ${error.message}`
      );
      return null;
    }

    return UserProfile.parse(await response.json());
  } catch (e) {
    toast(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to fetch user profile data. Error message: ${e}`
    );
    return null;
  }
};

// export const fetchProfile = async (
//   retry = false
// ): Promise<UserProfileType | null> => {
//   console.log(`called fetchProfile with retry=${retry}`);
//   const token = localStorage.getItem(SPOTIFY_ACCESS_TOKEN_SK);
//   try {
//     const response = await fetch("https://api.spotify.com/v1/me", {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}asd` },
//     });

//     // Check for errors
//     if (!response.ok) {
//       const error = FetchError.parse(await response.json()).error;

//       // If it's a 401 error and not a retry, refresh the tokens and try again
//       if (error.status === 401 && !retry) {
//         await refreshTokens();
//         return await fetchProfile(true);
//       }
//       // Set toaster to failed
//       toast(
//         `Failed to fetch user profile data. Error message: ${error.message}`
//       );
//       console.log(`failed with retry of ${retry}`);
//       return null;
//     }

//     return UserProfile.parse(await response.json());
//   } catch (e) {
//     toast(
//       // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//       `Failed to fetch user profile data. Error message: ${e}`
//     );
//     // Set toaster to failed
//     return null;
//   }
// };

// export const fetchTopArtists = async () => {
//   const token = localStorage.getItem(SPOTIFY_ACCESS_TOKEN_SK);
//   const response = await fetch("https://api.spotify.com/v1/me/top/artists", {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//   setTopArtists(await response.json());
// };
