import { createContext, useMemo, useState } from "react";

type SpotifyProviderProps = {
  children: React.ReactNode;
};

type SpotifyProviderState = {
  isLoggedIn: boolean;
  updateLogin: (mode: "login" | "logout") => void;
};

const initialState: SpotifyProviderState = {
  isLoggedIn: false,
  updateLogin: () => null,
};

const SpotifyProviderContext =
  createContext<SpotifyProviderState>(initialState);

function SpotifyProvider({ children, ...props }: SpotifyProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const accessToken = localStorage.getItem("spotify_access_token");
    const refreshToken = localStorage.getItem("spotify_refresh_token");
    return Boolean(accessToken && refreshToken);
  });

  const updateLogin = (mode: "login" | "logout") => {
    if (mode === "logout") {
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_refresh_token");
    }
    setIsLoggedIn(mode === "login");
  };

  const value = useMemo(() => {
    return {
      isLoggedIn,
      updateLogin,
    };
  }, [isLoggedIn]);

  return (
    <SpotifyProviderContext {...props} value={value}>
      {children}
    </SpotifyProviderContext>
  );
}

export { SpotifyProviderContext, SpotifyProvider };
