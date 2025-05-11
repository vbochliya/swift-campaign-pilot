
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Send,
  FileCheck,
  Mail,
  Calendar,
  User,
  Loader2,
  Check,
  AlertCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api, { Campaign, SendMessageResponse } from "../../services/api";

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<SendMessageResponse | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        const campaigns = await api.getCampaigns();
        const campaignData = campaigns.find((c) => c.id === parseInt(id));
        
        if (campaignData) {
          setCampaign(campaignData);
        } else {
          toast.error("Campaign not found");
          navigate("/campaigns");
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
        toast.error("Failed to load campaign details");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id, navigate]);

  const handleSendCampaign = async () => {
    if (!campaign || !campaign.message_templates?.[0]) {
      toast.error("Campaign details incomplete");
      return;
    }

    try {
      setSending(true);
      const templateId = campaign.message_templates[0].id;
      const result = await api.sendMessage({
        campaign_id: campaign.id,
        template_id: templateId,
        variables: {},
      });

      setSendResult(result);
      toast.success("Campaign sent successfully");
    } catch (error) {
      console.error("Error sending campaign:", error);
      toast.error("Failed to send campaign");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Campaign Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The campaign you're looking for doesn't exist or has been deleted.
        </p>
        <Button className="mt-4" onClick={() => navigate("/campaigns")}>
          Back to Campaigns
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/campaigns")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <Badge variant="outline" className="bg-brand-50 text-brand-700">
              {campaign.channel}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Campaign Details</p>
        </div>
        <Button onClick={() => setSendDialogOpen(true)}>
          <Send className="mr-2 h-4 w-4" />
          Send Campaign
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Information</CardTitle>
              <CardDescription>Details about this email campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{campaign.description || "No description provided"}</p>
              </div>
              
              <Separator />
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Updated At</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(campaign.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Organization ID</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{campaign.organization_id}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>ID: {campaign.created_by_id}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {campaign.message_templates && campaign.message_templates.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Email Template</CardTitle>
                <CardDescription>
                  The template that will be used for this campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Template Name</h3>
                  <p className="mt-1">{campaign.message_templates[0].name}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                  <p className="mt-1">{campaign.message_templates[0].subject}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Content Preview</h3>
                  <div className="mt-2 rounded-md border p-4">
                    <h4 className="font-semibold">
                      {campaign.message_templates[0].content.title}
                    </h4>
                    <p className="mt-2 whitespace-pre-wrap">
                      {campaign.message_templates[0].content.body}
                    </p>
                    {campaign.message_templates[0].content.button_text && (
                      <div className="mt-4">
                        <span className="inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white">
                          {campaign.message_templates[0].content.button_text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Campaign Assets</CardTitle>
              <CardDescription>Files and resources for this campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contacts CSV</h3>
                <div className="mt-2 flex items-center gap-2 rounded-md border p-3">
                  <FileCheck className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 truncate" title={campaign.contactsCSV}>
                    {campaign.contactsCSV.split("/").pop()}
                  </div>
                </div>
              </div>

              {campaign.message_templates &&
                campaign.message_templates[0]?.static_asset_url && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Hero Image</h3>
                    <div className="mt-2">
                      <img
                        src={campaign.message_templates[0].static_asset_url}
                        alt={campaign.message_templates[0].content.hero_image_alt || "Campaign image"}
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                disabled={!campaign.message_templates || campaign.message_templates.length === 0}
                onClick={() => setSendDialogOpen(true)}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Campaign
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Campaign</DialogTitle>
            <DialogDescription>
              You are about to send this campaign to all contacts in the CSV file.
            </DialogDescription>
          </DialogHeader>
          
          {sendResult ? (
            <div className="space-y-4">
              <div className="rounded-md bg-success-50 p-4">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-success-500" />
                  <h3 className="ml-2 text-sm font-medium text-success-600">Campaign Sent</h3>
                </div>
                <div className="mt-2 text-sm text-success-600">{sendResult.message}</div>
              </div>
              
              <div className="rounded-md border p-4">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Processed</dt>
                    <dd className="text-2xl font-bold">{sendResult.contacts_processed}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Successful</dt>
                    <dd className="text-2xl font-bold text-success-500">
                      {sendResult.successful_sends}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Failed</dt>
                    <dd className="text-2xl font-bold text-danger-500">{sendResult.failed_sends}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h4 className="font-medium">Recipients</h4>
                <div className="mt-2 max-h-40 overflow-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 text-left">
                        <th className="px-4 py-2 font-medium">Email</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sendResult.results.map((result, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{result.recipient}</td>
                          <td className="px-4 py-2">
                            {result.success ? (
                              <span className="inline-flex items-center rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success-600">
                                <Check className="mr-1 h-3 w-3" />
                                Sent
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-danger-50 px-2 py-0.5 text-xs font-medium text-danger-600">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Failed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setSendDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.message_templates?.[0]?.subject || "No subject available"}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Template</h3>
                  <p className="mt-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {campaign.message_templates?.[0]?.name || "No template selected"}
                  </p>
                </div>
                
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm">
                    This will send the campaign to all contacts in your CSV file. Make sure your list
                    is up-to-date and complies with email marketing regulations.
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setSendDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendCampaign} disabled={sending}>
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Now
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignDetail;
