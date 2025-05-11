
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Send, Search, TrashIcon } from "lucide-react";
import api, { Campaign } from "../../services/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingCampaignId, setDeletingCampaignId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await api.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!deletingCampaignId) return;

    try {
      setDeleteLoading(true);
      await api.deleteCampaign(deletingCampaignId);
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== deletingCampaignId));
      toast.success("Campaign deleted successfully");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign");
    } finally {
      setDeleteLoading(false);
      setDeletingCampaignId(null);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="mt-1 text-muted-foreground">Manage your email marketing campaigns</p>
        </div>
        <Button asChild>
          <Link to="/campaigns/new">
            <Plus className="mr-2 h-4 w-4" /> New Campaign
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="border">
        <CardHeader className="pb-3">
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            {filteredCampaigns.length} {filteredCampaigns.length === 1 ? "campaign" : "campaigns"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Send className="h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">No campaigns found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchTerm
                  ? "Try a different search term"
                  : "Create your first campaign to get started"}
              </p>
              {!searchTerm && (
                <Button asChild className="mt-4">
                  <Link to="/campaigns/new">Create Campaign</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left">
                    <th className="px-4 py-3 font-medium">Campaign Name</th>
                    <th className="px-4 py-3 font-medium">Channel</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">Description</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Date</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{campaign.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                          {campaign.channel}
                        </span>
                      </td>
                      <td className="hidden max-w-[200px] truncate px-4 py-3 text-muted-foreground md:table-cell">
                        {campaign.description || "No description"}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/campaigns/${campaign.id}`}>View</Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-danger-500 hover:bg-danger-50 hover:text-danger-600"
                            onClick={() => setDeletingCampaignId(campaign.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deletingCampaignId} onOpenChange={() => setDeletingCampaignId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign and all its
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCampaign}
              disabled={deleteLoading}
              className="bg-danger-600 hover:bg-danger-500"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignList;
