
import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, LayoutDashboard, FileText, Send, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar: React.FC = () => {
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Campaigns",
      href: "/campaigns",
      icon: <Send className="h-5 w-5" />,
    },
    {
      name: "Templates",
      href: "/templates",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="hidden md:flex h-[calc(100vh-4rem)] w-64 flex-col border-r bg-background">
      <div className="flex flex-col space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
