import { createContext, PropsWithChildren, useState } from 'react';
import { VaultStatusEnum } from '@enums/vault.enum';

interface AppContextValue {
  isLoading: boolean;
  setIsLoading: (_: boolean) => void;
  isAppInitialized: boolean;
  setIsAppInitialized: (_: boolean) => void;
  vaultPath: string | null;
  setVaultPath: (_: string) => void;
  vaultStatus: VaultStatusEnum;
  setVaultStatus: (_: VaultStatusEnum) => void;
}

export const AppContext = createContext<AppContextValue>({
  isLoading: true,
  setIsLoading: () => {},
  isAppInitialized: false,
  setIsAppInitialized: () => {},
  vaultPath: null,
  setVaultPath: () => {},
  vaultStatus: VaultStatusEnum.NOT_SET,
  setVaultStatus: () => {},
});

export const AppCtxProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [vaultPath, setVaultPath] = useState<string | null>(null);
  const [vaultStatus, setVaultStatus] = useState(VaultStatusEnum.NOT_SET);

  const value = {
    isLoading,
    setIsLoading,
    isAppInitialized,
    setIsAppInitialized,
    vaultPath,
    setVaultPath,
    vaultStatus,
    setVaultStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
