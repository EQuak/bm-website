import { useMemo } from "react"

export interface State {
  name: string
  abbreviation: string
}

export interface Country {
  name: string
  abbreviation: string
}

export const US_STATES: State[] = [
  { name: "Alabama", abbreviation: "AL" },
  { name: "Alaska", abbreviation: "AK" },
  { name: "Arizona", abbreviation: "AZ" },
  { name: "Arkansas", abbreviation: "AR" },
  { name: "California", abbreviation: "CA" },
  { name: "Colorado", abbreviation: "CO" },
  { name: "Connecticut", abbreviation: "CT" },
  { name: "Delaware", abbreviation: "DE" },
  { name: "Florida", abbreviation: "FL" },
  { name: "Georgia", abbreviation: "GA" },
  { name: "Hawaii", abbreviation: "HI" },
  { name: "Idaho", abbreviation: "ID" },
  { name: "Illinois", abbreviation: "IL" },
  { name: "Indiana", abbreviation: "IN" },
  { name: "Iowa", abbreviation: "IA" },
  { name: "Kansas", abbreviation: "KS" },
  { name: "Kentucky", abbreviation: "KY" },
  { name: "Louisiana", abbreviation: "LA" },
  { name: "Maine", abbreviation: "ME" },
  { name: "Maryland", abbreviation: "MD" },
  { name: "Massachusetts", abbreviation: "MA" },
  { name: "Michigan", abbreviation: "MI" },
  { name: "Minnesota", abbreviation: "MN" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "Missouri", abbreviation: "MO" },
  { name: "Montana", abbreviation: "MT" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Nevada", abbreviation: "NV" },
  { name: "New Hampshire", abbreviation: "NH" },
  { name: "New Jersey", abbreviation: "NJ" },
  { name: "New Mexico", abbreviation: "NM" },
  { name: "New York", abbreviation: "NY" },
  { name: "North Carolina", abbreviation: "NC" },
  { name: "North Dakota", abbreviation: "ND" },
  { name: "Ohio", abbreviation: "OH" },
  { name: "Oklahoma", abbreviation: "OK" },
  { name: "Oregon", abbreviation: "OR" },
  { name: "Pennsylvania", abbreviation: "PA" },
  { name: "Rhode Island", abbreviation: "RI" },
  { name: "South Carolina", abbreviation: "SC" },
  { name: "South Dakota", abbreviation: "SD" },
  { name: "Tennessee", abbreviation: "TN" },
  { name: "Texas", abbreviation: "TX" },
  { name: "Utah", abbreviation: "UT" },
  { name: "Vermont", abbreviation: "VT" },
  { name: "Virginia", abbreviation: "VA" },
  { name: "Washington", abbreviation: "WA" },
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Wisconsin", abbreviation: "WI" },
  { name: "Wyoming", abbreviation: "WY" }
]

export const CANADA_PROVINCES: State[] = [
  { name: "Alberta", abbreviation: "AB" },
  { name: "British Columbia", abbreviation: "BC" },
  { name: "Manitoba", abbreviation: "MB" },
  { name: "New Brunswick", abbreviation: "NB" },
  { name: "Newfoundland and Labrador", abbreviation: "NL" },
  { name: "Nova Scotia", abbreviation: "NS" },
  { name: "Ontario", abbreviation: "ON" },
  { name: "Prince Edward Island", abbreviation: "PE" },
  { name: "Quebec", abbreviation: "QC" },
  { name: "Saskatchewan", abbreviation: "SK" }
]

export const MEXICO_ENTITIES: State[] = [
  { name: "Aguascalientes", abbreviation: "AGS" },
  { name: "Baja California", abbreviation: "BC" },
  { name: "Baja California Sur", abbreviation: "BCS" },
  { name: "Campeche", abbreviation: "CMX" },
  { name: "Chiapas", abbreviation: "CHIS" },
  { name: "Chihuahua", abbreviation: "CHH" },
  { name: "Coahuila", abbreviation: "COA" },
  { name: "Colima", abbreviation: "COL" },
  { name: "Durango", abbreviation: "DGO" },
  { name: "Guanajuato", abbreviation: "GTO" },
  { name: "Guerrero", abbreviation: "GRO" },
  { name: "Hidalgo", abbreviation: "HGO" },
  { name: "Jalisco", abbreviation: "JAL" },
  { name: "Mexico (State of Mexico)", abbreviation: "MEX" },
  { name: "Michoacán", abbreviation: "MICH" },
  { name: "Morelos", abbreviation: "MOR" },
  { name: "Nayarit", abbreviation: "NAY" },
  { name: "Nuevo León", abbreviation: "NL" },
  { name: "Oaxaca", abbreviation: "OAX" },
  { name: "Puebla", abbreviation: "PUE" },
  { name: "Querétaro", abbreviation: "QRO" },
  { name: "Quintana Roo", abbreviation: "QROO" },
  { name: "San Luis Potosí", abbreviation: "SLP" },
  { name: "Sinaloa", abbreviation: "SIN" },
  { name: "Sonora", abbreviation: "SON" },
  { name: "Tabasco", abbreviation: "TAB" },
  { name: "Tamaulipas", abbreviation: "TAMPS" },
  { name: "Tlaxcala", abbreviation: "TLAX" },
  { name: "Veracruz", abbreviation: "VER" },
  { name: "Yucatán", abbreviation: "YUC" },
  { name: "Zacatecas", abbreviation: "ZAC" }
]

export const CANADA_TERRITORIES: State[] = [
  { name: "Nunavut", abbreviation: "NU" },
  { name: "Northwest Territories", abbreviation: "NT" },
  { name: "Yukon", abbreviation: "YT" }
]

export const COUNTRIES: Country[] = [
  { name: "United States", abbreviation: "US" },
  { name: "Canada", abbreviation: "CA" },
  { name: "Mexico", abbreviation: "MX" }
]

export function useUSStates(): State[] {
  return useMemo(() => US_STATES, [])
}

export function useCanadaProvincesAndTerritories(): State[] {
  return useMemo(
    () => [...CANADA_PROVINCES, ...CANADA_TERRITORIES],
    [CANADA_PROVINCES, CANADA_TERRITORIES]
  )
}

export function useMexicoEntities(): State[] {
  return useMemo(() => MEXICO_ENTITIES, [])
}

export function useCountries(): Country[] {
  return useMemo(() => COUNTRIES, [])
}
