import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';

interface StatusBarContextValue {
  errorMessage: string | ReactNode;
  successMessage: string;
  loadingMessage: string;
  loadingPercentage: number | undefined;
  breadcrumbs: string | ReactNode;
  onClickButton: (() => void) | undefined;
  setErrorMessage: Dispatch<SetStateAction<string | ReactNode>>;
  setSuccessMessage: (_: string) => void;
  setLoadingMessage: (_: string) => void;
  setLoadingPercentage: Dispatch<SetStateAction<number | undefined>>;
  setBreadcrumbs: (_: string[] | ReactNode) => void;
  setOnClickButton: Dispatch<SetStateAction<(() => void) | undefined>>;
}

export const StatusBarContext = createContext<StatusBarContextValue>({
  errorMessage: '',
  successMessage: '',
  loadingMessage: '',
  loadingPercentage: undefined,
  breadcrumbs: null,
  onClickButton: undefined,
  setErrorMessage: () => {},
  setSuccessMessage: () => {},
  setLoadingMessage: () => {},
  setLoadingPercentage: () => {},
  setBreadcrumbs: () => {},
  setOnClickButton: () => {},
});

export const StatusBarProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [errorMessage, setErrorMessage] = useState<string | ReactNode>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingPercentage, setLoadingPercentage] = useState<undefined | number>();
  const [breadcrumbs, setBreadcrumbs] = useState<string[] | ReactNode>();
  const [onClickButton, setOnClickButton] = useState<(() => void) | undefined>();

  const value = {
    errorMessage,
    successMessage,
    loadingMessage,
    loadingPercentage,
    breadcrumbs,
    onClickButton,
    setErrorMessage,
    setSuccessMessage,
    setLoadingMessage,
    setLoadingPercentage,
    setBreadcrumbs,
    setOnClickButton,
  };

  return <StatusBarContext.Provider value={value}>{children}</StatusBarContext.Provider>;
};
