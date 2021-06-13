import { createContext, PropsWithChildren, useState } from 'react';

interface AppContextValue {
  isLoading: boolean;
  setIsLoading: (_: boolean) => void;
  isAppInitialized: boolean;
  setIsAppInitialized: (_: boolean) => void;
  filePath: string | null;
  setFilePath: (_: string) => void;
  isDbEmpty: boolean;
  setIsDbEmpty: (_: boolean) => void;
}

export const AppContext = createContext<AppContextValue>({
  isLoading: true,
  setIsLoading: () => {},
  isAppInitialized: false,
  setIsAppInitialized: () => {},
  filePath: null,
  setFilePath: () => {},
  isDbEmpty: false,
  setIsDbEmpty: () => {},
});

export const AppCtxProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isDbEmpty, setIsDbEmpty] = useState(false);

  const value = {
    isLoading,
    setIsLoading,
    isAppInitialized,
    setIsAppInitialized,
    filePath,
    setFilePath,
    isDbEmpty,
    setIsDbEmpty,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
