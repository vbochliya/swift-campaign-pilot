
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import api, { MessageTemplate } from "../../services/api";

const formSchema = z.object({
  name: z.string().min(2, { message: "Campaign name is required" }),
  description: z.string().min(2, { message: "Description is required" }),
  channel: z.string().min(1, { message: "Channel is required" }),
  messageTemplateId: z.string().min(1, { message: "Template selection is required" }),
  contactsFile: z.instanceof(File, { message: "Contacts file is required" }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewCampaign: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      channel: "EMAIL",
      messageTemplateId: "",
    },
  });

  // Fetch templates from the API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true);
        // In a real implementation, we would call an API endpoint to get templates
        // For this demo, we're using mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulating API call delay
        
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
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);

      if (!data.contactsFile) {
        toast.error("Please upload a contacts CSV file");
        setSubmitting(false);
        return;
      }

      console.log("Creating campaign with data:", {
        name: data.name,
        description: data.description,
        channel: data.channel,
        message_templates: data.messageTemplateId,
        contactsFile: data.contactsFile,
      });
      
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("channel", data.channel);
      formData.append("message_templates", data.messageTemplateId);
      formData.append("contactsCSV", data.contactsFile); // Make sure this field name matches what the backend expects

      const response = await api.createCampaign(formData);
      console.log("Campaign created successfully:", response);
      toast.success("Campaign created successfully");
      navigate(`/campaigns/${response.id}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/campaigns")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Campaign</h1>
          <p className="text-sm text-muted-foreground">Set up your email marketing campaign</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Spring Sale Announcement" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a name that describes the purpose of this campaign
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Details about this campaign"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add details that help you remember the purpose of this campaign
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EMAIL">Email</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the communication channel for this campaign
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="messageTemplateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Template</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingTemplates ? (
                          <div className="flex justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          </div>
                        ) : templates.length === 0 ? (
                          <div className="px-2 py-2 text-sm text-muted-foreground">
                            No templates available
                          </div>
                        ) : (
                          templates.map((template) => (
                            <SelectItem key={template.id} value={template.id.toString()}>
                              {template.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the message template for this campaign
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactsFile"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Contacts</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = ".csv";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                onChange(file);
                              }
                            };
                            input.click();
                          }}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {value ? "Change CSV File" : "Upload CSV File"}
                        </Button>
                      </div>
                    </FormControl>
                    {value && (
                      <p className="text-sm font-medium text-green-600">
                        Selected: {(value as File).name}
                      </p>
                    )}
                    <FormDescription>
                      Upload a CSV file containing your contact list (email, name, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Campaign...
                    </>
                  ) : (
                    "Create Campaign"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCampaign;
