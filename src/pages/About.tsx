import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Database, MapPin, Users, BookOpen } from "lucide-react";

const dataSources = [
  {
    name: "Mapping Inequality",
    description: "Historical HOLC redlining maps for 200+ U.S. cities",
    url: "https://dsl.richmond.edu/panorama/redlining/",
    icon: MapPin
  },
  {
    name: "HMDA Data",
    description: "Home Mortgage Disclosure Act - nationwide lending data",
    url: "https://www.consumerfinance.gov/data-research/hmda/",
    icon: Database
  },
  {
    name: "U.S. Census ACS",
    description: "American Community Survey - demographics and housing",
    url: "https://www.census.gov/programs-surveys/acs/",
    icon: Users
  },
  {
    name: "Eviction Lab",
    description: "Nationwide eviction data by Princeton University",
    url: "https://evictionlab.org/",
    icon: BookOpen
  },
  {
    name: "EPA EJScreen",
    description: "Environmental Justice Screening Tool",
    url: "https://www.epa.gov/ejscreen",
    icon: Database
  }
];

const keyResearch = [
  {
    title: "The Color of Law",
    author: "Richard Rothstein",
    description: "Comprehensive analysis of government-sanctioned segregation"
  },
  {
    title: "The Possessive Investment in Whiteness",
    author: "George Lipsitz",
    description: "How white identity politics disadvantages communities of color"
  },
  {
    title: "Race and Residence",
    author: "Reynolds Farley & William Frey",
    description: "Residential segregation of African Americans"
  }
];

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-6">About This Research</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          This platform combines historical redlining data with contemporary housing inequality 
          metrics to reveal how past discriminatory policies continue to shape American communities today.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* What is Redlining */}
        <section>
          <h2 className="text-2xl font-bold mb-6">What Was Redlining?</h2>
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="mb-4">
              Redlining was a discriminatory practice that began in the 1930s when the federal 
              government's Home Owners' Loan Corporation (HOLC) created "residential security maps" 
              for major American cities. These maps divided neighborhoods into four categories:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
              <Card className="border-l-4 border-l-data-low">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-data-low text-white">A</Badge>
                    <CardTitle className="text-lg">Best (Green)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    "Homogeneous" areas with business and professional families
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-data-medium">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-data-medium text-white">B</Badge>
                    <CardTitle className="text-lg">Still Desirable (Blue)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Areas still considered good but not as desirable as Grade A
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-data-high">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-data-high text-white">C</Badge>
                    <CardTitle className="text-lg">Declining (Yellow)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Areas characterized by age, obsolescence, and changing population
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-data-critical">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-data-critical text-white">D</Badge>
                    <CardTitle className="text-lg">Hazardous (Red)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Areas with "undesirable populations" and detrimental influences
                  </p>
                </CardContent>
              </Card>
            </div>

            <p>
              Areas marked in red (Grade D) were deemed "hazardous" for investment, primarily due to 
              the presence of African American, Latino, and immigrant populations. Banks used these 
              maps to deny mortgages and homeownership opportunities to residents of these neighborhoods.
            </p>
          </div>
        </section>

        {/* Legacy Today */}
        <section>
          <h2 className="text-2xl font-bold mb-6">The Legacy Continues</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none text-foreground">
                <p className="mb-4">
                  Research shows that formerly redlined neighborhoods continue to experience:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none p-0">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-data-critical rounded-full" />
                    Lower homeownership rates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-data-critical rounded-full" />
                    Higher mortgage denial rates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-data-critical rounded-full" />
                    Reduced property values
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-data-critical rounded-full" />
                    Environmental health disparities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-data-critical rounded-full" />
                    Lower median household income
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-data-critical rounded-full" />
                    Higher eviction rates
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Data Sources */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Data Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataSources.map((source, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <source.icon className="h-5 w-5 text-primary" />
                    {source.name}
                  </CardTitle>
                  <CardDescription>{source.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" asChild>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Source
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Research */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Key Research</h2>
          <div className="space-y-4">
            {keyResearch.map((research, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{research.title}</CardTitle>
                  <CardDescription>by {research.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{research.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Methodology</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none text-foreground">
                <p className="mb-4">
                  This analysis combines multiple data sources to examine the relationship between 
                  historical redlining and contemporary housing inequality:
                </p>
                <ol className="space-y-2">
                  <li><strong>Historical Mapping:</strong> HOLC maps from the 1930s digitized by the Mapping Inequality project</li>
                  <li><strong>Current Demographics:</strong> American Community Survey data on race, income, and homeownership</li>
                  <li><strong>Lending Patterns:</strong> Home Mortgage Disclosure Act data on loan approvals and denials</li>
                  <li><strong>Housing Stability:</strong> Eviction data from the Eviction Lab</li>
                  <li><strong>Environmental Justice:</strong> EPA EJScreen environmental and demographic indicators</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}