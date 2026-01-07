import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  FolderTree,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";
import {
  GET_CATEGORIES_FOR_SIDEBAR_API,
  CREATE_PARENT_CATEGORY_API,
  CREATE_SUB_CATEGORY_API,
  UPDATE_PARENT_CATEGORY_API,
  UPDATE_SUB_CATEGORY_API,
  DELETE_PARENT_CATEGORY_API,
  DELETE_SUB_CATEGORY_API,
} from "../utils/api";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { LoadingSpinner } from "../state";

interface Subcategory {
  id: number;
  label: string;
  count: number;
}

interface Category {
  id: number;
  label: string;
  count: number;
  subcategories: Subcategory[];
}

export function CategoryManagementSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );

  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [editingParent, setEditingParent] = useState<Category | null>(null);
  const [editingSub, setEditingSub] = useState<{
    parentId: number;
    sub: Subcategory;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<
    | { type: "parent"; category: Category }
    | { type: "sub"; parentId: number; sub: Subcategory }
    | null
  >(null);

  const [parentForm, setParentForm] = useState({ label: "" });
  const [subForm, setSubForm] = useState({ label: "" });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      const res = await fetch(GET_CATEGORIES_FOR_SIDEBAR_API);
      const json = await res.json();
      if (!json.success) throw new Error();
      setCategories(json.data);
      setExpandedCategories(new Set(json.data.map((c: Category) => c.id)));
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= TOGGLE =================
  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ================= SAVE PARENT =================
  const saveParent = async () => {
    if (!parentForm.label.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingParent) {
        await fetchWithAuth(UPDATE_PARENT_CATEGORY_API(editingParent.id), {
          method: "PUT",
          body: JSON.stringify({ name: parentForm.label }),
        });
        toast.success("Parent category updated successfully");
      } else {
        await fetchWithAuth(CREATE_PARENT_CATEGORY_API, {
          method: "POST",
          body: JSON.stringify({ name: parentForm.label }),
        });
        toast.success("Parent category created successfully");
      }

      setIsParentModalOpen(false);
      await fetchCategories();
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= SAVE SUB =================
  const saveSub = async () => {
    if (!subForm.label.trim() || !editingSub?.parentId) {
      toast.error("Subcategory name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingSub.sub) {
        await fetchWithAuth(UPDATE_SUB_CATEGORY_API(editingSub.sub.id), {
          method: "PUT",
          body: JSON.stringify({ name: subForm.label }),
        });
        toast.success("Subcategory updated successfully");
      } else {
        await fetchWithAuth(CREATE_SUB_CATEGORY_API, {
          method: "POST",
          body: JSON.stringify({
            parentId: editingSub.parentId,
            name: subForm.label,
          }),
        });
        toast.success("Subcategory created successfully");
      }

      setIsSubModalOpen(false);
      await fetchCategories();
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= CONFIRM DELETE =================
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsSubmitting(true);

      if (deleteTarget.type === "parent") {
        await fetchWithAuth(
          DELETE_PARENT_CATEGORY_API(deleteTarget.category.id),
          { method: "DELETE" }
        );
        toast.success("Parent category deleted successfully");
      } else {
        await fetchWithAuth(DELETE_SUB_CATEGORY_API(deleteTarget.sub.id), {
          method: "DELETE",
        });
        toast.success("Subcategory deleted successfully");
      }

      setIsConfirmDeleteOpen(false);
      await fetchCategories();
    } catch (e: any) {
      toast.error(e.message || "Delete failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= RENDER =================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-foreground mb-2">Category Management</h1>
          <p className="text-muted-foreground">
            Organize and manage auction categories hierarchy
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
          onClick={() => {
            setEditingParent(null);
            setParentForm({ label: "" });
            setIsParentModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Parent Category
        </Button>
      </div>

      {/* LIST */}
      <Card className="bg-card border-border/50">
        <div className="p-6 space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="border border-border/50 rounded-lg bg-secondary/20"
            >
              <div className="flex items-center gap-3 p-4">
                <button onClick={() => toggleCategory(cat.id)}>
                  {expandedCategories.has(cat.id) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>
                <FolderTree className="h-5 w-5 text-[#fbbf24]" />
                <div className="flex-1 flex items-center gap-3">
                  <span>{cat.label}</span>
                  <Badge className="bg-[#fbbf24] text-black">{cat.count} items</Badge>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingSub({ parentId: cat.id, sub: null as any });
                    setSubForm({ label: "" });
                    setIsSubModalOpen(true);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Sub
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingParent(cat);
                    setParentForm({ label: cat.label });
                    setIsParentModalOpen(true);
                  }}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500"
                  onClick={() => {
                    setDeleteTarget({ type: "parent", category: cat });
                    setIsConfirmDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {expandedCategories.has(cat.id) && (
                <div className="border-t border-border/50 bg-secondary/10">
                  {cat.subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center gap-3 p-4 pl-14"
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <span className="text-muted-foreground">
                          {sub.label}
                        </span>
                        <Badge variant="outline">{sub.count} items</Badge>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingSub({ parentId: cat.id, sub });
                          setSubForm({ label: sub.label });
                          setIsSubModalOpen(true);
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500"
                        onClick={() => {
                          setDeleteTarget({
                            type: "sub",
                            parentId: cat.id,
                            sub,
                          });
                          setIsConfirmDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* ===== MODALS ===== */}

      {/* Parent Modal */}
      {isParentModalOpen && (
        <Modal
          title={
            editingParent ? "Edit Parent Category" : "Create Parent Category"
          }
          isSubmitting={isSubmitting}
          onCancel={() => setIsParentModalOpen(false)}
          onConfirm={saveParent}
          confirmText="Save"
        >
          <Label className="mb-4 text-muted-foreground text-sm ">Name*</Label>
          <Input
            value={parentForm.label}
            onChange={(e) => setParentForm({ label: e.target.value })}
          />
        </Modal>
      )}

      {/* Sub Modal */}
      {isSubModalOpen && (
        <Modal
          title={editingSub?.sub ? "Edit Subcategory" : "Create Subcategory"}
          isSubmitting={isSubmitting}
          onCancel={() => setIsSubModalOpen(false)}
          onConfirm={saveSub}
          confirmText="Save"
        >
          <Label className="mb-4 text-muted-foreground text-sm ">Name*</Label>
          <Input
            value={subForm.label}
            onChange={(e) => setSubForm({ label: e.target.value })}
          />
        </Modal>
      )}

      {/* Confirm Delete */}
      {isConfirmDeleteOpen && (
        <Modal
          title="Confirm Deletion"
          description="Are you sure you want to delete this category? This action cannot be undone."
          isSubmitting={isSubmitting}
          onCancel={() => setIsConfirmDeleteOpen(false)}
          onConfirm={confirmDelete}
          confirmText="Delete"
        />
      )}
    </div>
  );
}

function Modal({
  title,
  description,
  children,
  isSubmitting,
  onCancel,
  onConfirm,
  confirmText,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card border border-border/50 rounded-xl p-6 w-[420px] space-y-4 relative">
        {isSubmitting && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl z-10">
            <LoadingSpinner />
          </div>
        )}

        <h3 className="text-foreground text-lg">{title}</h3>
        {description && <p className="text-muted-foreground">{description}</p>}

        {children}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" disabled={isSubmitting} onClick={onCancel}>
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
            onClick={onConfirm}
          >
            {isSubmitting ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
