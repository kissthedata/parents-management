import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Calendar, Album, Settings } from "lucide-react";

const navItems = [
  { 
    name: "홈", 
    path: "/home", 
    icon: Home,
    iconName: "home"
  },
  { 
    name: "캘린더", 
    path: "/calendar", 
    icon: Calendar,
    iconName: "calendar"
  },
  { 
    name: "앨범", 
    path: "/album", 
    icon: Album,
    iconName: "album"
  },
  { 
    name: "설정", 
    path: "/settings", 
    icon: Settings,
    iconName: "settings"
  }
];

export const BottomNavigation = () => {
  const location = useLocation();

  // Import icons dynamically
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case "home":
        return Home;
      case "calendar":
        return Calendar;
      case "album":
        return Album;
      case "settings":
        return Settings;
      default:
        return Home;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = getIcon(item.iconName);
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-[60px]",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isActive && "bg-primary/20"
                )}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium mt-1">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};