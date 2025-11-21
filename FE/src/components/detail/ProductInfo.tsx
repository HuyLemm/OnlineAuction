import { Package, Shield, Award, Eye, Heart } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ProductInfoProps {
  title: string;
  category: string;
  condition: string;
  itemNumber: string;
  description: string;
  specifications: { label: string; value: string }[];
  shipping: {
    methods: string[];
    cost: string;
    estimatedDays: string;
  };
  returns: string;
  watchers: number;
}

export function ProductInfo({
  title,
  category,
  condition,
  itemNumber,
  description,
  specifications,
  shipping,
  returns,
  watchers
}: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Badge variant="outline" className="border-border/50">
          {category}
        </Badge>
        <h1 className="text-foreground">{title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>2,345 views</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{watchers} watching</span>
          </div>
          <span>•</span>
          <span>Item #{itemNumber}</span>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full bg-secondary/50 border border-border/50">
          <TabsTrigger value="description" className="flex-1">
            Description
          </TabsTrigger>
          <TabsTrigger value="specs" className="flex-1">
            Specifications
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex-1">
            Shipping
          </TabsTrigger>
        </TabsList>

        {/* Description Tab */}
        <TabsContent value="description" className="space-y-4 mt-4">
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground leading-relaxed">{description}</p>
          </div>

          {/* Condition */}
          <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-[#fbbf24] mt-0.5" />
              <div>
                <h4 className="text-foreground mb-1">Condition</h4>
                <p className="text-muted-foreground">{condition}</p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/30 rounded-lg p-4 border border-border/50 text-center">
              <Shield className="h-6 w-6 text-[#10b981] mx-auto mb-2" />
              <p className="text-foreground">Authenticity Guaranteed</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 border border-border/50 text-center">
              <Award className="h-6 w-6 text-[#fbbf24] mx-auto mb-2" />
              <p className="text-foreground">Expert Verified</p>
            </div>
          </div>
        </TabsContent>

        {/* Specifications Tab */}
        <TabsContent value="specs" className="space-y-3 mt-4">
          {specifications.map((spec, index) => (
            <div
              key={index}
              className="flex justify-between py-3 border-b border-border/50 last:border-0"
            >
              <span className="text-muted-foreground">{spec.label}</span>
              <span className="text-foreground">{spec.value}</span>
            </div>
          ))}
        </TabsContent>

        {/* Shipping Tab */}
        <TabsContent value="shipping" className="space-y-4 mt-4">
          <div className="bg-secondary/30 rounded-lg p-4 border border-border/50 space-y-3">
            <div>
              <h4 className="text-foreground mb-2">Shipping Methods</h4>
              <ul className="space-y-1">
                {shipping.methods.map((method, index) => (
                  <li key={index} className="text-muted-foreground flex items-center gap-2">
                    <span className="text-[#fbbf24]">•</span>
                    {method}
                  </li>
                ))}
              </ul>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping Cost</span>
              <span className="text-foreground">{shipping.cost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span className="text-foreground">{shipping.estimatedDays}</span>
            </div>
          </div>

          <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
            <h4 className="text-foreground mb-2">Returns</h4>
            <p className="text-muted-foreground">{returns}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
