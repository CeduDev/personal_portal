import { GlobalProviderContext } from "@/contexts/global-context";
import { use, useEffect } from "react";

export function Root() {
  const context = use(GlobalProviderContext).siteHeader;

  // On mount
  useEffect(() => {
    context.updateTitle("Root jee");
    context.updateComponentsToRender(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Hello world!</div>;
}
