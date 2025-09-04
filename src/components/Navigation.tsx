import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, MapPin, BarChart3, FileText, Search, MessageCircle } from "lucide-react";

const cities = [
  { name: "Chicago", path: "/cities/chicago" },
  { name: "New York", path: "/cities/new-york" },
  { name: "Los Angeles", path: "/cities/los-angeles" },
  { name: "Detroit", path: "/cities/detroit" },
  { name: "Philadelphia", path: "/cities/philadelphia" },
  { name: "Atlanta", path: "/cities/atlanta" },
  { name: "Miami", path: "/cities/miami" },
  { name: "Tampa", path: "/cities/tampa" }
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const NavLink = ({ to, children, icon: Icon, mobile = false }: {
    to: string;
    children: React.ReactNode;
    icon?: any;
    mobile?: boolean;
  }) => {
    const isActive = location.pathname === to;
    const baseClasses = mobile 
      ? "flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted transition-colors"
      : "flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors";
    
    return (
      <Link
        to={to}
        className={`${baseClasses} ${isActive ? 'text-primary' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {children}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">Redlining Research</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <NavLink to="/" icon={Home}>Home</NavLink>
            
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                <MapPin className="h-4 w-4" />
                Cities
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {cities.map((city) => (
                    <NavLink key={city.path} to={city.path}>{city.name}</NavLink>
                  ))}
                </div>
              </div>
            </div>

            <NavLink to="/compare" icon={BarChart3}>Compare Cities</NavLink>
            <NavLink to="/neighborhood-report" icon={Search}>Neighborhood Report</NavLink>
            <NavLink to="/chat" icon={MessageCircle}>AI Assistant</NavLink>
            <NavLink to="/about" icon={FileText}>About</NavLink>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                <NavLink to="/" icon={Home} mobile>Home</NavLink>
                
                <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">Cities</div>
                {cities.map((city) => (
                  <NavLink key={city.path} to={city.path} icon={MapPin} mobile>
                    {city.name}
                  </NavLink>
                ))}
                
                <div className="border-t pt-4 mt-4">
                  <NavLink to="/compare" icon={BarChart3} mobile>Compare Cities</NavLink>
                  <NavLink to="/neighborhood-report" icon={Search} mobile>Neighborhood Report</NavLink>
                  <NavLink to="/chat" icon={MessageCircle} mobile>AI Assistant</NavLink>
                  <NavLink to="/about" icon={FileText} mobile>About</NavLink>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};