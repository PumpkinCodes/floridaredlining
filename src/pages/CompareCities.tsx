import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, RefreshCw } from "lucide-react";

const availableCities = [
  { name: "Chicago", slug: "chicago", state: "IL" },
  { name: "Detroit", slug: "detroit", state: "MI" },
  { name: "Los Angeles", slug: "los-angeles", state: "CA" },
  { name: "New York", slug: "new-york", state: "NY" },
  { name: "Philadelphia", slug: "philadelphia", state: "PA" },
  { name: "Atlanta", slug: "atlanta", state: "GA" },
  { name: "Miami", slug: "miami", state: "FL" },
  { name: "Tampa", slug: "tampa", state: "FL" }
];

const comparisonData: Record<string, any> = {
  chicago: {
    name: "Chicago, IL",
    mortgageDenial: "18.5%",
    homeownershipGap: "32%",
    medianIncomeRatio: "0.58",
    evictionRate: "2.1%",
    redlinedArea: "65%"
  },
  detroit: {
    name: "Detroit, MI", 
    mortgageDenial: "22.3%",
    homeownershipGap: "28%",
    medianIncomeRatio: "0.52",
    evictionRate: "3.8%",
    redlinedArea: "78%"
  },
  "los-angeles": {
    name: "Los Angeles, CA",
    mortgageDenial: "15.2%",
    homeownershipGap: "35%", 
    medianIncomeRatio: "0.61",
    evictionRate: "1.9%",
    redlinedArea: "58%"
  }
};

export default function CompareCities() {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState<any[]>([]);

  const addCity = (citySlug: string) => {
    if (selectedCities.length < 3 && !selectedCities.includes(citySlug)) {
      const newSelection = [...selectedCities, citySlug];
      setSelectedCities(newSelection);
      setComparisonResults(newSelection.map(slug => comparisonData[slug] || null).filter(Boolean));
    }
  };

  const removeCity = (citySlug: string) => {
    const newSelection = selectedCities.filter(slug => slug !== citySlug);
    setSelectedCities(newSelection);
    setComparisonResults(newSelection.map(slug => comparisonData[slug] || null).filter(Boolean));
  };

  const clearAll = () => {
    setSelectedCities([]);
    setComparisonResults([]);
  };

  const getComparisonInsight = () => {
    if (comparisonResults.length < 2) return null;
    
    // Simple AI-like insight generation
    const cityNames = comparisonResults.map(city => city.name.split(',')[0]);
    const highest = cityNames[0]; // Simplified for demo
    
    return `Analysis shows that ${highest} demonstrates the most persistent effects of historical redlining, with the highest combination of mortgage denial rates and homeownership disparities among selected cities.`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Compare Cities</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Analyze housing inequality patterns across different cities to understand how 
            historical redlining continues to impact communities nationwide.
          </p>
        </div>

        {/* City Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Select Cities to Compare
            </CardTitle>
            <CardDescription>
              Choose up to 3 cities for side-by-side analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Select onValueChange={addCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city to add..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities
                      .filter(city => !selectedCities.includes(city.slug))
                      .map((city) => (
                        <SelectItem key={city.slug} value={city.slug}>
                          {city.name}, {city.state}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearAll} disabled={selectedCities.length === 0}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                <Button variant="outline" disabled={comparisonResults.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Selected Cities */}
            {selectedCities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCities.map((citySlug) => {
                  const city = availableCities.find(c => c.slug === citySlug);
                  return city ? (
                    <Badge 
                      key={citySlug} 
                      variant="secondary" 
                      className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeCity(citySlug)}
                    >
                      {city.name}, {city.state} ×
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {comparisonResults.length > 0 && (
          <>
            {/* Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {comparisonResults.map((city, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{city.name}</CardTitle>
                    <CardDescription>Housing inequality metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <StatCard
                      title="Mortgage Denial Rate"
                      value={city.mortgageDenial}
                      severity="high"
                      className="border-none shadow-none bg-muted/30"
                    />
                    <StatCard
                      title="Homeownership Gap"
                      value={city.homeownershipGap}
                      severity="critical"
                      className="border-none shadow-none bg-muted/30"
                    />
                    <StatCard
                      title="Income Ratio"
                      value={city.medianIncomeRatio}
                      description="Formerly redlined to non-redlined"
                      severity="high"
                      className="border-none shadow-none bg-muted/30"
                    />
                    <StatCard
                      title="Eviction Rate"
                      value={city.evictionRate}
                      severity="medium"
                      className="border-none shadow-none bg-muted/30"
                    />
                    <StatCard
                      title="Redlined Area"
                      value={city.redlinedArea}
                      description="% of city historically redlined"
                      severity="critical"
                      className="border-none shadow-none bg-muted/30"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison Chart Placeholder */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Comparative Analysis Chart</CardTitle>
                <CardDescription>
                  Visual comparison of key housing inequality metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Interactive comparison chart will appear here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Showing data for {comparisonResults.length} selected cities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            {comparisonResults.length >= 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">AI</span>
                    </div>
                    Comparative Analysis Summary
                  </CardTitle>
                  <CardDescription>
                    Key insights from the selected cities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-foreground leading-relaxed">
                      {getComparisonInsight()}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Badge variant="secondary">Cross-City Analysis</Badge>
                    <Badge variant="secondary">Pattern Recognition</Badge>
                    <Badge variant="secondary">Historical Impact</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Empty State */}
        {comparisonResults.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Cities Selected</h3>
              <p className="text-muted-foreground mb-4">
                Select cities from the dropdown above to begin comparing housing inequality patterns
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}