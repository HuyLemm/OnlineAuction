import { useState } from "react";
import { Check, X, Eye, Flag, Clock, Package } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  seller: string;
  category: string;
  startingBid: number;
  imageUrl: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  submittedAt: string;
  reason?: string;
}

export function ProductModerationSection() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      title: "Vintage Rolex Submariner",
      seller: "John Doe",
      category: "Luxury Watches",
      startingBid: 12500,
      imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400",
      description: "Rare 1960s Rolex Submariner in excellent condition. Original box and papers included.",
      status: "pending",
      submittedAt: "2024-11-26 10:30"
    },
    {
      id: "2",
      title: "Abstract Oil Painting",
      seller: "Jane Smith",
      category: "Fine Art",
      startingBid: 8500,
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
      description: "Contemporary abstract oil painting by emerging artist.",
      status: "pending",
      submittedAt: "2024-11-26 09:15"
    },
    {
      id: "3",
      title: "First Edition Comic Book",
      seller: "Mike Johnson",
      category: "Rare Collectibles",
      startingBid: 3200,
      imageUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400",
      description: "First edition Marvel comic in pristine condition.",
      status: "flagged",
      submittedAt: "2024-11-26 08:45",
      reason: "Suspicious pricing - reported by community"
    },
    {
      id: "4",
      title: "Antique Pocket Watch",
      seller: "Sarah Williams",
      category: "Luxury Watches",
      startingBid: 1800,
      imageUrl: "https://images.unsplash.com/photo-1509941943102-10c232535736?w=400",
      description: "19th century pocket watch with intricate engravings.",
      status: "approved",
      submittedAt: "2024-11-25 16:20"
    },
    {
      id: "5",
      title: "Modern Art Sculpture",
      seller: "Tom Brown",
      category: "Fine Art",
      startingBid: 5500,
      imageUrl: "https://images.unsplash.com/photo-1544967082-d9d25d867eeb?w=400",
      description: "Contemporary metal sculpture by renowned artist.",
      status: "rejected",
      submittedAt: "2024-11-25 14:10",
      reason: "Insufficient authentication documents"
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = (productId: string) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, status: "approved" as const } : p
    ));
    toast.success("Product approved successfully");
  };

  const handleReject = (productId: string, reason: string) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, status: "rejected" as const, reason } : p
    ));
    toast.success("Product rejected");
    setSelectedProduct(null);
    setRejectionReason("");
  };

  const handleFlag = (productId: string, reason: string) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, status: "flagged" as const, reason } : p
    ));
    toast.success("Product flagged for review");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] border-0"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500/10 text-green-500 border-0"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-500 border-0"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
      case "flagged":
        return <Badge className="bg-red-500/10 text-red-500 border-0"><Flag className="h-3 w-3 mr-1" />Flagged</Badge>;
      default:
        return null;
    }
  };

  const filterProductsByStatus = (status: string) => {
    if (status === "all") return products;
    return products.filter(p => p.status === status);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="overflow-hidden bg-card border-border/50 hover:border-[#fbbf24]/30 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="relative h-48 md:h-auto rounded-lg overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            {getStatusBadge(product.status)}
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-foreground">{product.title}</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border/50 max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{product.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Seller</p>
                        <p className="text-foreground">{product.seller}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Category</p>
                        <p className="text-foreground">{product.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Starting Bid</p>
                        <p className="text-foreground">${product.startingBid.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                        <p className="text-foreground">{product.submittedAt}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Description</p>
                      <p className="text-foreground">{product.description}</p>
                    </div>
                    {product.reason && (
                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-muted-foreground mb-1">Reason</p>
                        <p className="text-foreground">{product.reason}</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Seller: {product.seller}</span>
              <span>•</span>
              <span>{product.category}</span>
              <span>•</span>
              <span>{product.submittedAt}</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Starting Bid</p>
              <p className="text-[#fbbf24]">${product.startingBid.toLocaleString()}</p>
            </div>
            
            {product.status === "pending" || product.status === "flagged" ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(product.id)}
                  className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProduct(product)}
                      className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border/50">
                    <DialogHeader>
                      <DialogTitle>Reject Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-sm">
                        Please provide a reason for rejecting "{product.title}"
                      </p>
                      <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                        className="bg-secondary/50 border-border/50 min-h-[120px]"
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleReject(product.id, rejectionReason)}
                          className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                        >
                          Confirm Rejection
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : null}
          </div>

          {product.reason && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500">
                <Flag className="h-3 w-3 inline mr-2" />
                {product.reason}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">Product Moderation</h1>
        <p className="text-muted-foreground">
          Review and approve auction listings
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 bg-secondary/50">
          <TabsTrigger value="pending">
            Pending ({filterProductsByStatus("pending").length})
          </TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged ({filterProductsByStatus("flagged").length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({filterProductsByStatus("approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({filterProductsByStatus("rejected").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {filterProductsByStatus("pending").length > 0 ? (
            filterProductsByStatus("pending").map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <Card className="p-12 text-center bg-card border-border/50">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No pending products</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4 mt-6">
          {filterProductsByStatus("flagged").length > 0 ? (
            filterProductsByStatus("flagged").map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <Card className="p-12 text-center bg-card border-border/50">
              <Flag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No flagged products</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-6">
          {filterProductsByStatus("approved").length > 0 ? (
            filterProductsByStatus("approved").map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <Card className="p-12 text-center bg-card border-border/50">
              <Check className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No approved products</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-6">
          {filterProductsByStatus("rejected").length > 0 ? (
            filterProductsByStatus("rejected").map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <Card className="p-12 text-center bg-card border-border/50">
              <X className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No rejected products</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
