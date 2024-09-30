import { Unit } from 'js-ballistics/dist/v2';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the preferred units state
interface PreferredUnits {
  distance: Unit;
  velocity: Unit;
  sizes: Unit;
  temperature: Unit;
  pressure: Unit;
  energy: Unit;
  adjustment: Unit;
  drop: Unit;
  angular: Unit;
  weight: Unit;
}

// Define the context value type, including the setter function
interface PreferredUnitsContextType {
  preferredUnits: PreferredUnits;
  setPreferredUnits: React.Dispatch<React.SetStateAction<PreferredUnits>>;
}

// Initialize the context with a null default value
export const PreferredUnitsContext = createContext<PreferredUnitsContextType | null>(null);

interface PreferredUnitsProviderProps {
  children: ReactNode;
}

export const PreferredUnitsProvider: React.FC<PreferredUnitsProviderProps> = ({ children }) => {
  const [preferredUnits, setPreferredUnits] = useState<PreferredUnits>({
    distance: Unit.Yard,
    velocity: Unit.FPS,
    sizes: Unit.Inch,
    temperature: Unit.Fahrenheit,
    pressure: Unit.hPa,
    energy: Unit.FootPound,
    adjustment: Unit.MIL,
    drop: Unit.Inch,
    angular: Unit.Degree,
    weight: Unit.Grain,
  });

  return (
    <PreferredUnitsContext.Provider value={{ preferredUnits, setPreferredUnits }}>
      {children}
    </PreferredUnitsContext.Provider>
  );
};

export const usePreferredUnits = (): PreferredUnitsContextType => {
  const context = useContext(PreferredUnitsContext);
  if (!context) {
    throw new Error('usePreferredUnits must be used within a PreferredUnitsProvider');
  }
  return context;
};
