export interface HOLCGrade {
  grade: 'A' | 'B' | 'C' | 'D';
  description: string;
  color: string;
}

export interface HOLCPolygon {
  id: string;
  city: string;
  grade: HOLCGrade['grade'];
  neighborhood: string;
  description: string;
  geometry: GeoJSON.Polygon;
}

export interface MortgageData {
  censustract: string;
  denial_rate_white: number;
  denial_rate_black: number;
  denial_rate_hispanic: number;
  denial_rate_asian: number;
  total_applications: number;
}

export interface DemographicData {
  censustract: string;
  median_income: number;
  percent_white: number;
  percent_black: number;
  percent_hispanic: number;
  percent_asian: number;
  homeownership_rate_white: number;
  homeownership_rate_black: number;
  homeownership_rate_hispanic: number;
  homeownership_rate_asian: number;
}

export interface EvictionData {
  censustract: string;
  eviction_rate: number;
  eviction_filings: number;
  renter_occupied_households: number;
  year: number;
}

export interface EnvironmentalData {
  censustract: string;
  ej_index: number;
  pm25: number;
  ozone: number;
  diesel_pm: number;
  air_toxics_respiratory_hi: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface CityConfig {
  name: string;
  slug: string;
  state: string;
  bounds: MapBounds;
  center: [number, number];
  zoom: number;
}

export interface MapLayer {
  id: string;
  name: string;
  description: string;
  active: boolean;
  color: string;
  opacity: number;
  dataType: 'holc' | 'mortgage' | 'demographics' | 'evictions' | 'environmental' | 'uploaded';
}

export interface UploadedGeoJSONLayer {
  id: string;
  name: string;
  description?: string;
  data: GeoJSON.FeatureCollection;
  color: string;
  opacity: number;
  active: boolean;
  uploadedAt: Date;
}