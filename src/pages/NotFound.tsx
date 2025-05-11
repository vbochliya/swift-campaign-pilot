
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="rounded-full bg-brand-100 p-3">
        <Mail className="h-8 w-8 text-brand-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold">404 - Page Not Found</h1>
      <p className="mt-2 text-center text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="mt-6">
        <Link to="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFound;
