import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { citySlug } = await req.json();
    
    console.log(`Fetching demographic data for city: ${citySlug}`);

    // Mock demographic data - in real implementation would fetch from Census ACS API
    const mockData = [
      {
        censustract: `${getCityFipsCode(citySlug)}001100`,
        median_income: 78000,
        percent_white: 52.3,
        percent_black: 28.7,
        percent_hispanic: 12.4,
        percent_asian: 6.6,
        homeownership_rate_white: 72.1,
        homeownership_rate_black: 45.2,
        homeownership_rate_hispanic: 54.8,
        homeownership_rate_asian: 68.9
      },
      {
        censustract: `${getCityFipsCode(citySlug)}001200`,
        median_income: 65000,
        percent_white: 38.9,
        percent_black: 42.1,
        percent_hispanic: 15.2,
        percent_asian: 3.8,
        homeownership_rate_white: 68.4,
        homeownership_rate_black: 38.7,
        homeownership_rate_hispanic: 49.3,
        homeownership_rate_asian: 71.2
      },
      {
        censustract: `${getCityFipsCode(citySlug)}001300`,
        median_income: 52000,
        percent_white: 22.1,
        percent_black: 58.3,
        percent_hispanic: 17.8,
        percent_asian: 1.8,
        homeownership_rate_white: 61.2,
        homeownership_rate_black: 32.5,
        homeownership_rate_hispanic: 42.1,
        homeownership_rate_asian: 65.8
      },
      {
        censustract: `${getCityFipsCode(citySlug)}001400`,
        median_income: 41000,
        percent_white: 15.7,
        percent_black: 67.2,
        percent_hispanic: 15.9,
        percent_asian: 1.2,
        homeownership_rate_white: 55.8,
        homeownership_rate_black: 28.3,
        homeownership_rate_hispanic: 35.7,
        homeownership_rate_asian: 58.4
      }
    ];

    return new Response(JSON.stringify(mockData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-demographic-data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getCityFipsCode(citySlug: string): string {
  const fipsCodes: Record<string, string> = {
    'atlanta': '13089',
    'baltimore': '24510',
    'boston': '25025', 
    'chicago': '17031',
    'cleveland': '39035',
    'detroit': '26163',
    'los-angeles': '06037',
    'new-york': '36061',
    'philadelphia': '42101',
    'san-francisco': '06075'
  };
  
  return fipsCodes[citySlug] || '13089';
}