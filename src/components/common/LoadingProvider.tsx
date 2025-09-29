import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";


interface LoadingContextProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);

  // Memoize the overlay to avoid unnecessary re-renders
  const overlay = useMemo(
    () =>
      loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 9999,
          }}
        >
        
        </div>
      ),
    [loading]
  );

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {overlay}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextProps => {
  const context = useContext(LoadingContext);
  if (!context)
    throw new Error("useLoading must be used inside LoadingProvider");
  return context;
};
