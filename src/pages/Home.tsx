import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer } from "@/components/MapContainer";
import { StatCard } from "@/components/StatCard";
import { Search, MapPin, BarChart3, Users, Home as HomeIcon } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const featuredCities = [
  { name: "Chicago", slug: "chicago", population: "2.7M", disparity: "High" },
  { name: "Detroit", slug: "detroit", population: "639K", disparity: "Critical" },
  { name: "Los Angeles", slug: "los-angeles", population: "3.9M", disparity: "High" },
  { name: "New York", slug: "new-york", population: "8.3M", disparity: "Medium" },
];

const allCities = [
  { name: "Atlanta", slug: "atlanta", population: "499K", disparity: "High" },
  { name: "Baltimore", slug: "baltimore", population: "586K", disparity: "Critical" },
  { name: "Boston", slug: "boston", population: "696K", disparity: "High" },
  { name: "Chicago", slug: "chicago", population: "2.7M", disparity: "High" },
  { name: "Cleveland", slug: "cleveland", population: "384K", disparity: "Critical" },
  { name: "Detroit", slug: "detroit", population: "639K", disparity: "Critical" },
  { name: "Los Angeles", slug: "los-angeles", population: "3.9M", disparity: "High" },
  { name: "New York", slug: "new-york", population: "8.3M", disparity: "Medium" },
  { name: "Philadelphia", slug: "philadelphia", population: "1.6M", disparity: "High" },
  { name: "San Francisco", slug: "san-francisco", population: "874K", disparity: "High" },
];

const keyStats = [
  {
    title: "Cities Analyzed",
    value: "200+",
    description: "Comprehensive coverage across the United States",
    severity: "low" as const
  },
  {
    title: "Neighborhoods Affected",
    value: "15,000+",
    description: "Historical redlining districts mapped",
    severity: "high" as const
  },
  {
    title: "Current Disparities",
    value: "85%",
    description: "Of formerly redlined areas still show inequality",
    severity: "critical" as const
  },
  {
    title: "Data Sources",
    value: "5+",
    description: "Government and academic databases integrated",
    severity: "medium" as const
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/neighborhood-report?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getSeverityColor = (disparity: string) => {
    switch (disparity.toLowerCase()) {
      case "critical": return "bg-data-critical text-data-critical-foreground";
      case "high": return "bg-data-high text-white";
      case "medium": return "bg-data-medium text-white";
      default: return "bg-data-low text-white";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-secondary overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90" />
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Redlining: Then vs Now
            </h1>
            <p className="text-xl lg:text-2xl mb-4 text-white/90">
              Explore the history of redlining in America
            </p>
            <p className="text-lg mb-12 text-white/80 max-w-2xl mx-auto">
              Explore how 1930s redlining practices continue to shape housing inequality, 
              mortgage access, and neighborhood conditions across American cities today.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-8">
              <div className="flex gap-2 bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
                <Input
                  type="text"
                  placeholder="Enter your city or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-white placeholder:text-white/60 focus-visible:ring-white/30"
                />
                <Button type="submit" variant="secondary" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => navigate("/compare")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Compare Cities
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => navigate("/about")}
              >
                <Users className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Scale of Housing Inequality</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive data analysis reveals the lasting impact of discriminatory housing policies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyStats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                severity={stat.severity}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Cities Across America</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Click on any city to dive deep into its redlining history and current housing inequality data
            </p>
          </div>
          
          <MapContainer showLayerToggle={false} className="mb-12" />
          
          {/* Featured Cities Grid */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 text-center">Featured Cities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCities.map((city) => (
                <Card 
                  key={city.slug} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/cities/${city.slug}`)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {city.name}
                      </CardTitle>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(city.disparity)}`}>
                        {city.disparity}
                      </div>
                    </div>
                    <CardDescription>{city.population} residents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      View Analysis
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Cities Grid */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center">Browse All Cities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {allCities.map((city) => (
                <Card 
                  key={city.slug} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/cities/${city.slug}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {city.name}
                      </CardTitle>
                      <div className={`px-1.5 py-0.5 rounded text-xs ${getSeverityColor(city.disparity)}`}>
                        {city.disparity}
                      </div>
                    </div>
                    <CardDescription className="text-xs">{city.population}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Understand Your Neighborhood</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Get a detailed report on how historical redlining affects your community today
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate("/neighborhood-report")}
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Get Neighborhood Report
          </Button>
        </div>
      </section>
    </div>
  );
}