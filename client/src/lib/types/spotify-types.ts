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

export const Artist = z.object({
  external_urls: z.object({ spotify: z.string() }),
  followers: z.object({ href: z.string().nullable(), total: z.number() }),
  genres: z.array(z.string()),
  href: z.string(),
  id: z.string(),
  images: z.array(Images),
  name: z.string(),
  popularity: z.number(),
  type: z.literal("artist"),
  uri: z.string(),
});

export type Artist = z.infer<typeof Artist>;

export const TopArtists = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(Artist),
});

export type TopArtistsType = z.infer<typeof TopArtists>;

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
