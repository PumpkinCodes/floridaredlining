import { supabase } from '@/integrations/supabase/client';
import type { 
  HOLCPolygon, 
  MortgageData, 
  DemographicData, 
  EvictionData, 
  EnvironmentalData,
  CityConfig 
} from '@/types/map';

export class DataService {
  private static instance: DataService;

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // City configurations
  public getCityConfigs(): CityConfig[] {
    return [
      {
        name: 'Atlanta',
        slug: 'atlanta',
        state: 'GA',
        bounds: { north: 33.9, south: 33.6, east: -84.2, west: -84.7 },
        center: [-84.39, 33.75],
        zoom: 11
      },
      {
        name: 'Baltimore', 
        slug: 'baltimore',
        state: 'MD',
        bounds: { north: 39.4, south: 39.2, east: -76.4, west: -76.8 },
        center: [-76.61, 39.29],
        zoom: 11
      },
      {
        name: 'Boston',
        slug: 'boston', 
        state: 'MA',
        bounds: { north: 42.4, south: 42.2, east: -70.9, west: -71.3 },
        center: [-71.06, 42.36],
        zoom: 11
      },
      {
        name: 'Chicago',
        slug: 'chicago',
        state: 'IL', 
        bounds: { north: 42.0, south: 41.6, east: -87.5, west: -87.9 },
        center: [-87.63, 41.88],
        zoom: 10
      },
      {
        name: 'Cleveland',
        slug: 'cleveland',
        state: 'OH',
        bounds: { north: 41.6, south: 41.3, east: -81.4, west: -81.9 },
        center: [-81.69, 41.50],
        zoom: 11
      },
      {
        name: 'Detroit',
        slug: 'detroit',
        state: 'MI',
        bounds: { north: 42.5, south: 42.1, east: -82.9, west: -83.3 },
        center: [-83.05, 42.33],
        zoom: 11
      },
      {
        name: 'Los Angeles',
        slug: 'los-angeles', 
        state: 'CA',
        bounds: { north: 34.3, south: 33.7, east: -118.1, west: -118.7 },
        center: [-118.24, 34.05],
        zoom: 10
      },
      {
        name: 'New York',
        slug: 'new-york',
        state: 'NY',
        bounds: { north: 40.9, south: 40.5, east: -73.7, west: -74.3 },
        center: [-73.99, 40.73],
        zoom: 11
      },
      {
        name: 'Philadelphia',
        slug: 'philadelphia',
        state: 'PA', 
        bounds: { north: 40.1, south: 39.9, east: -75.0, west: -75.3 },
        center: [-75.17, 39.95],
        zoom: 11
      },
      {
        name: 'San Francisco',
        slug: 'san-francisco',
        state: 'CA',
        bounds: { north: 37.9, south: 37.6, east: -122.3, west: -122.6 },
        center: [-122.42, 37.77],
        zoom: 12
      },
      {
        name: 'Miami',
        slug: 'miami',
        state: 'FL',
        bounds: { north: 25.85, south: 25.65, east: -80.15, west: -80.35 },
        center: [-80.25, 25.75],
        zoom: 11
      },
      {
        name: 'Tampa',
        slug: 'tampa', 
        state: 'FL',
        bounds: { north: 28.05, south: 27.85, east: -82.35, west: -82.55 },
        center: [-82.45, 27.95],
        zoom: 11
      }
    ];
  }

  public getCityConfig(citySlug: string): CityConfig | null {
    return this.getCityConfigs().find(city => city.slug === citySlug) || null;
  }

  // Data fetching methods using Supabase Edge Functions
  public async fetchHOLCData(citySlug: string): Promise<GeoJSON.FeatureCollection> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-holc-data', {
        body: { citySlug }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching HOLC data:', error);
      return this.getMockHOLCData(citySlug);
    }
  }

  public async fetchMortgageData(citySlug: string): Promise<MortgageData[]> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-mortgage-data', {
        body: { citySlug }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching mortgage data:', error);
      return this.getMockMortgageData();
    }
  }

  public async fetchDemographicData(citySlug: string): Promise<DemographicData[]> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-demographic-data', {
        body: { citySlug }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching demographic data:', error);
      return this.getMockDemographicData();
    }
  }

  public async fetchEvictionData(citySlug: string): Promise<EvictionData[]> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-eviction-data', {
        body: { citySlug }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching eviction data:', error);
      return this.getMockEvictionData();
    }
  }

  public async fetchEnvironmentalData(citySlug: string): Promise<EnvironmentalData[]> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-environmental-data', {
        body: { citySlug }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching environmental data:', error);
      return this.getMockEnvironmentalData();
    }
  }

  // Mock data methods for fallback
  private getMockHOLCData(citySlug: string): GeoJSON.FeatureCollection {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            grade: 'A',
            neighborhood: 'Downtown',
            description: 'Best residential area'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[[-84.4, 33.7], [-84.3, 33.7], [-84.3, 33.8], [-84.4, 33.8], [-84.4, 33.7]]]
          }
        }
      ]
    };
  }

  private getMockMortgageData(): MortgageData[] {
    return [
      {
        censustract: '13089001100',
        denial_rate_white: 0.08,
        denial_rate_black: 0.15,
        denial_rate_hispanic: 0.12,
        denial_rate_asian: 0.06,
        total_applications: 450
      }
    ];
  }

  private getMockDemographicData(): DemographicData[] {
    return [
      {
        censustract: '13089001100',
        median_income: 65000,
        percent_white: 45.2,
        percent_black: 32.1,
        percent_hispanic: 15.3,
        percent_asian: 7.4,
        homeownership_rate_white: 68.5,
        homeownership_rate_black: 42.3,
        homeownership_rate_hispanic: 51.2,
        homeownership_rate_asian: 72.1
      }
    ];
  }

  private getMockEvictionData(): EvictionData[] {
    return [
      {
        censustract: '13089001100',
        eviction_rate: 3.2,
        eviction_filings: 125,
        renter_occupied_households: 3900,
        year: 2023
      }
    ];
  }

  private getMockEnvironmentalData(): EnvironmentalData[] {
    return [
      {
        censustract: '13089001100',
        ej_index: 0.65,
        pm25: 12.3,
        ozone: 0.068,
        diesel_pm: 2.1,
        air_toxics_respiratory_hi: 0.8
      }
    ];
  }
}

export const dataService = DataService.getInstance();