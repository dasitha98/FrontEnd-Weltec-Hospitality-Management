/**
 * Unit Conversion Utility Functions
 *
 * Helper functions to convert between different unit measurements.
 * Supports weight (kg, g) and volume (L, ml) conversions commonly used in
 * hospitality and recipe management.
 */

/**
 * Supported weight units
 */
export type WeightUnit = "kg" | "g";

/**
 * Supported volume units
 */
export type VolumeUnit = "L" | "ml";

/**
 * All supported units
 */
export type Unit = WeightUnit | VolumeUnit;

/**
 * Conversion result interface
 */
export interface ConversionResult {
  value: number;
  unit: string;
  originalValue: number;
  originalUnit: string;
}

/**
 * Converts weight from one unit to another
 * @param value - The value to convert
 * @param fromUnit - The source weight unit (kg or g)
 * @param toUnit - The target weight unit (kg or g)
 * @returns The converted value
 *
 * @example
 * convertWeight(1, "kg", "g"); // 1000
 * convertWeight(500, "g", "kg"); // 0.5
 */
export function convertWeight(
  value: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number {
  if (value < 0) {
    throw new Error("Weight value cannot be negative");
  }

  // If same unit, return as-is
  if (fromUnit === toUnit) {
    return value;
  }

  // Convert kg to g
  if (fromUnit === "kg" && toUnit === "g") {
    return value * 1000;
  }

  // Convert g to kg
  if (fromUnit === "g" && toUnit === "kg") {
    return value / 1000;
  }

  throw new Error(`Unsupported weight conversion: ${fromUnit} to ${toUnit}`);
}

/**
 * Converts volume from one unit to another
 * @param value - The value to convert
 * @param fromUnit - The source volume unit (L or ml)
 * @param toUnit - The target volume unit (L or ml)
 * @returns The converted value
 *
 * @example
 * convertVolume(1, "L", "ml"); // 1000
 * convertVolume(500, "ml", "L"); // 0.5
 */
export function convertVolume(
  value: number,
  fromUnit: VolumeUnit,
  toUnit: VolumeUnit
): number {
  if (value < 0) {
    throw new Error("Volume value cannot be negative");
  }

  // If same unit, return as-is
  if (fromUnit === toUnit) {
    return value;
  }

  // Convert L to ml
  if (fromUnit === "L" && toUnit === "ml") {
    return value * 1000;
  }

  // Convert ml to L
  if (fromUnit === "ml" && toUnit === "L") {
    return value / 1000;
  }

  throw new Error(`Unsupported volume conversion: ${fromUnit} to ${toUnit}`);
}

/**
 * Universal converter that automatically detects unit type and converts
 * @param value - The value to convert
 * @param fromUnit - The source unit (kg, g, L, or ml)
 * @param toUnit - The target unit (kg, g, L, or ml)
 * @returns ConversionResult with converted value and metadata
 *
 * @example
 * convert(1, "kg", "g"); // { value: 1000, unit: "g", originalValue: 1, originalUnit: "kg" }
 * convert(500, "ml", "L"); // { value: 0.5, unit: "L", originalValue: 500, originalUnit: "ml" }
 */
export function convert(
  value: number,
  fromUnit: Unit,
  toUnit: Unit
): ConversionResult {
  // If same unit, return as-is
  if (fromUnit === toUnit) {
    return {
      value,
      unit: toUnit,
      originalValue: value,
      originalUnit: fromUnit,
    };
  }

  let convertedValue: number;

  // Determine unit type and convert
  if (isWeightUnit(fromUnit) && isWeightUnit(toUnit)) {
    convertedValue = convertWeight(value, fromUnit, toUnit);
  } else if (isVolumeUnit(fromUnit) && isVolumeUnit(toUnit)) {
    convertedValue = convertVolume(value, fromUnit, toUnit);
  } else {
    throw new Error(
      `Cannot convert between different unit types: ${fromUnit} to ${toUnit}`
    );
  }

  return {
    value: convertedValue,
    unit: toUnit,
    originalValue: value,
    originalUnit: fromUnit,
  };
}

/**
 * Checks if a unit is a weight unit
 * @param unit - The unit to check
 * @returns true if the unit is a weight unit (kg or g)
 */
export function isWeightUnit(unit: string): unit is WeightUnit {
  return unit === "kg" || unit === "g";
}

/**
 * Checks if a unit is a volume unit
 * @param unit - The unit to check
 * @returns true if the unit is a volume unit (L or ml)
 */
export function isVolumeUnit(unit: string): unit is VolumeUnit {
  return unit === "L" || unit === "ml";
}

/**
 * Gets the type of a unit (weight or volume)
 * @param unit - The unit to check
 * @returns The unit type as a string
 */
export function getUnitType(unit: string): "weight" | "volume" | "unknown" {
  if (isWeightUnit(unit)) return "weight";
  if (isVolumeUnit(unit)) return "volume";
  return "unknown";
}

/**
 * Formats a number with appropriate decimal places
 * @param value - The value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string
 *
 * @example
 * formatUnitValue(1.234567); // "1.23"
 * formatUnitValue(1000); // "1000.00"
 * formatUnitValue(0.001, 4); // "0.0010"
 */
export function formatUnitValue(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Converts and formats a unit value for display
 * @param value - The value to convert
 * @param fromUnit - The source unit
 * @param toUnit - The target unit
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with unit
 *
 * @example
 * convertAndFormat(1, "kg", "g"); // "1000.00 g"
 * convertAndFormat(500, "ml", "L"); // "0.50 L"
 */
export function convertAndFormat(
  value: number,
  fromUnit: Unit,
  toUnit: Unit,
  decimals: number = 2
): string {
  const result = convert(value, fromUnit, toUnit);
  return `${formatUnitValue(result.value, decimals)} ${result.unit}`;
}

/**
 * Gets all available units of a specific type
 * @param type - The unit type
 * @returns Array of available units
 *
 * @example
 * getAvailableUnits("weight"); // ["kg", "g"]
 * getAvailableUnits("volume"); // ["L", "ml"]
 */
export function getAvailableUnits(type: "weight" | "volume"): Unit[] {
  switch (type) {
    case "weight":
      return ["kg", "g"];
    case "volume":
      return ["L", "ml"];
    default:
      return [];
  }
}
