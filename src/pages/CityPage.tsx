import { useParams } from "react-router-dom";
import { MapContainer } from "@/components/MapContainer";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Download, Share2, TrendingUp } from "lucide-react";

// Mock data - in real app, this would come from APIs
const cityData: Record<string, any> = {
  atlanta: {
    name: "Atlanta",
    state: "Georgia",
    population: "498,715",
    overview: "Atlanta's redlining legacy is most visible in the Sweet Auburn district and surrounding neighborhoods, where historic Black wealth was concentrated yet systematically undermined by discriminatory practices.",
    stats: [
      {
        title: "Mortgage Denial Rate",
        value: "22.3%",
        change: "+1.8%",
        trend: "up" as const,
        description: "Particularly high in formerly redlined areas",
        severity: "high" as const
      },
      {
        title: "Homeownership Gap",
        value: "38%",
        description: "Difference between white and Black homeownership",
        severity: "critical" as const
      },
      {
        title: "Median Income Ratio",
        value: "0.51",
        description: "Formerly redlined to non-redlined areas",
        severity: "critical" as const
      },
      {
        title: "Gentrification Rate",
        value: "28%",
        change: "+5.2%",
        trend: "up" as const,
        description: "Neighborhoods experiencing rapid change",
        severity: "high" as const
      }
    ],
    neighborhoods: [
      { name: "Sweet Auburn", grade: "D", status: "Historic Black district" },
      { name: "Vine City", grade: "D", status: "Critical disparities" },
      { name: "Buckhead", grade: "A", status: "Affluent area" },
      { name: "Virginia-Highland", grade: "B", status: "Gentrifying" },
      { name: "East Atlanta", grade: "C", status: "Mixed conditions" }
    ],
    aiInsight: "Atlanta's redlining patterns created a stark north-south divide that persists today. The Sweet Auburn district, once the center of Black business and culture, was systematically disinvested while northern neighborhoods flourished. Current gentrification threatens to further displace long-term residents from historically Black neighborhoods."
  },
  baltimore: {
    name: "Baltimore",
    state: "Maryland",
    population: "585,708",
    overview: "Baltimore had one of the most extensive redlining programs in the country, affecting over 75% of the city's neighborhoods and creating patterns of segregation that persist today.",
    stats: [
      {
        title: "Mortgage Denial Rate",
        value: "25.7%",
        change: "+3.1%",
        trend: "up" as const,
        description: "One of the highest rates nationally",
        severity: "critical" as const
      },
      {
        title: "Homeownership Gap",
        value: "41%",
        description: "Difference between white and Black homeownership",
        severity: "critical" as const
      },
      {
        title: "Vacant Properties",
        value: "16,000+",
        description: "Concentrated in formerly redlined areas",
        severity: "critical" as const
      },
      {
        title: "Life Expectancy Gap",
        value: "20 years",
        description: "Between highest and lowest neighborhoods",
        severity: "critical" as const
      }
    ],
    neighborhoods: [
      { name: "East Baltimore", grade: "D", status: "Severe disinvestment" },
      { name: "West Baltimore", grade: "D", status: "Critical needs" },
      { name: "Sandtown-Winchester", grade: "D", status: "High vacancy" },
      { name: "Federal Hill", grade: "A", status: "Gentrification" },
      { name: "Canton", grade: "B", status: "Revitalization" }
    ],
    aiInsight: "Baltimore's extensive redlining created some of the most severe urban inequality in America. Formerly redlined neighborhoods show dramatically higher rates of vacancy, lower life expectancy, and limited access to credit. The city's 'Two Baltimores' reflect this historical divide between east/west and north/south."
  },
  boston: {
    name: "Boston",
    state: "Massachusetts",
    population: "695,506",
    overview: "Boston's redlining concentrated in Roxbury, Dorchester, and South End created lasting patterns of racial and economic segregation in one of America's oldest cities.",
    stats: [
      {
        title: "Mortgage Denial Rate",
        value: "16.2%",
        change: "+1.1%",
        trend: "up" as const,
        description: "Varies dramatically by neighborhood",
        severity: "high" as const
      },
      {
        title: "Homeownership Gap",
        value: "35%",
        description: "Difference between white and Black homeownership",
        severity: "critical" as const
      },
      {
        title: "Median Home Value Gap",
        value: "2.3x",
        description: "Non-redlined vs formerly redlined areas",
        severity: "high" as const
      },
      {
        title: "Educational Achievement Gap",
        value: "28%",
        description: "College graduation rate difference",
        severity: "high" as const
      }
    ],
    neighborhoods: [
      { name: "Roxbury", grade: "D", status: "Historic center of Black community" },
      { name: "Dorchester", grade: "C", status: "Diverse, improving" },
      { name: "South End", grade: "B", status: "Gentrified Victorian district" },
      { name: "Back Bay", grade: "A", status: "Affluent core" },
      { name: "Beacon Hill", grade: "A", status: "Historic wealth" }
    ],
    aiInsight: "Boston's redlining reinforced centuries-old patterns of exclusion, concentrating Black residents in Roxbury while preserving white enclaves in Back Bay and Beacon Hill. Despite significant gentrification in formerly redlined areas, wealth gaps persist and displacement pressures have intensified."
  },
  chicago: {
    name: "Chicago",
    state: "Illinois",
    population: "2,746,388",
    overview: "Chicago shows persistent patterns of housing inequality stemming from extensive 1930s redlining practices that covered over 60% of the city.",
    stats: [
      {
        title: "Mortgage Denial Rate",
        value: "18.5%",
        change: "+2.3%",
        trend: "up" as const,
        description: "Higher in formerly redlined areas",
        severity: "high" as const
      },
      {
        title: "Homeownership Gap",
        value: "32%",
        description: "Difference between white and Black homeownership",
        severity: "critical" as const
      },
      {
        title: "Median Income Ratio",
        value: "0.58",
        description: "Formerly redlined to non-redlined areas",
        severity: "high" as const
      },
      {
        title: "Eviction Rate",
        value: "2.1%",
        change: "-0.3%",
        trend: "down" as const,
        description: "Annual eviction rate",
        severity: "medium" as const
      }
    ],
    neighborhoods: [
      { name: "South Side", grade: "D", status: "Critical disparities" },
      { name: "West Side", grade: "D", status: "High inequality" },
      { name: "North Side", grade: "A", status: "Limited impact" },
      { name: "Loop", grade: "A", status: "Gentrification" }
    ],
    aiInsight: "Chicago's South and West sides, historically redlined as 'hazardous' (Grade D), continue to experience significantly higher mortgage denial rates (25% vs 8% citywide average) and lower homeownership rates. Environmental justice concerns are also prevalent, with these areas showing higher pollution exposure and fewer green spaces."
  },
  cleveland: {
    name: "Cleveland",
    state: "Ohio",
    population: "383,793",
    overview: "Cleveland's industrial decline compounded the effects of redlining, creating some of the most severe urban disinvestment in the Rust Belt region.",
    stats: [
      {
        title: "Mortgage Denial Rate",
        value: "28.4%",
        change: "+4.2%",
        trend: "up" as const,
        description: "Highest in the region",
        severity: "critical" as const
      },
      {
        title: "Population Loss",
        value: "-65%",
        description: "Since 1950 peak population",
        severity: "critical" as const
      },
      {
        title: "Vacant Properties",
        value: "25%",
        description: "Of all residential properties",
        severity: "critical" as const
      },
      {
        title: "Median Income Ratio",
        value: "0.43",
        description: "Formerly redlined to non-redlined areas",
        severity: "critical" as const
      }
    ],
    neighborhoods: [
      { name: "Hough", grade: "D", status: "Severe disinvestment" },
      { name: "Central", grade: "D", status: "High poverty" },
      { name: "Glenville", grade: "D", status: "Population loss" },
      { name: "University Circle", grade: "A", status: "Institutional anchor" },
      { name: "Ohio City", grade: "B", status: "Revitalizing" }
    ],
    aiInsight: "Cleveland exemplifies how redlining and industrial decline can create compounding urban challenges. Formerly redlined neighborhoods lost over 70% of their population, creating vast areas of vacancy and disinvestment. Recent revitalization efforts have focused on anchor institutions but haven't reached most affected communities."
  },
  detroit: {
    name: "Detroit",
    state: "Michigan",
    population: "639,111",
    overview: "Detroit's combination of extensive redlining and automotive industry decline created unprecedented urban challenges, with formerly redlined areas bearing the greatest impact.",
    stats: [
      {
        title: "Mortgage Denial Rate",
        value: "31.2%",
        change: "+2.8%",
        trend: "up" as const,
        description: "Limited conventional lending",
        severity: "critical" as const
      },
      {
        title: "Population Loss",
        value: "-64%",
        description: "Since 1950 peak of 1.8M",
        severity: "critical" as const
      },
      {
        title: "Vacant Land",
        value: "40 sq mi",
        description: "Equivalent to entire city of San Francisco",
        severity: "critical" as const
      },
      {
        title: "Homeownership Gap",
        value: "25%",
        description: "Difference between white and Black homeownership",
        severity: "high" as const
      }
    ],
    neighborhoods: [
      { name: "Eight Mile", grade: "D", status: "Severe abandonment" },
      { name: "Corktown", grade: "C", status: "Gentrification pressures" },
      { name: "Midtown", grade: "B", status: "Revitalization zone" },
      { name: "Downtown", grade: "A", status: "Corporate investment" },
      { name: "Paradise Valley", grade: "D", status: "Historic Black district" }
    ],
    aiInsight: "Detroit represents the extreme outcome of redlining combined with economic collapse. Formerly redlined neighborhoods experienced near-total disinvestment, creating a landscape of vacancy and abandonment. Recent downtown revitalization has created stark contrasts with surrounding communities still struggling with the legacy of discriminatory policies."
  },
  "los-angeles": {
    name: "Los Angeles",
    state: "California",
    population: "3,898,747",
    overview: "Los Angeles had unique redlining patterns due to its rapid 20th-century growth, with discrimination affecting Latino and Asian communities alongside African Americans across vast suburban areas.",
    stats: [
      {
        title: "Mortgage Denial Rate",
        value: "14.8%",
        change: "+0.9%",
        trend: "up" as const,
        description: "Varies by ethnic composition",
        severity: "medium" as const
      },
      {
        title: "Housing Cost Burden",
        value: "56%",
        description: "Households paying >30% income on housing",
        severity: "critical" as const
      },
      {
        title: "Homeownership Gap",
        value: "29%",
        description: "White vs Latino homeownership rates",
        severity: "high" as const
      },
      {
        title: "Gentrification Rate",
        value: "32%",
        change: "+7.1%",
        trend: "up" as const,
        description: "Formerly redlined neighborhoods",
        severity: "high" as const
      }
    ],
    neighborhoods: [
      { name: "South Central", grade: "D", status: "Historic disinvestment" },
      { name: "East LA", grade: "D", status: "Latino cultural center" },
      { name: "Watts", grade: "D", status: "Ongoing challenges" },
      { name: "Beverly Hills", grade: "A", status: "Exclusive enclave" },
      { name: "Santa Monica", grade: "A", status: "Coastal premium" },
      { name: "Boyle Heights", grade: "C", status: "Gentrification resistance" }
    ],
    aiInsight: "Los Angeles's sprawling geography created unique redlining patterns that affected multiple ethnic communities. The current housing crisis disproportionately impacts formerly redlined areas, where families now face displacement pressures despite generations of community investment and cultural development."
  },
  "new-york": {
    name: "New York",
    state: "New York",
    population: "8,336,817",
    overview: "New York's redlining was most pronounced in Brooklyn and the Bronx, creating patterns of disinvestment that contributed to the urban crisis of the 1970s and continue to influence housing inequality today.",
    stats: [
      {
        title: "Mortgage Denial Rate",
        value: "12.4%",
        change: "+0.8%",
        trend: "up" as const,
        description: "Lower overall but stark neighborhood variations",
        severity: "medium" as const
      },
      {
        title: "Rent Burden",
        value: "58%",
        description: "Households paying >30% income on rent",
        severity: "critical" as const
      },
      {
        title: "Homeownership Gap",
        value: "31%",
        description: "White vs Black homeownership rates",
        severity: "critical" as const
      },
      {
        title: "Income Inequality",
        value: "0.57",
        description: "Gini coefficient (higher = more unequal)",
        severity: "high" as const
      }
    ],
    neighborhoods: [
      { name: "Bedford-Stuyvesant", grade: "D", status: "Gentrification pressures" },
      { name: "South Bronx", grade: "D", status: "Recovery ongoing" },
      { name: "Harlem", grade: "C", status: "Historic cultural center" },
      { name: "Manhattan", grade: "A", status: "Global financial center" },
      { name: "Brooklyn Heights", grade: "A", status: "Historic preservation" },
      { name: "Long Island City", grade: "B", status: "Rapid development" }
    ],
    aiInsight: "New York's redlining contributed to the near-collapse of neighborhoods like the South Bronx in the 1970s. While many areas have recovered, the legacy persists in homeownership gaps and affordability crises that disproportionately affect communities of color in formerly redlined areas."
  },
  philadelphia: {
    name: "Philadelphia",
    state: "Pennsylvania",
    population: "1,603,797",
    overview: "Philadelphia's redlining created a stark divide between North and South Philadelphia, with discriminatory practices concentrating poverty and disinvestment in historically Black neighborhoods.",
    stats: [
      {
        title: "Mortgage Denial Rate",
        value: "21.7%",
        change: "+2.1%",
        trend: "up" as const,
        description: "Concentrated in North Philadelphia",
        severity: "high" as const
      },
      {
        title: "Homeownership Gap",
        value: "36%",
        description: "White vs Black homeownership rates",
        severity: "critical" as const
      },
      {
        title: "Poverty Rate Gap",
        value: "24%",
        description: "Formerly redlined vs non-redlined areas",
        severity: "critical" as const
      },
      {
        title: "Educational Achievement Gap",
        value: "31%",
        description: "High school graduation rate difference",
        severity: "high" as const
      }
    ],
    neighborhoods: [
      { name: "North Philadelphia", grade: "D", status: "Persistent poverty" },
      { name: "West Philadelphia", grade: "C", status: "Mixed conditions" },
      { name: "Kensington", grade: "D", status: "Multiple challenges" },
      { name: "Center City", grade: "A", status: "Urban renewal" },
      { name: "Society Hill", grade: "A", status: "Historic district" },
      { name: "Fishtown", grade: "B", status: "Gentrifying" }
    ],
    aiInsight: "Philadelphia's North-South divide reflects historical redlining patterns that concentrated African American residents in areas with limited investment. Despite some neighborhood revitalization, formerly redlined areas continue to face challenges with poverty, education, and access to credit that mirror the original discriminatory boundaries."
  },
  "san-francisco": {
    name: "San Francisco",
    state: "California",
    population: "873,965",
    overview: "San Francisco's redlining targeted the Western Addition and other neighborhoods, displacing communities of color. The tech boom has intensified displacement pressures in these same historically redlined areas.",
    stats: [
      {
        title: "Mortgage Denial Rate",
        value: "8.9%",
        change: "-0.2%",
        trend: "down" as const,
        description: "Lower rates but high prices limit access",
        severity: "medium" as const
      },
      {
        title: "Median Home Price",
        value: "$1.4M",
        change: "+12%",
        trend: "up" as const,
        description: "Pricing out middle-class families",
        severity: "critical" as const
      },
      {
        title: "Displacement Rate",
        value: "43%",
        description: "Black population decline since 1970",
        severity: "critical" as const
      },
      {
        title: "Income Gap",
        value: "3.2x",
        description: "Tech worker vs service worker median income",
        severity: "high" as const
      }
    ],
    neighborhoods: [
      { name: "Western Addition", grade: "D", status: "Historic displacement" },
      { name: "Bayview-Hunters Point", grade: "D", status: "Environmental justice" },
      { name: "Mission District", grade: "C", status: "Gentrification resistance" },
      { name: "Pacific Heights", grade: "A", status: "Elite enclave" },
      { name: "SOMA", grade: "A", status: "Tech corridor" }
    ],
    aiInsight: "San Francisco exemplifies how historic redlining intersects with contemporary economic forces. The Western Addition, once a thriving Black cultural center before urban renewal, now faces tech-driven gentrification. Despite the city's progressive reputation, redlining's legacy persists through ongoing displacement of communities of color."
  },
  miami: {
    name: "Miami",
    state: "Florida",
    population: "442,241",
    overview: "Miami's redlining was heavily influenced by racial and ethnic discrimination against Black and Latino communities, particularly affecting areas like Overtown and Liberty City, while protecting affluent beachfront properties.",
    stats: [
      {
        title: "Mortgage Denial Rate",
        value: "19.3%",
        change: "+1.4%",
        trend: "up" as const,
        description: "Higher in historically Black neighborhoods",
        severity: "high" as const
      },
      {
        title: "Housing Cost Burden",
        value: "61%",
        description: "Households paying >30% income on housing",
        severity: "critical" as const
      },
      {
        title: "Homeownership Gap",
        value: "34%",
        description: "White vs Black homeownership rates",
        severity: "critical" as const
      },
      {
        title: "Climate Risk Factor",
        value: "8.7/10",
        description: "Sea level rise and hurricane vulnerability",
        severity: "critical" as const
      }
    ],
    neighborhoods: [
      { name: "Overtown", grade: "D", status: "Historic Black district" },
      { name: "Liberty City", grade: "D", status: "Persistent challenges" },
      { name: "Little Haiti", grade: "C", status: "Cultural preservation" },
      { name: "South Beach", grade: "A", status: "Tourism premium" },
      { name: "Coral Gables", grade: "A", status: "Elite suburb" }
    ],
    aiInsight: "Miami's redlining concentrated Black and Latino residents in inland areas prone to flooding and environmental hazards, while preserving coastal areas for white residents and tourists. Climate change now disproportionately threatens formerly redlined communities with higher flood risk and lower adaptive capacity."
  },
  tampa: {
    name: "Tampa",
    state: "Florida", 
    population: "384,959",
    overview: "Tampa's redlining systematically excluded Black families from emerging suburban neighborhoods, concentrating them in areas like Sulphur Springs and West Tampa that faced industrial pollution and disinvestment.",
    stats: [
      {
        title: "Mortgage Denial Rate",
        value: "17.8%",
        change: "+0.9%", 
        trend: "up" as const,
        description: "Concentrated in East Tampa",
        severity: "high" as const
      },
      {
        title: "Income Inequality",
        value: "0.52",
        description: "Gini coefficient (higher = more unequal)",
        severity: "high" as const
      },
      {
        title: "Educational Gap",
        value: "27%",
        description: "College graduation rate difference",
        severity: "high" as const
      },
      {
        title: "Flood Risk Disparity",
        value: "3.2x",
        description: "Higher flood risk in formerly redlined areas",
        severity: "high" as const
      }
    ],
    neighborhoods: [
      { name: "Sulphur Springs", grade: "D", status: "Environmental justice concerns" },
      { name: "West Tampa", grade: "C", status: "Working class Latino district" },
      { name: "Ybor City", grade: "B", status: "Historic preservation" },
      { name: "Hyde Park", grade: "A", status: "Affluent residential" },
      { name: "Westshore", grade: "A", status: "Business district" }
    ],
    aiInsight: "Tampa's redlining created environmental injustices that persist today, with formerly redlined areas facing higher pollution exposure and flood risk. The city's rapid growth has intensified gentrification pressures in historically Black and Latino neighborhoods while affluent areas remain largely protected."
  }
};

export default function CityPage() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const city = cityData[citySlug || ""] || cityData.chicago;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-data-low text-white";
      case "B": return "bg-data-medium text-white";
      case "C": return "bg-data-high text-white";
      case "D": return "bg-data-critical text-white";
      default: return "bg-muted";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              {city.name}, {city.state}
            </h1>
            <p className="text-muted-foreground text-lg">
              Population: {city.population}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <p className="text-foreground max-w-4xl">
          {city.overview}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Map */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Interactive Analysis Map</h2>
            <MapContainer key={citySlug} city={citySlug || 'chicago'} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* City Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Indicators
              </CardTitle>
              <CardDescription>
                Current inequality metrics for {city.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {city.stats.map((stat: any, index: number) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  description={stat.description}
                  severity={stat.severity}
                  className="border-none shadow-none bg-muted/30"
                />
              ))}
            </CardContent>
          </Card>

          {/* Neighborhood Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Explore Neighborhoods</CardTitle>
            </CardHeader>
            <CardContent>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a neighborhood" />
                </SelectTrigger>
                <SelectContent>
                  {city.neighborhoods.map((neighborhood: any, index: number) => (
                    <SelectItem key={index} value={neighborhood.name.toLowerCase()}>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getGradeColor(neighborhood.grade)}`}>
                          {neighborhood.grade}
                        </Badge>
                        <span>{neighborhood.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="mt-4 space-y-2">
                {city.neighborhoods.map((neighborhood: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{neighborhood.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getGradeColor(neighborhood.grade)}`}>
                        Grade {neighborhood.grade}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {neighborhood.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Insights */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Analysis Summary
          </CardTitle>
          <CardDescription>
            Key findings and patterns for {city.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-foreground leading-relaxed">
              {city.aiInsight}
            </p>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary">Historical Analysis</Badge>
            <Badge variant="secondary">Current Data</Badge>
            <Badge variant="secondary">Environmental Justice</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}