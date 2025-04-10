import { createContext, useMemo, useState } from "react";

type GlobalProviderProps = {
  children: React.ReactNode;
};

type GlobalProviderState = {
  siteHeader: {
    title: string;
    updateTitle: (title: string) => void;
    componentsToRender: React.ReactNode;
    updateComponentsToRender: (components: React.ReactNode) => void;
  };
};

const initialState: GlobalProviderState = {
  siteHeader: {
    title: "default title",
    updateTitle: () => null,
    componentsToRender: <div>default component</div>,
    updateComponentsToRender: () => null,
  },
};

const GlobalProviderContext = createContext<GlobalProviderState>(initialState);

function GlobalProvider({ children, ...props }: GlobalProviderProps) {
  const [siteHeaderTitle, setSiteHeaderTitle] = useState<string>("");
  const [siteHeaderComponents, setSiteHeaderComponents] =
    useState<React.ReactNode>(null);

  const value = useMemo(() => {
    return {
      siteHeader: {
        title: siteHeaderTitle,
        updateTitle: (title: string) => setSiteHeaderTitle(title),
        componentsToRender: siteHeaderComponents,
        updateComponentsToRender: (components: React.ReactNode) =>
          setSiteHeaderComponents(components),
      },
    };
  }, [siteHeaderComponents, siteHeaderTitle]);

  return (
    <GlobalProviderContext {...props} value={value}>
      {children}
    </GlobalProviderContext>
  );
}

export { GlobalProviderContext, GlobalProvider };
