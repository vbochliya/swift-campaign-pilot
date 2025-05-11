
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, FileText, Send, Users, ArrowRight } from "lucide-react";
import api, { Campaign } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const DashboardCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  value?: string | number;
  footer?: React.ReactNode;
  loading?: boolean;
}> = ({ title, description, icon, value, footer, loading }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="rounded-full bg-brand-50 p-2 text-brand-600">{icon}</div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="text-3xl font-bold">{value || "0"}</div>
        )}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

const RecentCampaigns: React.FC<{ campaigns: Campaign[]; loading: boolean }> = ({ campaigns, loading }) => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Overview of your latest email campaigns</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/campaigns">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Send className="h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold">No campaigns yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first email campaign to get started
            </p>
            <Button asChild className="mt-4">
              <Link to="/campaigns/new">Create Campaign</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left">
                    <th className="px-4 py-3 font-medium">Campaign Name</th>
                    <th className="px-4 py-3 font-medium">Channel</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Date</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.slice(0, 5).map((campaign) => (
                    <tr key={campaign.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{campaign.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                          {campaign.channel}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/campaigns/${campaign.id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await api.getCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
        <p className="mt-1 text-muted-foreground">
          Here's an overview of your email campaigns and performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Campaigns"
          description="Campaigns created"
          icon={<Send className="h-5 w-5" />}
          value={campaigns.length}
          loading={loading}
          footer={
            <Link
              to="/campaigns"
              className="text-sm text-brand-600 hover:text-brand-700 hover:underline"
            >
              View all campaigns
            </Link>
          }
        />
        
        <DashboardCard
          title="Templates"
          description="Available email templates"
          icon={<FileText className="h-5 w-5" />}
          value="-"
          loading={loading}
          footer={
            <Link
              to="/templates"
              className="text-sm text-brand-600 hover:text-brand-700 hover:underline"
            >
              Manage templates
            </Link>
          }
        />
        
        <DashboardCard
          title="Messages Sent"
          description="Total emails delivered"
          icon={<Mail className="h-5 w-5" />}
          value="-"
          loading={loading}
        />
        
        <DashboardCard
          title="Recipients"
          description="Total audience reach"
          icon={<Users className="h-5 w-5" />}
          value="-"
          loading={loading}
        />
      </div>

      <RecentCampaigns campaigns={campaigns} loading={loading} />
    </div>
  );
};

export default Dashboard;
