import { useState } from "react";
import { Settings, Save, Globe, DollarSign, Mail, Shield, Bell, Database } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";

export function SystemSettingsSection() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "LuxeAuction",
    siteDescription: "Premium online auction platform for luxury items",
    contactEmail: "support@luxeauction.com",
    
    // Auction Settings
    defaultAuctionDuration: "7",
    minimumBidIncrement: "10",
    buyerPremium: "5",
    sellerCommission: "10",
    
    // Email Notifications
    emailNotifications: true,
    bidNotifications: true,
    auctionEndNotifications: true,
    sellerApprovalNotifications: true,
    
    // Security
    requireEmailVerification: true,
    requireSellerVerification: true,
    enableTwoFactorAuth: false,
    
    // System
    maintenanceMode: false,
    autoBackup: true,
    debugMode: false,
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">System Settings</h1>
          <p className="text-muted-foreground">
            Configure platform settings and preferences
          </p>
        </div>
        <Button 
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="p-6 bg-card border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/10 border border-[#fbbf24]/20">
              <Globe className="h-5 w-5 text-[#fbbf24]" />
            </div>
            <div>
              <h3 className="text-foreground">General Settings</h3>
              <p className="text-muted-foreground text-sm">Basic platform configuration</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Site Description</Label>
              <Textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="bg-secondary/50 border-border/50 min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </div>
        </Card>

        {/* Auction Settings */}
        <Card className="p-6 bg-card border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/10 border border-[#fbbf24]/20">
              <DollarSign className="h-5 w-5 text-[#fbbf24]" />
            </div>
            <div>
              <h3 className="text-foreground">Auction Settings</h3>
              <p className="text-muted-foreground text-sm">Configure auction parameters</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Default Auction Duration (days)</Label>
              <Select 
                value={settings.defaultAuctionDuration}
                onValueChange={(value) => setSettings({ ...settings, defaultAuctionDuration: value })}
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="10">10 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Minimum Bid Increment ($)</Label>
              <Input
                type="number"
                value={settings.minimumBidIncrement}
                onChange={(e) => setSettings({ ...settings, minimumBidIncrement: e.target.value })}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Buyer Premium (%)</Label>
              <Input
                type="number"
                value={settings.buyerPremium}
                onChange={(e) => setSettings({ ...settings, buyerPremium: e.target.value })}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Seller Commission (%)</Label>
              <Input
                type="number"
                value={settings.sellerCommission}
                onChange={(e) => setSettings({ ...settings, sellerCommission: e.target.value })}
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </div>
        </Card>

        {/* Email Notifications */}
        <Card className="p-6 bg-card border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/10 border border-[#fbbf24]/20">
              <Mail className="h-5 w-5 text-[#fbbf24]" />
            </div>
            <div>
              <h3 className="text-foreground">Email Notifications</h3>
              <p className="text-muted-foreground text-sm">Manage email preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div>
                <Label>Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send automated emails to users</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div>
                <Label>Bid Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify users when they're outbid</p>
              </div>
              <Switch
                checked={settings.bidNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, bidNotifications: checked })}
                disabled={!settings.emailNotifications}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div>
                <Label>Auction End Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify when auctions end</p>
              </div>
              <Switch
                checked={settings.auctionEndNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, auctionEndNotifications: checked })}
                disabled={!settings.emailNotifications}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div>
                <Label>Seller Approval Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify admins of new applications</p>
              </div>
              <Switch
                checked={settings.sellerApprovalNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, sellerApprovalNotifications: checked })}
                disabled={!settings.emailNotifications}
              />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6 bg-card border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/10 border border-[#fbbf24]/20">
              <Shield className="h-5 w-5 text-[#fbbf24]" />
            </div>
            <div>
              <h3 className="text-foreground">Security Settings</h3>
              <p className="text-muted-foreground text-sm">Platform security options</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div>
                <Label>Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">Users must verify their email</p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div>
                <Label>Require Seller Verification</Label>
                <p className="text-sm text-muted-foreground">Sellers must be manually approved</p>
              </div>
              <Switch
                checked={settings.requireSellerVerification}
                onCheckedChange={(checked) => setSettings({ ...settings, requireSellerVerification: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div>
                <Label>Enable Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add extra security layer</p>
              </div>
              <Switch
                checked={settings.enableTwoFactorAuth}
                onCheckedChange={(checked) => setSettings({ ...settings, enableTwoFactorAuth: checked })}
              />
            </div>
          </div>
        </Card>

        {/* System Settings */}
        <Card className="xl:col-span-2 p-6 bg-card border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/10 border border-[#fbbf24]/20">
              <Database className="h-5 w-5 text-[#fbbf24]" />
            </div>
            <div>
              <h3 className="text-foreground">System Settings</h3>
              <p className="text-muted-foreground text-sm">Advanced system configuration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Temporarily disable the site</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div>
                <Label>Auto Backup</Label>
                <p className="text-sm text-muted-foreground">Daily automated backups</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div>
                <Label>Debug Mode</Label>
                <p className="text-sm text-muted-foreground">Enable detailed logging</p>
              </div>
              <Switch
                checked={settings.debugMode}
                onCheckedChange={(checked) => setSettings({ ...settings, debugMode: checked })}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
