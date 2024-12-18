import { Coordinate } from "@/services/Coordinate";
import { IDriver } from "@/services/drivers/types";
import { IServiceType } from "@/services/serviceType/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

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
  isOpenSelectDriver: boolean;
  setIsOpenSelectDriver: (value: boolean) => void;
  driver: IDriver;
  setDriver: (value: IDriver) => void;
  typeService: IServiceType;
  setTypeService: (value: IServiceType) => void;
  isOpenSelectTypeServiceModal: boolean;
  setIsOpenSelectTypeServiceModal: (value: boolean) => void;
  currentLocation: Coordinate | null;
  setCurrentLocation: (value: Coordinate | null) => void;
  clearService: () => void;
  isOpenObservations: boolean;
  setIsOpenObservations: (value: boolean) => void;
  observationsValue: string;
  setObservationsValue: (value: string) => void;
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
    useState(false);
  const [isOpenSelectDriver, setIsOpenSelectDriver] = useState(false);
  const [driver, setDriver] = useState({} as IDriver);
  const [typeService, setTypeService] = useState({} as IServiceType);
  const [isOpenSelectTypeServiceModal, setIsOpenSelectTypeServiceModal] =
    useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  const [isOpenObservations, setIsOpenObservations] = useState(false);
  const [observationsValue, setObservationsValue] = useState("");

  const clearService = useCallback(() => {
    setDriver({} as IDriver);
    setTypeService({} as IServiceType);
    setRoute([]);
    setQueryFinal("");
    setQueryInitial("");
    setDestination({} as Coordinate);
    setInitial(currentLocation);
    setVisibleModalConfirmService(false);
    setObservationsValue("");
  }, [currentLocation]);

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
        isOpenSelectDriver,
        setIsOpenSelectDriver,
        driver,
        setDriver,
        typeService,
        setTypeService,
        isOpenSelectTypeServiceModal,
        setIsOpenSelectTypeServiceModal,
        currentLocation,
        setCurrentLocation,
        clearService,
        isOpenObservations,
        setIsOpenObservations,
        observationsValue,
        setObservationsValue,
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
