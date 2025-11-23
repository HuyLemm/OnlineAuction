import { useState } from "react";
import { Upload, Plus, X, Calendar, DollarSign, Package, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function CreateAuction() {
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>(["Luxury", "Vintage"]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">Create New Auction</h1>
        <p className="text-muted-foreground">List your item and start receiving bids</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-foreground mb-1">Basic Information</h2>
              <p className="text-muted-foreground">Provide essential details about your item</p>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Auction Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Rolex Submariner 116610LN Black Dial"
                  className="bg-secondary/50 border-border/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="watches">Watches</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="cars">Vintage Cars</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="collectibles">Collectibles</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like-new">Like New</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="restoration">Needs Restoration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed description including condition, history, provenance, etc."
                  className="bg-secondary/50 border-border/50 min-h-[150px]"
                />
                <p className="text-muted-foreground">Minimum 100 characters</p>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-foreground mb-1">Images</h2>
              <p className="text-muted-foreground">Upload high-quality photos (minimum 3, maximum 10)</p>
            </div>

            <Separator className="bg-border/50" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border/50 group">
                  <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  {index === 0 && (
                    <Badge className="absolute bottom-2 left-2 bg-[#fbbf24] text-black border-0">
                      Primary
                    </Badge>
                  )}
                </div>
              ))}
              
              {images.length < 10 && (
                <button className="aspect-square rounded-lg border-2 border-dashed border-border/50 hover:border-[#fbbf24]/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                  <Upload className="h-6 w-6" />
                  <span>Upload</span>
                </button>
              )}
            </div>
          </div>

          {/* Item Details */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-foreground mb-1">Item Details</h2>
              <p className="text-muted-foreground">Additional specifications and features</p>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand / Maker</Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Rolex"
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model / Series</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Submariner"
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year / Era</Label>
                  <Input
                    id="year"
                    placeholder="e.g., 2018"
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="origin">Country of Origin</Label>
                  <Input
                    id="origin"
                    placeholder="e.g., Switzerland"
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-[#fbbf24]/10 text-[#fbbf24] border-border/50">
                      {tag}
                      <button
                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    className="bg-secondary/50 border-border/50"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const input = e.target as HTMLInputElement;
                        if (input.value) {
                          setTags([...tags, input.value]);
                          input.value = "";
                        }
                      }
                    }}
                  />
                  <Button variant="outline" className="border-border/50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & Documentation */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-foreground mb-1">Shipping & Documentation</h2>
              <p className="text-muted-foreground">Provide shipping and authenticity information</p>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping">Shipping Method</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Shipping</SelectItem>
                      <SelectItem value="express">Express Shipping</SelectItem>
                      <SelectItem value="white-glove">White Glove Service</SelectItem>
                      <SelectItem value="pickup">Local Pickup Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Shipping Cost</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="shippingCost"
                      type="number"
                      placeholder="0.00"
                      className="pl-10 bg-secondary/50 border-border/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Included Documentation</Label>
                {["Original Box", "Certificate of Authenticity", "Service Records", "Original Papers"].map((doc) => (
                  <label key={doc} className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50 cursor-pointer">
                    <input type="checkbox" className="accent-[#fbbf24]" />
                    <span className="text-foreground">{doc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Auction Settings */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-foreground mb-1">Auction Settings</h2>
              <p className="text-muted-foreground">Configure pricing and duration</p>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startingBid">Starting Bid *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startingBid"
                    type="number"
                    placeholder="0.00"
                    className="pl-10 bg-secondary/50 border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reservePrice">Reserve Price (Optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reservePrice"
                    type="number"
                    placeholder="0.00"
                    className="pl-10 bg-secondary/50 border-border/50"
                  />
                </div>
                <p className="text-muted-foreground">Hidden minimum price</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyNow">Buy Now Price (Optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="buyNow"
                    type="number"
                    placeholder="0.00"
                    className="pl-10 bg-secondary/50 border-border/50"
                  />
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-2">
                <Label htmlFor="duration">Auction Duration *</Label>
                <Select>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="5">5 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="10">10 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="datetime-local"
                    className="pl-10 bg-secondary/50 border-border/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview & Actions */}
          <div className="bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/5 border border-[#fbbf24]/20 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-[#fbbf24] mt-0.5" />
              <div>
                <h3 className="text-foreground mb-1">Ready to List?</h3>
                <p className="text-muted-foreground">Review your listing before publishing</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
                Publish Auction
              </Button>
              <Button variant="outline" className="w-full border-border/50">
                Save as Draft
              </Button>
              <Button variant="ghost" className="w-full">
                Preview Listing
              </Button>
            </div>
          </div>

          {/* Fees Info */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-3">
            <h3 className="text-foreground">Fees & Commission</h3>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <span>Listing Fee:</span>
                <span className="text-foreground">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Success Fee:</span>
                <span className="text-foreground">5%</span>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex justify-between">
                <span>Final Value Fee:</span>
                <span className="text-[#fbbf24]">5% of final bid</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
