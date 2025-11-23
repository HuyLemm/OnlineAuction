import { Store, CheckCircle, TrendingUp, Shield, DollarSign, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

export function BecomeSellerSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">Become a Seller</h1>
        <p className="text-muted-foreground">Join thousands of successful sellers on LuxeAuction</p>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/5 border border-[#fbbf24]/20 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center">
            <Store className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-foreground mb-1">Why Sell on LuxeAuction?</h2>
            <p className="text-muted-foreground">Access a global marketplace of premium buyers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: Users,
              title: "Large Audience",
              description: "Reach millions of active bidders worldwide"
            },
            {
              icon: Shield,
              title: "Secure Transactions",
              description: "Protected payments and buyer verification"
            },
            {
              icon: TrendingUp,
              title: "Premium Listings",
              description: "Showcase your items with professional tools"
            },
            {
              icon: DollarSign,
              title: "Competitive Fees",
              description: "Low commission rates for sellers"
            },
            {
              icon: CheckCircle,
              title: "Seller Protection",
              description: "Insurance against fraud and disputes"
            },
            {
              icon: Store,
              title: "Seller Dashboard",
              description: "Manage all your auctions in one place"
            }
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <Icon className="h-5 w-5 text-[#fbbf24] mb-2" />
                <h3 className="text-foreground mb-1">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Application Form */}
      <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-foreground mb-1">Seller Application</h2>
          <p className="text-muted-foreground">Fill out the form below to start your seller journey</p>
        </div>

        <Separator className="bg-border/50" />

        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-foreground">Business Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                placeholder="Your business or store name"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type *</Label>
              <Input
                id="businessType"
                placeholder="e.g., Individual, LLC, Corporation"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / VAT Number *</Label>
              <Input
                id="taxId"
                placeholder="Your tax identification number"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDescription">Business Description *</Label>
            <Textarea
              id="businessDescription"
              placeholder="Tell us about your business and what you plan to sell..."
              className="bg-secondary/50 border-border/50 min-h-[120px]"
            />
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-foreground">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                placeholder="Primary contact person"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contact@business.com"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                id="contactPhone"
                placeholder="+1 (555) 123-4567"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                placeholder="Your country"
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Selling Categories */}
        <div className="space-y-4">
          <div>
            <h3 className="text-foreground mb-1">Selling Categories</h3>
            <p className="text-muted-foreground">Select the categories you plan to sell in</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "Watches", "Art", "Vintage Cars", "Jewelry",
              "Collectibles", "Fashion", "Furniture", "Sports"
            ].map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50 cursor-pointer hover:border-[#fbbf24]/30 transition-colors"
              >
                <input type="checkbox" className="accent-[#fbbf24]" />
                <span className="text-foreground">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Expected Volume */}
        <div className="space-y-4">
          <h3 className="text-foreground">Expected Sales Volume</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyListings">Expected Monthly Listings</Label>
              <Input
                id="monthlyListings"
                type="number"
                placeholder="e.g., 10"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgItemValue">Average Item Value (USD)</Label>
              <Input
                id="avgItemValue"
                type="number"
                placeholder="e.g., 5000"
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-foreground">Additional Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="experience">Previous Selling Experience</Label>
            <Textarea
              id="experience"
              placeholder="Tell us about your experience selling online or at auctions..."
              className="bg-secondary/50 border-border/50 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="references">References or Social Proof (Optional)</Label>
            <Textarea
              id="references"
              placeholder="Links to your social media, other marketplaces, or references..."
              className="bg-secondary/50 border-border/50"
            />
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Terms and Submit */}
        <div className="space-y-4">
          <label className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg border border-border/50">
            <input type="checkbox" className="accent-[#fbbf24] mt-1" />
            <div>
              <p className="text-foreground mb-1">I agree to the Terms and Conditions</p>
              <p className="text-muted-foreground">
                I have read and agree to the LuxeAuction Seller Agreement, Privacy Policy, 
                and understand the fees and commission structure.
              </p>
            </div>
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
            >
              Submit Application
            </Button>
            <Button variant="outline" className="border-border/50">
              Save as Draft
            </Button>
          </div>

          <p className="text-muted-foreground text-center">
            Our team will review your application within 2-3 business days
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
        <h2 className="text-foreground">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {[
            {
              q: "What are the seller fees?",
              a: "We charge a competitive 5% commission on successful sales, with no listing fees."
            },
            {
              q: "How long does approval take?",
              a: "Most applications are reviewed within 2-3 business days."
            },
            {
              q: "Do I need a business license?",
              a: "While not always required, having proper business documentation helps speed up approval."
            },
            {
              q: "Can I sell internationally?",
              a: "Yes! Our platform supports international shipping and multiple currencies."
            }
          ].map((faq, index) => (
            <div key={index} className="p-4 bg-secondary/30 rounded-lg border border-border/50">
              <h3 className="text-foreground mb-2">{faq.q}</h3>
              <p className="text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
