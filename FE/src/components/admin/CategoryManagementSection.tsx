import { useState } from "react";
import { Plus, Edit2, Trash2, FolderTree, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export function CategoryManagementSection() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Luxury Watches",
      slug: "luxury-watches",
      description: "Premium timepieces from top brands",
      itemCount: 234,
      imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400",
      isActive: true,
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Fine Art",
      slug: "fine-art",
      description: "Paintings, sculptures, and contemporary art",
      itemCount: 189,
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
      isActive: true,
      createdAt: "2024-01-20"
    },
    {
      id: "3",
      name: "Rare Collectibles",
      slug: "rare-collectibles",
      description: "Limited edition items and memorabilia",
      itemCount: 156,
      imageUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400",
      isActive: true,
      createdAt: "2024-02-01"
    },
    {
      id: "4",
      name: "Vintage Cars",
      slug: "vintage-cars",
      description: "Classic and vintage automobiles",
      itemCount: 78,
      imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
      isActive: false,
      createdAt: "2024-02-10"
    },
  ]);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    isActive: true,
  });

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      isActive: category.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
      toast.success("Category updated successfully");
    } else {
      // Create new category
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        itemCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCategories([...categories, newCategory]);
      toast.success("Category created successfully");
    }
    setIsDialogOpen(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast.success("Category deleted successfully");
  };

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, isActive: !cat.isActive }
        : cat
    ));
    toast.success("Category status updated");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Category Management</h1>
          <p className="text-muted-foreground">
            Organize and manage auction categories
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={handleCreateCategory}
              className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Create New Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Luxury Watches"
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., luxury-watches"
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the category..."
                  className="bg-secondary/50 border-border/50 min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div>
                  <Label>Active Status</Label>
                  <p className="text-sm text-muted-foreground">Make this category visible to users</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSaveCategory}
                  className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
                >
                  {editingCategory ? "Update Category" : "Create Category"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden bg-card border-border/50 hover:border-[#fbbf24]/30 transition-all">
            <div className="relative h-48">
              <img 
                src={category.imageUrl} 
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute top-4 right-4 flex gap-2">
                {category.isActive ? (
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    <Eye className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Inactive
                  </Badge>
                )}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white mb-1">{category.name}</h3>
                <p className="text-white/80 text-sm">{category.itemCount} items</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {category.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground">Created {category.createdAt}</span>
                <span className="text-xs text-muted-foreground">/{category.slug}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditCategory(category)}
                  className="flex-1"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCategoryStatus(category.id)}
                  className="flex-1"
                >
                  {category.isActive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {category.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
