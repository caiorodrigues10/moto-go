import { Coordinate } from "@/services/Coordinate";
import { createContext, ReactNode, useContext, useState } from "react";

export interface AppDriverContextData {
  setInitial: (value: Coordinate | null) => void;
  initial: Coordinate | null;
  setDestination: (value: Coordinate) => void;
  destination: Coordinate;
  setRoute: (value: Coordinate[]) => void;
  route: Coordinate[];
  isInvalidRace: boolean;
  setIsInvalidRace: (value: boolean) => void;
  isAccept: string;
  setIsAccept: (value: string) => void;
  raceInProgress: boolean;
  setRaceInProgress: (value: boolean) => void;
  currentLocation: Coordinate | null;
  setCurrentLocation: (value: Coordinate | null) => void;
}

const AppDriverContext = createContext<AppDriverContextData>(
  {} as AppDriverContextData
);

interface AppDriverProviderProps {
  children: ReactNode;
}

const AppDriverProvider = ({ children }: AppDriverProviderProps) => {
  const [initial, setInitial] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState({} as Coordinate);
  const [route, setRoute] = useState<Coordinate[]>([]);
  const [isInvalidRace, setIsInvalidRace] = useState(false);
  const [isAccept, setIsAccept] = useState("");
  const [raceInProgress, setRaceInProgress] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  return (
    <AppDriverContext.Provider
      value={{
        destination,
        initial,
        setDestination,
        setInitial,
        route,
        setRoute,
        isInvalidRace,
        setIsInvalidRace,
        isAccept,
        setIsAccept,
        raceInProgress,
        setRaceInProgress,
        currentLocation,
        setCurrentLocation,
      }}
    >
      {children}
    </AppDriverContext.Provider>
  );
};

const useAppDriverContext = (): AppDriverContextData => {
  const context = useContext(AppDriverContext);

  if (!context) {
    throw new Error(
      "useAppDriverContext must be used within a AppDriverProvider"
    );
  }

  return context;
};

export { AppDriverProvider, useAppDriverContext };
