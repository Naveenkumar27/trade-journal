export const routeTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/open-positions": "Offene Positionen",
    "/closed-positions": "Geschlossene Positionen",
    "/history": "Handelshistorie",
    "/analytics": "Analysen",
    "/settings": "Einstellungen",
    "/help": "Hilfe",
    "/reports": "Berichte",
  };
  
  export function getPageTitle(pathname: string): string {
    return routeTitles[pathname] || "Seite";
  }
  