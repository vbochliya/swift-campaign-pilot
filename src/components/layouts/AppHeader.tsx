
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, HelpCircle } from "lucide-react";

const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6 text-brand-600" />
          <span className="font-bold text-xl">BulkMailer</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <p className="text-sm font-medium">
              {user?.name} | {user?.organization.name}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
