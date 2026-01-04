import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import {
  GET_PRODUCTS_FOR_ADMIN_API,
  GET_MAIN_CATEGORIES_API,
  UPDATE_PRODUCTS_FOR_ADMIN_API,
  TOGGLE_DELETE_PRODUCTS_FOR_ADMIN_API,
} from "../utils/api";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { LoadingSpinner } from "../state";

const formatCurrency = (value: string) => {
  if (!value) return "";
  const num = value.replace(/[^\d]/g, "");
  return "$" + Number(num).toLocaleString();
};
const parseCurrency = (value: string) => value.replace(/[^\d]/g, "");

interface Product {
  id: string;
  title: string;
  imageUrl: string;

  category: string;
  subcategory: string;

  startingBid: number;
  currentBid: number;
  buyNowPrice?: number;

  seller: string;
  sellerEmail: string;

  totalBids: number;

  status: "active" | "expired";

  description: string;

  createdAt: string;
  endDate: string;
}

interface Category {
  id: number;
  name: string;
}

const ITEMS_PER_PAGE = 10;

export function ProductManagementSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteMode, setDeleteMode] = useState<"delete" | "restore">("delete");

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    buyNowPrice: "",
    status: "active" as "active" | "expired",
  });

  const descriptionRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchProducts();
    fetchMainCategories();
  }, []);

  // ================= FETCH PRODUCTS =================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(GET_PRODUCTS_FOR_ADMIN_API);
      const json = await res.json();
      if (!json.success) throw new Error();

      setProducts(
        json.data.map((p: any) => ({
          id: p.id,
          title: p.title,
          imageUrl: p.image,
          category: p.parent_category_name,
          subcategory: p.subcategory_name,
          startingBid: Number(p.start_price),
          currentBid: Number(p.current_price),
          buyNowPrice: p.buy_now_price ? Number(p.buy_now_price) : undefined,
          seller: p.seller_name,
          sellerEmail: p.seller_email,
          totalBids: Number(p.total_bids),
          status: p.status,
          description: p.description,
          createdAt: p.created_at.split("T")[0],
          endDate: p.end_time.split("T")[0],
        }))
      );
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchMainCategories = async () => {
    try {
      const res = await fetch(GET_MAIN_CATEGORIES_API);
      const json = await res.json();
      if (!json.success) throw new Error();
      setMainCategories(json.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  // ================= FILTER =================
  let filteredProducts = products.filter((p) => {
    const matchSearch = p.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchCategory =
      categoryFilter === "all" || p.category === categoryFilter;

    let matchPrice = true;
    if (priceRange === "0-500") matchPrice = p.currentBid <= 500;
    else if (priceRange === "500-1000")
      matchPrice = p.currentBid > 500 && p.currentBid <= 1000;
    else if (priceRange === "1000-5000")
      matchPrice = p.currentBid > 1000 && p.currentBid <= 5000;
    else if (priceRange === "5000+") matchPrice = p.currentBid > 5000;

    return matchSearch && matchCategory && matchPrice;
  });

  // ================= SORT =================
  if (sortBy === "ending-soon") {
    filteredProducts.sort(
      (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    );
  } else if (sortBy === "most-bids") {
    filteredProducts.sort((a, b) => b.totalBids - a.totalBids);
  } else if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.currentBid - b.currentBid);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.currentBid - a.currentBid);
  } else {
    filteredProducts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleEditProduct = (p: Product) => {
    setSelectedProduct(p);

    setEditForm({
      title: p.title,
      description: p.description,
      buyNowPrice: p.buyNowPrice ? String(p.buyNowPrice) : "",
      status: p.status,
    });

    setIsEditDialogOpen(true);

    // ⬇️ SET HTML 1 LẦN
    setTimeout(() => {
      if (descriptionRef.current) {
        descriptionRef.current.innerHTML = p.description?.startsWith("<")
          ? p.description
          : `<p>${p.description}</p>`;
      }
    }, 0);
  };

  const handleSubmitEdit = async () => {
    if (!selectedProduct) return;

    try {
      const descriptionHTML = descriptionRef.current?.innerHTML || "";
      setIsSubmitting(true);

      const res = await fetchWithAuth(
        UPDATE_PRODUCTS_FOR_ADMIN_API(selectedProduct.id),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editForm.title,
            description: descriptionHTML,
            buyNowPrice: editForm.buyNowPrice
              ? Number(editForm.buyNowPrice)
              : null,
            status: editForm.status,
          }),
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id
            ? {
                ...p,
                title: editForm.title,
                description: editForm.description,
                buyNowPrice: editForm.buyNowPrice
                  ? Number(editForm.buyNowPrice)
                  : undefined,
                status: editForm.status,
              }
            : p
        )
      );

      toast.success("Product updated");
      setIsEditDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= HANDLERS =================
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const getPaginationPages = (currentPage: number, totalPages: number) => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  /* ================= DELETE ================= */

  const handleConfirmDeleteToggle = async () => {
    if (!selectedProduct) return;

    const expired = deleteMode === "delete";

    try {
      setIsSubmitting(true);

      const res = await fetchWithAuth(
        TOGGLE_DELETE_PRODUCTS_FOR_ADMIN_API(selectedProduct.id),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expired }),
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      toast.success(
        expired
          ? "Product expired successfully"
          : "Product restored successfully"
      );

      setIsDeleteConfirmOpen(false);
      fetchProducts(); // reload
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = (p: Product) => {
    setDeleteMode("delete");
    setSelectedProduct(p);
    setIsDeleteConfirmOpen(true);
  };

  const openRestoreConfirm = (p: Product) => {
    setDeleteMode("restore");
    setSelectedProduct(p);
    setIsDeleteConfirmOpen(true);
  };

  const statusBadge = (status: "active" | "expired") =>
    status === "active" ? (
      <Badge className="bg-green-500/10 text-green-400">Active</Badge>
    ) : (
      <Badge className="bg-red-500/10 text-red-400">Expired</Badge>
    );

  if (loading) return <LoadingSpinner />;

  // ================= RENDER =================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-yellow-500 mb-1">Product Management</h1>
          <p className="text-foreground">Manage all auction products</p>
        </div>
      </div>
      <Card className="bg-card border-border/50">
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterChange();
              }}
              placeholder="Search products by title..."
              className="pl-10 bg-secondary/50 border-border/50"
            />
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Category</Label>
              <Select
                value={categoryFilter}
                onValueChange={(v) => {
                  setCategoryFilter(v);
                  handleFilterChange();
                }}
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>

                  {mainCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Sort By</Label>
              <Select
                value={sortBy}
                onValueChange={(v) => {
                  setSortBy(v);
                  handleFilterChange();
                }}
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                  <SelectItem value="most-bids">Most Bids</SelectItem>
                  <SelectItem value="price-low">Price: Low → High</SelectItem>
                  <SelectItem value="price-high">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Price Range
              </Label>
              <Select
                value={priceRange}
                onValueChange={(v) => {
                  setPriceRange(v);
                  handleFilterChange();
                }}
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-500">$0 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                  <SelectItem value="5000+">$5,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Result */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Results</Label>
              <div className="h-10 flex items-center px-3 rounded-md bg-secondary/30 border border-border/50">
                <span className="text-[#fbbf24] font-medium">
                  {filteredProducts.length}
                </span>
                <span className="ml-2 text-muted-foreground">products</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="bg-card border-border/50">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left w-[420px]">Title</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Seller</th>
                  <th className="p-4 text-left">Bids</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((p) => (
                  <tr key={p.id} className="border-b border-border/30">
                    <td className="p-4">
                      <img
                        src={p.imageUrl}
                        className="w-20 h-20 rounded object-cover"
                      />
                    </td>
                    <td className="p-4">{p.title}</td>
                    <td className="p-4">
                      <p>{p.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.subcategory}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-[#fbbf24]">
                        ${p.currentBid.toLocaleString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <p>{p.seller}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.sellerEmail}
                      </p>
                    </td>
                    <td className="p-4">{p.totalBids}</td>
                    <td className="p-4">
                      <Badge
                        className={
                          p.status === "active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewProduct(p)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProduct(p)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        {/* DELETE */}
                        {p.status !== "expired" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500"
                            onClick={() => openDeleteConfirm(p)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Product</span>
                          </Button>
                        )}

                        {/* RESTORE */}
                        {p.status === "expired" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-500"
                            onClick={() => openRestoreConfirm(p)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Restore Product</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border/50 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}–
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {getPaginationPages(currentPage, totalPages).map((page, idx) =>
                page === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className="px-2 text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
                        : ""
                    }
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Dialog */}
      {/* ================= VIEW PRODUCT DIALOG ================= */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-[#0a0a0a] border-[#fbbf24]/20 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#fbbf24]">
              Product Details
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6 mt-4">
              {/* IMAGE */}
              <div className="relative h-80 rounded-lg overflow-hidden border border-[#fbbf24]/10">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-4 right-4 flex gap-2">
                  {selectedProduct.status === "active" ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      {selectedProduct.status}
                    </Badge>
                  )}
                </div>
              </div>

              {/* INFO GRID */}
              <div>
                <h2 className="text-[#fbbf24] mb-4 text-xl">
                  {selectedProduct.title}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* CATEGORY */}
                  <InfoBox label="Category">
                    <p className="text-sm text-yellow-500">
                      {selectedProduct.category}
                    </p>
                    <p className="text-xs text-white">
                      {selectedProduct.subcategory}
                    </p>
                  </InfoBox>

                  {/* CURRENT BID */}
                  <InfoBox label="Current Bid">
                    <p className="text-[#fbbf24]">
                      ${selectedProduct.currentBid.toLocaleString()}
                    </p>
                  </InfoBox>

                  {/* BUY NOW */}
                  {selectedProduct.buyNowPrice && (
                    <InfoBox label="Buy Now Price">
                      <p className="text-[#fbbf24]">
                        ${selectedProduct.buyNowPrice.toLocaleString()}
                      </p>
                    </InfoBox>
                  )}

                  {/* BIDS */}
                  <InfoBox label="Total Bids">
                    <p className="text-white">
                      {selectedProduct.totalBids} bids
                    </p>
                  </InfoBox>

                  {/* CREATED */}
                  <InfoBox label="Created Date">
                    <p className="text-sm text-white">
                      {selectedProduct.createdAt}
                    </p>
                  </InfoBox>

                  {/* END DATE */}
                  <InfoBox label="End Date">
                    <p className="text-sm text-white">
                      {selectedProduct.endDate}
                    </p>
                  </InfoBox>
                </div>
              </div>
              {/* SELLER */}
              <InfoBox label="Seller">
                <p className="text-sm text-yellow-500">
                  Full Name:&nbsp;{selectedProduct.seller}
                </p>
                <p className="text-sm text-white">
                  Email:&nbsp;{selectedProduct.sellerEmail}
                </p>
              </InfoBox>

              {/* DESCRIPTION */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#fbbf24]/5 to-transparent border border-[#fbbf24]/10">
                <p className="text-xs text-muted-foreground mb-2">
                  Description
                </p>
                <p
                  className="text-white leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: selectedProduct.description,
                  }}
                ></p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEditProduct(selectedProduct);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Product
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="flex-1 border-[#fbbf24]/30"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#0a0a0a] border-[#fbbf24]/20 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#fbbf24] text-xl">
              Edit Product
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6 mt-4">
              {/* IMAGE HERO */}
              <div className="relative h-80 rounded-lg overflow-hidden border border-[#fbbf24]/10">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />

                {/* STATUS BADGE */}
                <div className="absolute top-4 right-4">
                  <Badge
                    className={
                      selectedProduct.status === "active"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {selectedProduct.status}
                  </Badge>
                </div>
              </div>

              {/* FORM GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* TITLE */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-[#fbbf24]/5 to-transparent border border-[#fbbf24]/10 space-y-2">
                  <Label className="text-xs text-muted-foreground">Title</Label>
                  <Input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="bg-secondary/40 border-border/50 text-white"
                  />
                </div>

                {/* STATUS */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-[#fbbf24]/5 to-transparent border border-[#fbbf24]/10 space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Status
                  </Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(v) =>
                      setEditForm({ ...editForm, status: v as any })
                    }
                  >
                    <SelectTrigger className="bg-secondary/40 border-border/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* BUY NOW PRICE */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-[#fbbf24]/5 to-transparent border border-[#fbbf24]/10 space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Buy Now Price
                  </Label>

                  <Input
                    value={formatCurrency(editForm.buyNowPrice)}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        buyNowPrice: parseCurrency(e.target.value),
                      })
                    }
                    inputMode="numeric"
                    placeholder="$0"
                    className="bg-secondary/40 border-border/50 text-yellow-500 text-lg font-semibold"
                  />
                </div>

                {/* CURRENT BID (READONLY) */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-[#fbbf24]/10 to-transparent border border-[#fbbf24]/30 space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Current Bid
                  </Label>

                  <Input
                    disabled
                    value={`$${selectedProduct.currentBid.toLocaleString()}`}
                    className="
      bg-[#1a1a1a]
      border-[#fbbf24]/40
      text-yellow-500
      text-xl
      font-bold
      tracking-wide
      cursor-not-allowed
    "
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div
                ref={descriptionRef}
                contentEditable
                suppressContentEditableWarning
                className="
    p-4
    min-h-[120px]
    rounded-lg
    bg-secondary/40
    border border-[#fbbf24]/20
    text-white
    focus:outline-none
    focus:ring-1
    focus:ring-[#fbbf24]/50

  "
              />

              {/* ACTIONS */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-[#fbbf24]/30"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
                  onClick={handleSubmitEdit}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* LOADING OVERLAY */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 rounded-lg">
              <LoadingSpinner />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card border border-border/50 rounded-xl p-6 w-[420px] space-y-4 relative">
            {isSubmitting && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl z-10">
                <LoadingSpinner />
              </div>
            )}

            <h3
              className={`text-lg font-semibold ${
                deleteMode === "delete" ? "text-red-500" : "text-green-500"
              }`}
            >
              {deleteMode === "delete" ? "Expire Product" : "Restore Product"}
            </h3>

            <p className="text-muted-foreground">
              {deleteMode === "delete"
                ? "Product will be hidden from users but data is preserved."
                : "This product will become active and visible again."}
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className={`${
                  deleteMode === "delete"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-black`}
                onClick={handleConfirmDeleteToggle}
              >
                {deleteMode === "delete" ? "Expire" : "Restore"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-lg bg-gradient-to-br from-[#fbbf24]/5 to-transparent border border-[#fbbf24]/10">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="text-foreground">{children}</div>
    </div>
  );
}
