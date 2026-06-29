export type UnitCategory = "weight" | "distance" | "temperature";

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  category: UnitCategory;
  multiplier?: number;
}

export const UNITS: Unit[] = [
  // WEIGHT (base: kg)
  { id: "kg", name: "Kilogram", symbol: "kg", category: "weight", multiplier: 1 },
  { id: "g", name: "Gram", symbol: "g", category: "weight", multiplier: 0.001 },
  { id: "lb", name: "Pound", symbol: "lb", category: "weight", multiplier: 0.45359237 },
  { id: "oz", name: "Ounce", symbol: "oz", category: "weight", multiplier: 0.02834952 },

  // DISTANCE (base: m)
  { id: "m", name: "Meter", symbol: "m", category: "distance", multiplier: 1 },
  { id: "km", name: "Kilometer", symbol: "km", category: "distance", multiplier: 1000 },
  { id: "cm", name: "Centimeter", symbol: "cm", category: "distance", multiplier: 0.01 },
  { id: "mm", name: "Millimeter", symbol: "mm", category: "distance", multiplier: 0.001 },
  { id: "mi", name: "Mile", symbol: "mi", category: "distance", multiplier: 1609.344 },
  { id: "yd", name: "Yard", symbol: "yd", category: "distance", multiplier: 0.9144 },
  { id: "ft", name: "Foot", symbol: "ft", category: "distance", multiplier: 0.3048 },
  { id: "in", name: "Inch", symbol: "in", category: "distance", multiplier: 0.0254 },

  // TEMPERATURE (special case, no base multiplier used directly in the generic calc function)
  { id: "C", name: "Celsius", symbol: "°C", category: "temperature" },
  { id: "F", name: "Fahrenheit", symbol: "°F", category: "temperature" },
  { id: "K", name: "Kelvin", symbol: "K", category: "temperature" },
];

export const getUnitCategories = (): UnitCategory[] => ["weight", "distance", "temperature"];

export const getUnitsByCategory = (category: UnitCategory): Unit[] => 
  UNITS.filter(u => u.category === category);

export const getUnitById = (id: string): Unit | undefined => 
  UNITS.find(u => u.id === id);

export const convertUnit = (amount: number, fromId: string, toId: string): number => {
  if (fromId === toId) return amount;
  
  const from = getUnitById(fromId);
  const to = getUnitById(toId);
  
  if (!from || !to || from.category !== to.category) return 0;
  
  if (from.category === "temperature") {
    // Convert to Celsius first
    let celsius = amount;
    if (from.id === "F") celsius = (amount - 32) * (5 / 9);
    else if (from.id === "K") celsius = amount - 273.15;
    
    // Convert from Celsius to Target
    if (to.id === "C") return celsius;
    if (to.id === "F") return celsius * (9 / 5) + 32;
    if (to.id === "K") return celsius + 273.15;
  }
  
  // For non-temperature, convert to base unit, then to target unit
  if (from.multiplier !== undefined && to.multiplier !== undefined) {
    const baseAmount = amount * from.multiplier;
    return baseAmount / to.multiplier;
  }
  
  return 0;
};
