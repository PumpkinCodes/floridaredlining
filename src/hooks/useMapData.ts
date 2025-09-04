import { useQuery } from '@tanstack/react-query';
import { dataService } from '@/services/dataService';
import type { 
  MortgageData, 
  DemographicData, 
  EvictionData, 
  EnvironmentalData 
} from '@/types/map';

export const useHOLCData = (citySlug: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['holc-data', citySlug],
    queryFn: () => dataService.fetchHOLCData(citySlug),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!citySlug && enabled
  });
};

export const useMortgageData = (citySlug: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['mortgage-data', citySlug],
    queryFn: () => dataService.fetchMortgageData(citySlug),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!citySlug && enabled
  });
};

export const useDemographicData = (citySlug: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['demographic-data', citySlug],
    queryFn: () => dataService.fetchDemographicData(citySlug),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!citySlug && enabled
  });
};

export const useEvictionData = (citySlug: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['eviction-data', citySlug],
    queryFn: () => dataService.fetchEvictionData(citySlug),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!citySlug && enabled
  });
};

export const useEnvironmentalData = (citySlug: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['environmental-data', citySlug], 
    queryFn: () => dataService.fetchEnvironmentalData(citySlug),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!citySlug && enabled
  });
};

export const useAllMapData = (citySlug: string, activeDataTypes: string[] = []) => {
  const holcQuery = useHOLCData(citySlug, activeDataTypes.includes('holc'));
  const mortgageQuery = useMortgageData(citySlug, activeDataTypes.includes('mortgage'));
  const demographicQuery = useDemographicData(citySlug, activeDataTypes.includes('demographics'));
  const evictionQuery = useEvictionData(citySlug, activeDataTypes.includes('evictions'));
  const environmentalQuery = useEnvironmentalData(citySlug, activeDataTypes.includes('environmental'));

  return {
    holcData: holcQuery.data,
    mortgageData: mortgageQuery.data,
    demographicData: demographicQuery.data,
    evictionData: evictionQuery.data,
    environmentalData: environmentalQuery.data,
    isLoading: holcQuery.isLoading || mortgageQuery.isLoading || 
               demographicQuery.isLoading || evictionQuery.isLoading || 
               environmentalQuery.isLoading,
    error: holcQuery.error || mortgageQuery.error || 
           demographicQuery.error || evictionQuery.error || 
           environmentalQuery.error
  };
};