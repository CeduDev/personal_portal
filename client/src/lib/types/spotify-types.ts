import { z } from "zod";

const Images = z.object({
  url: z.string(),
  height: z.number().nullable(),
  width: z.number().nullable(),
});

export const UserProfile = z.object({
  country: z.string(),
  display_name: z.string(),
  email: z.string(),
  explicit_content: z.object({
    filter_enabled: z.boolean(),
    filter_locked: z.boolean(),
  }),
  external_urls: z.object({ spotify: z.string() }),
  followers: z.object({ href: z.string().nullable(), total: z.number() }),
  href: z.string(),
  id: z.string(),
  images: z.array(Images),
  product: z.string(),
  type: z.string(),
  uri: z.string(),
});
export type UserProfileType = z.infer<typeof UserProfile>;

export enum TopItem {
  ARTISTS = "artists",
  SONGS = "tracks",
}

export enum TopItemsSelected {
  LAST_4_WEEKS = "short_term",
  LAST_6_MONTHS = "medium_term",
  LAST_YEAR = "long_term",
}

export enum TopArtistsSortByValues {
  MY_RANK = "my_rank",
  GLOBAL_RANK = "global_rank",
  FOLLOWERS = "followers",
}

export enum TopSongsSortByValues {
  MY_RANK = "my_rank",
  GLOBAL_RANK = "global_rank",
  DURATION = "duration_ms",
}

const SimplifiedArtist = z.object({
  external_urls: z.object({ spotify: z.string().optional() }).optional(),
  href: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  type: z.literal("artist").optional(),
  uri: z.string().optional(),
});

export const RawArtist = SimplifiedArtist.extend({
  followers: z.object({ href: z.string().nullable(), total: z.number() }),
  images: z.array(Images).optional(),
  genres: z.array(z.string()),
  popularity: z.number(),
});

export const Artist = RawArtist.extend({
  my_rank: z.number(),
});

export const RawTopArtists = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(RawArtist),
});

export const TopArtists = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(Artist),
  span: z.nativeEnum(TopItemsSelected),
});
export type TopArtistsType = z.infer<typeof TopArtists>;

export const RawSong = z.object({
  album: z
    .object({
      album_type: z.union([
        z.literal("album"),
        z.literal("single"),
        z.literal("compilation"),
      ]),
      total_tracks: z.number(),
      available_markets: z.string().array(),
      external_urls: z.object({ spotify: z.string().optional() }),
      href: z.string(),
      id: z.string(),
      images: z.array(Images),
      name: z.string(),
      release_date: z.string(),
      release_date_precision: z.union([
        z.literal("year"),
        z.literal("month"),
        z.literal("day"),
      ]),
      restrictions: z
        .object({
          reason: z
            .union([
              z.literal("market"),
              z.literal("product"),
              z.literal("explicit"),
            ])
            .optional(),
        })
        .optional(),
      type: z.literal("album"),
      uri: z.string(),
      artists: z.array(SimplifiedArtist),
    })
    .optional(),
  artists: z.array(SimplifiedArtist).optional(),
  available_markets: z.string().array().optional(),
  disc_number: z.number().optional(),
  duration_ms: z.number().optional(),
  explicit: z.boolean().optional(),
  external_ids: z
    .object({
      isrc: z.string().optional(),
      ean: z.string().optional(),
      upc: z.string().optional(),
    })
    .optional(),
  external_urls: z.object({ spotify: z.string().optional() }).optional(),
  href: z.string().optional(),
  id: z.string().optional(),
  is_playable: z.boolean().optional(),
  linked_from: z.object({}).optional(),
  restriction: z.object({ reason: z.string() }).optional(),
  name: z.string().optional(),
  popularity: z.number().optional(),
  preview_url: z.string().nullable().optional(),
  track_number: z.number().optional(),
  type: z.literal("track").optional(),
  uri: z.string().optional(),
  is_local: z.boolean().optional(),
});

export const Song = RawSong.extend({
  my_rank: z.number(),
});

export const RawTopSongs = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(RawSong),
});

export const TopSongs = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(Song),
  span: z.nativeEnum(TopItemsSelected),
});
export type TopSongsType = z.infer<typeof TopSongs>;

export const FetchError = z.object({
  error: z.object({
    status: z.number(),
    message: z.string(),
  }),
});

export const refreshTokenType = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
});
