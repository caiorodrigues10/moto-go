import { Coordinate } from "@/services/Coordinate";
import { createContext, ReactNode, useContext, useState } from "react";

export interface AppContextData {
  setTelephone: (value: string) => void;
  telephone: string;
  setFocusSearch: (value: boolean) => void;
  focusSearch: boolean;
  setInitial: (value: Coordinate | null) => void;
  initial: Coordinate | null;
  setDestination: (value: Coordinate) => void;
  destination: Coordinate;
  setRoute: (value: Coordinate[]) => void;
  route: Coordinate[];
  queryInitial: string;
  setQueryInitial: (value: string) => void;
  queryFinal: string;
  setQueryFinal: (value: string) => void;
  visibleModalConfirmService: boolean;
  setVisibleModalConfirmService: (value: boolean) => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [telephone, setTelephone] = useState("");
  const [focusSearch, setFocusSearch] = useState(false);
  const [initial, setInitial] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState({} as Coordinate);
  const [route, setRoute] = useState<Coordinate[]>([]);
  const [queryInitial, setQueryInitial] = useState("");
  const [queryFinal, setQueryFinal] = useState("");
  const [visibleModalConfirmService, setVisibleModalConfirmService] =
    useState(true);

  return (
    <AppContext.Provider
      value={{
        telephone,
        setTelephone,
        focusSearch,
        setFocusSearch,
        destination,
        initial,
        setDestination,
        setInitial,
        route,
        setRoute,
        queryFinal,
        queryInitial,
        setQueryFinal,
        setQueryInitial,
        setVisibleModalConfirmService,
        visibleModalConfirmService,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = (): AppContextData => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  return context;
};

export { AppProvider, useAppContext };
