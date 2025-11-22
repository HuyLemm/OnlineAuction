import { useState } from "react";
import { User, Mail, Phone, MapPin, Lock, Bell, CreditCard, Shield, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";

export function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 border border-border/50">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-2 border-[#fbbf24]">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black text-2xl">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-foreground mb-1">Profile Photo</h3>
                  <p className="text-muted-foreground">Update your profile picture</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-border/50">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Photo
                  </Button>
                  <Button variant="ghost" className="text-[#ef4444]">
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-foreground">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      defaultValue="John"
                      className="pl-10 bg-secondary/50 border-border/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      defaultValue="Doe"
                      className="pl-10 bg-secondary/50 border-border/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john.doe@example.com"
                      className="pl-10 bg-secondary/50 border-border/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      defaultValue="+1 (555) 123-4567"
                      className="pl-10 bg-secondary/50 border-border/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  className="bg-secondary/50 border-border/50 min-h-[100px]"
                  defaultValue="Passionate collector and auction enthusiast with a keen eye for vintage watches and classic automobiles."
                />
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-foreground">Shipping Address</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    defaultValue="123 Auction Street"
                    className="pl-10 bg-secondary/50 border-border/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    defaultValue="New York"
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    defaultValue="NY"
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    defaultValue="10001"
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="border-border/50">
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-foreground mb-1">Change Password</h3>
              <p className="text-muted-foreground">Update your password regularly to keep your account secure</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type="password"
                    className="pl-10 bg-secondary/50 border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    className="pl-10 bg-secondary/50 border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="pl-10 bg-secondary/50 border-border/50"
                  />
                </div>
              </div>
            </div>

            <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
              Update Password
            </Button>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-[#fbbf24] mt-0.5" />
              <div className="flex-1">
                <h3 className="text-foreground mb-1">Two-Factor Authentication</h3>
                <p className="text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Switch />
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-foreground mb-1">Email Notifications</h3>
              <p className="text-muted-foreground">Choose what emails you'd like to receive</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Bid Updates", description: "Get notified when someone outbids you" },
                { label: "Auction Endings", description: "Reminders for auctions ending soon" },
                { label: "Won Auctions", description: "Notifications when you win an auction" },
                { label: "New Listings", description: "Alerts for new items in your favorite categories" },
                { label: "Price Drops", description: "Notifications when watched items drop in price" },
                { label: "Messages", description: "New messages from sellers or buyers" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <div>
                    <p className="text-foreground">{item.label}</p>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6 mt-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground mb-1">Payment Methods</h3>
                <p className="text-muted-foreground">Manage your saved payment methods</p>
              </div>
              <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
                Add New Card
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { last4: "4242", brand: "Visa", expiry: "12/25", isDefault: true },
                { last4: "5555", brand: "Mastercard", expiry: "08/26", isDefault: false },
              ].map((card, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-[#fbbf24]" />
                    </div>
                    <div>
                      <p className="text-foreground">{card.brand} •••• {card.last4}</p>
                      <p className="text-muted-foreground">Expires {card.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {card.isDefault && (
                      <Badge className="bg-[#10b981] text-white border-0">Default</Badge>
                    )}
                    <Button variant="ghost" size="sm" className="text-[#ef4444]">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}