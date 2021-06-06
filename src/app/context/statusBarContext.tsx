import { createContext, PropsWithChildren, ReactNode, useState } from 'react';

interface StatusBarContextValue {
  errorMessage: string;
  successMessage: string;
  breadcrumbs: string | ReactNode;
  setErrorMessage: (_: string) => void;
  setSuccessMessage: (_: string) => void;
  setBreadcrumbs: (_: string[] | ReactNode) => void;
}

export const StatusBarContext = createContext<StatusBarContextValue>({
  errorMessage: '',
  successMessage: '',
  breadcrumbs: null,
  setErrorMessage: () => {},
  setSuccessMessage: () => {},
  setBreadcrumbs: () => {},
});

export const StatusBarProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<string[] | ReactNode>();
  const value = {
    errorMessage,
    successMessage,
    breadcrumbs,
    setErrorMessage,
    setSuccessMessage,
    setBreadcrumbs,
  };

  return <StatusBarContext.Provider value={value}>{children}</StatusBarContext.Provider>;
};
