import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { GlobalProviderContext } from "@/contexts/global-context";
import { use } from "react";

export function SiteHeader() {
  const context = use(GlobalProviderContext).siteHeader;

  return (
    <header className="flex min-h-(--header-height-min) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-(--header-height-min)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{context.title}</h1>
        {context.componentsToRender}
      </div>
    </header>
  );
}
