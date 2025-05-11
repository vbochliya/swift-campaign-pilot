
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowLeft,
  Upload,
  Loader2,
  ImageIcon,
  Check,
  ExternalLink,
  Mail,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import api from "../../services/api";

const formSchema = z.object({
  name: z.string().min(2, { message: "Template name is required" }),
  channel: z.string().min(1, { message: "Channel is required" }),
  subject: z.string().min(2, { message: "Subject line is required" }),
  contentTitle: z.string().min(2, { message: "Email title is required" }),
  contentBody: z.string().min(2, { message: "Email body is required" }),
  buttonText: z.string().optional(),
  actionUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.string().length(0)),
  isHtml: z.boolean().default(true),
  heroImageAlt: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewTemplate: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      channel: "EMAIL",
      subject: "",
      contentTitle: "",
      contentBody: "",
      buttonText: "",
      actionUrl: "",
      isHtml: true,
      heroImageAlt: "",
    },
  });

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    try {
      setUploading(true);
      const response = await api.uploadAsset(imageFile);
      const imageUrl = response.uploaded_at;
      setUploadedImageUrl(imageUrl);
      toast.success("Image uploaded successfully");
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);
      let imageUrl = uploadedImageUrl;

      if (imageFile && !uploadedImageUrl) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          toast.error("Failed to upload image. Please try again.");
          setSubmitting(false);
          return;
        }
      }

      const templateData = {
        name: data.name,
        channel: data.channel,
        subject: data.subject,
        content: {
          title: data.contentTitle,
          body: data.contentBody,
          button_text: data.buttonText || "",
          action_url: data.actionUrl || "",
          hero_image_alt: data.heroImageAlt || "",
        },
        is_html: data.isHtml,
        static_asset_url: imageUrl || "",
      };

      await api.createTemplate(templateData);
      toast.success("Template created successfully");
      navigate("/templates");
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Failed to create template");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/templates")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Email Template</h1>
          <p className="text-sm text-muted-foreground">
            Design and save a reusable email template
          </p>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Welcome Email" {...field} />
                          </FormControl>
                          <FormDescription>
                            A name to identify this template
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
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
                            The communication channel for this template
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Welcome to Our Platform!" {...field} />
                        </FormControl>
                        <FormDescription>
                          The subject line that will appear in the recipient's inbox
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contentTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Welcome to Your New Journey" {...field} />
                        </FormControl>
                        <FormDescription>The main title of your email</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contentBody"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Body</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Hello {{name}},

We're excited to have you join our community! Your account has been successfully created and you're all set to start exploring our platform.

If you have any questions, feel free to reach out to our support team."
                            className="min-h-[200px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          You can use variables like {"{{name}}"} to personalize your message
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="buttonText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Text (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Get Started" {...field} />
                          </FormControl>
                          <FormDescription>Text for the call-to-action button</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="actionUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/get-started" {...field} />
                          </FormControl>
                          <FormDescription>
                            The URL where the button will link to
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormLabel>Hero Image (Optional)</FormLabel>
                    <div className="flex flex-col items-center gap-4 rounded-md border p-4">
                      {imagePreview ? (
                        <div className="relative w-full">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto max-h-48 rounded-md object-contain"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                              setUploadedImageUrl(null);
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            No image selected
                          </p>
                        </div>
                      )}
                      <div className="w-full">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                handleImageUpload(file);
                              }
                            };
                            input.click();
                          }}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {imageFile ? "Change Image" : "Upload Image"}
                        </Button>
                        {imageFile && !uploadedImageUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                            disabled={uploading}
                            onClick={uploadImage}
                          >
                            {uploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>Upload Now</>
                            )}
                          </Button>
                        )}
                        {uploadedImageUrl && (
                          <div className="mt-2 flex items-center text-sm text-green-600">
                            <Check className="mr-1 h-4 w-4" />
                            Image uploaded successfully
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="isHtml"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">HTML Email</FormLabel>
                          <FormDescription>
                            Send as formatted HTML email (recommended)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Template...
                        </>
                      ) : (
                        "Create Template"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Email Preview</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This is how your email will appear to recipients
                </p>
              </div>
              
              <div className="max-w-xl mx-auto rounded-md border shadow-sm">
                <div className="rounded-t-md bg-muted/50 p-4 text-sm">
                  <div>
                    <span className="font-medium">From:</span>{" "}
                    <span className="text-muted-foreground">Your Organization</span>
                  </div>
                  <div>
                    <span className="font-medium">To:</span>{" "}
                    <span className="text-muted-foreground">recipient@example.com</span>
                  </div>
                  <div>
                    <span className="font-medium">Subject:</span>{" "}
                    <span>{form.watch("subject") || "Subject line will appear here"}</span>
                  </div>
                </div>
                
                <div className="space-y-6 p-6">
                  {imagePreview && (
                    <div className="mx-auto max-w-md">
                      <img
                        src={imagePreview}
                        alt={form.watch("heroImageAlt") || "Email header image"}
                        className="mx-auto rounded-md"
                      />
                    </div>
                  )}
                  
                  <h2 className="text-xl font-bold">
                    {form.watch("contentTitle") || "Your Email Title"}
                  </h2>
                  
                  <div className="whitespace-pre-line">
                    {form.watch("contentBody")
                      ? form.watch("contentBody").replace(/{{name}}/g, "John")
                      : "Your email content will appear here. You can use variables like {{name}} to personalize your message."}
                  </div>
                  
                  {form.watch("buttonText") && (
                    <div className="pt-2">
                      <a
                        href={form.watch("actionUrl") || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
                      >
                        {form.watch("buttonText")}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 text-xs text-muted-foreground">
                    <p>© 2025 Your Organization. All rights reserved.</p>
                    <p className="mt-1">
                      This is an automated message. Please do not reply to this email.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewTemplate;
