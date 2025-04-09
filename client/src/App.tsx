import { ThemeProvider } from "./contexts/theme-context";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Route, Routes } from "react-router";
import Spotify from "./components/spotify/spotify";
import Maps from "./components/maps/maps";
import { SpotifyProvider } from "./contexts/spotify-context";
// import { SiteHeader } from "./components/site-header";
// import { SectionCards } from "./components/section-cards";
// import { ChartAreaInteractive } from "./components/chart-area-interactive";
// import { DataTable } from "./components/data-table";

// import data from "./app/dashboard/data.json";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SpotifyProvider>
        <SidebarProvider>
          <AppSidebar variant="inset" />
          <SidebarInset>
            {/* <SiteHeader /> */}
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <Routes>
                    <Route path="/" element={<div>hello world</div>} />
                    <Route path="/spotify" element={<Spotify />} />
                    <Route path="/maps" element={<Maps />} />
                  </Routes>
                  {/* <SectionCards />
                <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
                </div>
                <DataTable data={data} /> */}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </SpotifyProvider>
    </ThemeProvider>
  );
}

export default App;
