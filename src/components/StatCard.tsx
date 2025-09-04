import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
  severity?: "low" | "medium" | "high" | "critical";
  className?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  description, 
  severity = "medium",
  className = "" 
}: StatCardProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-data-low border-data-low/20 bg-data-low/5";
      case "medium": return "text-data-medium border-data-medium/20 bg-data-medium/5";
      case "high": return "text-data-high border-data-high/20 bg-data-high/5";
      case "critical": return "text-data-critical border-data-critical/20 bg-data-critical/5";
      default: return "text-muted-foreground";
    }
  };

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-data-high" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-data-low" />;
    return <AlertTriangle className="h-4 w-4 text-data-medium" />;
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {severity !== "medium" && (
            <Badge 
              variant="outline" 
              className={`text-xs ${getSeverityColor(severity)}`}
            >
              {severity}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-foreground">
            {value}
          </div>
          {change && (
            <div className="flex items-center gap-1 text-sm">
              {getTrendIcon()}
              <span className={`${
                trend === "up" ? "text-data-high" : 
                trend === "down" ? "text-data-low" : 
                "text-data-medium"
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">
            {description}
          </p>
        )}
      </CardContent>
      
      {/* Severity indicator bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${
        severity === "critical" ? "bg-data-critical" :
        severity === "high" ? "bg-data-high" :
        severity === "medium" ? "bg-data-medium" :
        "bg-data-low"
      }`} />
    </Card>
  );
};