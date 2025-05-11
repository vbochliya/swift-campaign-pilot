
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { MessageTemplate } from "../../services/api";

const TemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        // This would be a real API call to get templates
        // In a real implementation, you would have an API endpoint for this
        // For now, we'll just simulate a delay and mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mocked templates
        setTemplates([
          {
            id: 4,
            name: "Welcome Email Template",
            organization: 2,
            channel: "EMAIL",
            subject: "Welcome to Our Platform!",
            content: {
              title: "Welcome to Your New Journey",
              body: "Hello {{name}},\n\nWe're excited to have you join our community!",
              action_url: "https://example.com/get-started",
              hero_image_alt: "Welcome celebration image",
              button_text: "Get Started",
            },
            is_html: true,
            created_at: "2025-05-11T19:00:58.864325Z",
            updated_at: "2025-05-11T19:00:58.864343Z",
            static_asset_url: "https://example.com/image.png",
          },
          {
            id: 5,
            name: "Newsletter Template",
            organization: 2,
            channel: "EMAIL",
            subject: "Your Monthly Newsletter",
            content: {
              title: "Monthly Newsletter",
              body: "Hello {{name}},\n\nHere's your monthly newsletter!",
              action_url: "https://example.com/newsletter",
              hero_image_alt: "Newsletter image",
              button_text: "Read More",
            },
            is_html: true,
            created_at: "2025-05-11T19:00:58.864325Z",
            updated_at: "2025-05-11T19:00:58.864343Z",
            static_asset_url: "https://example.com/image.png",
          },
        ]);
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast.error("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage your email templates
          </p>
        </div>
        <Button asChild>
          <Link to="/templates/new">
            <Plus className="mr-2 h-4 w-4" /> New Template
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border border-border">
              <CardHeader className="animate-pulse-light bg-muted/50 pb-3">
                <div className="h-5 w-1/2 rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredTemplates.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold">No templates found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm
                ? "Try a different search term"
                : "Create your first template to get started"}
            </p>
            {!searchTerm && (
              <Button asChild className="mt-4">
                <Link to="/templates/new">Create Template</Link>
              </Button>
            )}
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <Link
              key={template.id}
              to={`/templates/${template.id}`}
              className="group transition-transform hover:scale-[1.01]"
            >
              <Card className="border border-border">
                <CardHeader className="bg-muted/50 pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                      {template.channel}
                    </span>
                    <span className="ml-2">
                      {new Date(template.created_at).toLocaleDateString()}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-medium">
                    Subject: <span className="font-normal">{template.subject}</span>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {template.content.body.slice(0, 120)}...
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TemplateList;
