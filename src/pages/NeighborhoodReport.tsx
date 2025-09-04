import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, FileText, Download, Share2 } from "lucide-react";

// Mock geocoding and data - in real app would use Google Maps API
const mockNeighborhoodData = {
  address: "123 Main Street, Chicago, IL 60614",
  neighborhood: "Lincoln Park",
  city: "Chicago",
  state: "IL",
  holcGrade: "A",
  holcDescription: "Best - Homogeneous area with business and professional families",
  holcYear: "1937",
  demographics: {
    totalPopulation: "12,847",
    blackPercent: "8.2%",
    latinoPercent: "15.3%",
    whitePercent: "71.4%",
    asianPercent: "5.1%"
  },
  housing: {
    medianIncome: "$89,400",
    homeownershipRate: "68.5%",
    medianHomeValue: "$425,000",
    rentBurden: "28.3%"
  },
  lending: {
    mortgageDenialRate: "8.2%",
    mortgageDenialRateBlack: "15.1%",
    mortgageDenialRateLatino: "12.4%",
    mortgageDenialRateWhite: "6.8%"
  },
  environment: {
    ejIndex: "32",
    airQualityIndex: "Good",
    greenSpaceAccess: "High"
  }
};

export default function NeighborhoodReport() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [hasSearched, setHasSearched] = useState(!!searchParams.get('q'));
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setHasSearched(true);
      setIsLoading(false);
    }, 1500);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-data-low text-white";
      case "B": return "bg-data-medium text-white";
      case "C": return "bg-data-high text-white";
      case "D": return "bg-data-critical text-white";
      default: return "bg-muted";
    }
  };

  const getGradeDescription = (grade: string) => {
    switch (grade) {
      case "A": return "Best - Low risk for lenders";
      case "B": return "Still Desirable - Moderate risk";
      case "C": return "Declining - Higher risk";
      case "D": return "Hazardous - Highest risk, often redlined";
      default: return "Unknown";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Neighborhood Report</h1>
          <p className="text-muted-foreground text-lg">
            Enter any address to discover how historical redlining continues to impact your neighborhood today.
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Address Lookup
            </CardTitle>
            <CardDescription>
              Enter a street address, neighborhood, or ZIP code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="123 Main Street, Chicago, IL"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !searchQuery.trim()}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {hasSearched && !isLoading && (
          <>
            {/* Report Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">{mockNeighborhoodData.address}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{mockNeighborhoodData.neighborhood}, {mockNeighborhoodData.city}, {mockNeighborhoodData.state}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Historical Context */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Historical Redlining Classification
                </CardTitle>
                <CardDescription>
                  How this neighborhood was classified in {mockNeighborhoodData.holcYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <Badge className={`text-lg px-4 py-2 ${getGradeColor(mockNeighborhoodData.holcGrade)}`}>
                      Grade {mockNeighborhoodData.holcGrade}
                    </Badge>
                    <div className="text-xs text-muted-foreground text-center">
                      HOLC Rating
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{getGradeDescription(mockNeighborhoodData.holcGrade)}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {mockNeighborhoodData.holcDescription}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Demographics</CardTitle>
                  <CardDescription>Current neighborhood composition</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard
                      title="Total Population"
                      value={mockNeighborhoodData.demographics.totalPopulation}
                      className="border-none shadow-none bg-muted/30"
                    />
                    <StatCard
                      title="White Residents"
                      value={mockNeighborhoodData.demographics.whitePercent}
                      className="border-none shadow-none bg-muted/30"
                    />
                    <StatCard
                      title="Black Residents"
                      value={mockNeighborhoodData.demographics.blackPercent}
                      className="border-none shadow-none bg-muted/30"
                    />
                    <StatCard
                      title="Latino Residents"
                      value={mockNeighborhoodData.demographics.latinoPercent}
                      className="border-none shadow-none bg-muted/30"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Housing & Economics</CardTitle>
                  <CardDescription>Key housing indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StatCard
                    title="Median Income"
                    value={mockNeighborhoodData.housing.medianIncome}
                    severity="low"
                    className="border-none shadow-none bg-muted/30"
                  />
                  <StatCard
                    title="Homeownership Rate"
                    value={mockNeighborhoodData.housing.homeownershipRate}
                    severity="low"
                    className="border-none shadow-none bg-muted/30"
                  />
                  <StatCard
                    title="Median Home Value"
                    value={mockNeighborhoodData.housing.medianHomeValue}
                    className="border-none shadow-none bg-muted/30"
                  />
                  <StatCard
                    title="Rent Burden"
                    value={mockNeighborhoodData.housing.rentBurden}
                    description="% of income spent on housing"
                    severity="medium"
                    className="border-none shadow-none bg-muted/30"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Lending Disparities */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Mortgage Lending Patterns</CardTitle>
                <CardDescription>
                  Current mortgage denial rates by race/ethnicity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Overall Denial Rate"
                    value={mockNeighborhoodData.lending.mortgageDenialRate}
                    severity="low"
                    className="border-none shadow-none bg-muted/30"
                  />
                  <StatCard
                    title="White Applicants"
                    value={mockNeighborhoodData.lending.mortgageDenialRateWhite}
                    severity="low"
                    className="border-none shadow-none bg-muted/30"
                  />
                  <StatCard
                    title="Black Applicants"
                    value={mockNeighborhoodData.lending.mortgageDenialRateBlack}
                    severity="high"
                    className="border-none shadow-none bg-muted/30"
                  />
                  <StatCard
                    title="Latino Applicants"
                    value={mockNeighborhoodData.lending.mortgageDenialRateLatino}
                    severity="medium"
                    className="border-none shadow-none bg-muted/30"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Environmental Justice */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Environmental Conditions</CardTitle>
                <CardDescription>
                  Environmental justice and quality of life indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    title="EJ Index Score"
                    value={mockNeighborhoodData.environment.ejIndex}
                    description="EPA Environmental Justice Index (0-100)"
                    severity="low"
                    className="border-none shadow-none bg-muted/30"
                  />
                  <StatCard
                    title="Air Quality"
                    value={mockNeighborhoodData.environment.airQualityIndex}
                    severity="low"
                    className="border-none shadow-none bg-muted/30"
                  />
                  <StatCard
                    title="Green Space Access"
                    value={mockNeighborhoodData.environment.greenSpaceAccess}
                    severity="low"
                    className="border-none shadow-none bg-muted/30"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Summary Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">AI</span>
                  </div>
                  Neighborhood Analysis Summary
                </CardTitle>
                <CardDescription>Key findings for this location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-foreground leading-relaxed">
                    This neighborhood in {mockNeighborhoodData.neighborhood} was historically classified as Grade {mockNeighborhoodData.holcGrade} 
                    ("{getGradeDescription(mockNeighborhoodData.holcGrade).split(' - ')[0]}") by the HOLC in {mockNeighborhoodData.holcYear}. 
                    Today, it shows relatively favorable conditions with a median income of {mockNeighborhoodData.housing.medianIncome} 
                    and homeownership rate of {mockNeighborhoodData.housing.homeownershipRate}. However, disparities in mortgage 
                    lending persist, with Black applicants facing denial rates of {mockNeighborhoodData.lending.mortgageDenialRateBlack} 
                    compared to {mockNeighborhoodData.lending.mortgageDenialRateWhite} for White applicants.
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Badge variant="secondary">Historical Grade {mockNeighborhoodData.holcGrade}</Badge>
                  <Badge variant="secondary">Current Analysis</Badge>
                  <Badge variant="secondary">Lending Disparities</Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Empty State */}
        {!hasSearched && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Enter an Address to Begin</h3>
              <p className="text-muted-foreground">
                Search for any address in the United States to see its historical redlining classification 
                and current housing inequality data.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}