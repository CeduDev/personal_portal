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

export enum TopItemsSelected {
  LAST_4_WEEKS = "short_term",
  LAST_6_MONTHS = "medium_term",
  LAST_YEAR = "long_term",
}

export enum TopItemsSortByValues {
  MY_RANK = "my_rank",
  GLOBAL_RANK = "global_rank",
  FOLLOWERS = "followers",
}

const SimplifiedArtist = z.object({
  external_urls: z.object({ spotify: z.string() }),
  href: z.string(),
  id: z.string(),
  images: z.array(Images),
  name: z.string(),
  type: z.literal("artist"),
  uri: z.string(),
});

export const RawArtist = SimplifiedArtist.extend({
  followers: z.object({ href: z.string().nullable(), total: z.number() }),
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

export const RawTopSongs = z.object({
  album: z.object({
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
    release_data_precision: z.union([
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
  }),
  artists: z.array(SimplifiedArtist),
  available_markets: z.string().array(),
  disc_number: z.number(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_ids: z.object({
    isrc: z.string(),
    ean: z.string(),
    upc: z.string(),
  }),
  external_urls: z.object({ spotify: z.string().optional() }),
  href: z.string(),
  id: z.string(),
  is_playable: z.boolean(),
  linked_from: z.object({}).optional(),
  restriction: z.object({ reason: z.string() }),
  name: z.string(),
  popularity: z.number(),
  preview_url: z.string().nullable(),
  track_number: z.number(),
  type: z.literal("track"),
  uri: z.string(),
  is_local: z.boolean(),
});

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
