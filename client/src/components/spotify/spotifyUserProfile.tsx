import { UserProfileType } from "@/lib/types/spotify-types";
import { Link } from "lucide-react";
import { Card, CardHeader, CardDescription, CardTitle } from "../ui/card";
import { Spinner } from "../ui/spinner";
import { Badge } from "../ui/badge";
import { use, useEffect, useState } from "react";
import { SpotifyProviderContext } from "@/contexts/spotify-context";
import { fetchProfile } from "@/lib/spotifyUtils";

const UserProfile = () => {
  const spotifyContext = use(SpotifyProviderContext);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);

  const [userProfileLoading, setUserProfileLoading] = useState(false);

  useEffect(() => {
    if (spotifyContext.isLoggedIn) {
      if (!userProfile) {
        setUserProfileLoading(true);
        fetchProfile()
          .then((res) => {
            if (res) setUserProfile(res);
          })
          .catch((e) => console.log(e))
          .finally(() => setUserProfileLoading(false));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotifyContext.isLoggedIn]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 mb-4">
      <Card className="@container/card">
        {userProfileLoading ? (
          <Spinner />
        ) : (
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
        )}
      </Card>
    </div>
  );
};

export default UserProfile;
