import { useState, useMemo, useEffect } from "react";
import { Upload, Plus, X, Calendar, DollarSign, FileText } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { fetchWithAuth } from "../utils/fetchWithAuth";
import {
  CREATE_AUCTION_API,
  GET_CATEGORIES_FOR_MENU_API,
  GET_AUTO_EXTEND_CONFIG_API,
  UPLOAD_IMAGE_API,
} from "../utils/api";

import { toast } from "sonner";
import { LoadingSpinner } from "../state";

const formatCurrency = (value: number | "") =>
  value === "" ? "" : `$${value.toLocaleString()}`;

const parseCurrency = (value: string) => value.replace(/[^0-9]/g, "");

const digitsOnly = (s: string) => s.replace(/\D/g, "");

type SubCategory = {
  id: number;
  label: string;
};

type ImageInput = {
  file: File | null;
  previewUrl: string;
};

export function CreateAuction() {
  /* ====== STATES ====== */
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<SubCategory[]>([]);

  const [uploadSessionId, setUploadSessionId] = useState(crypto.randomUUID());

  const [images, setImages] = useState<ImageInput[]>([
    { file: null, previewUrl: "" },
    { file: null, previewUrl: "" },
    { file: null, previewUrl: "" },
  ]);

  const [startingBid, setStartingBid] = useState<number | "">("");
  const [bidStep, setBidStep] = useState<number | "">("");

  const [enableBuyNow, setEnableBuyNow] = useState(false);
  const [buyNow, setBuyNow] = useState<number | "">("");

  const [description, setDescription] = useState("");

  const [enableAutoExtend, setEnableAutoExtend] = useState(false);
  const [autoExtendConfig, setAutoExtendConfig] = useState<{
    thresholdMinutes: number;
    durationMinutes: number;
  } | null>(null);

  const [durationType, setDurationType] = useState("3");
  const [customDays, setCustomDays] = useState<number | "">("");
  const [customMinutes, setCustomMinutes] = useState<number | "">("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ====== FETCH CATEGORIES ====== */
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(GET_CATEGORIES_FOR_MENU_API);
      const json = await res.json();
      if (!json.success) return;

      const subs: SubCategory[] = json.data.flatMap(
        (c: any) => c.subcategories
      );
      setCategories(subs);
    };

    fetchCategories();
  }, []);

  /* ====== RESET ====== */
  const resetForm = () => {
    setTitle("");
    setCategoryId("");
    setImages([
      { file: null, previewUrl: "" },
      { file: null, previewUrl: "" },
      { file: null, previewUrl: "" },
    ]);
    setStartingBid("");
    setBidStep("");
    setEnableBuyNow(false);
    setBuyNow("");
    setDescription("");
    setEnableAutoExtend(false);
    setDurationType("3");
    setCustomDays("");
    setCustomMinutes("");
    setShowConfirm(false);
    setUploadSessionId(crypto.randomUUID());
  };

  /* ====== AUTO EXTEND ====== */
  const handleToggleAutoExtend = async (checked: boolean) => {
    setEnableAutoExtend(checked);

    if (checked && !autoExtendConfig) {
      const res = await fetchWithAuth(GET_AUTO_EXTEND_CONFIG_API);
      const json = await res.json();
      if (json.success) setAutoExtendConfig(json.data);
    }
  };

  /* ====== DERIVED ====== */
  const descriptionLength = useMemo(
    () => description.replace(/<[^>]+>/g, "").trim().length,
    [description]
  );

  const validImages = images.filter((i) => i.file !== null);

  const computeDurationMinutes = () => {
    if (durationType === "other") {
      return Number(customDays) * 1440 + Number(customMinutes);
    }
    return Number(durationType) * 1440;
  };

  const isValid =
    title.trim() &&
    categoryId &&
    validImages.length >= 3 &&
    startingBid !== "" &&
    bidStep !== "" &&
    descriptionLength >= 100 &&
    (!enableBuyNow || buyNow !== "") &&
    computeDurationMinutes() > 0;

  /* ====== IMAGE HANDLERS ====== */

  const addImage = () => {
    if (images.length >= 5) return;
    setImages((prev) => [...prev, { file: null, previewUrl: "" }]);
  };

  const removeImage = (idx: number) => {
    if (idx < 3) return;
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadImages = async () => {
    for (const img of images) {
      if (!img.file) continue;

      const formData = new FormData();
      formData.append("image", img.file);
      formData.append("uploadSessionId", uploadSessionId);

      const res = await fetchWithAuth(UPLOAD_IMAGE_API, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error("Image upload failed");
      }
    }
  };

  const handleSelectImage = (idx: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setImages((prev) => {
        const copy = [...prev];
        copy[idx] = {
          file,
          previewUrl: URL.createObjectURL(file),
        };
        return copy;
      });
    };

    input.click();
  };

  /* ====== SUBMIT ====== */
  const handleConfirmCreate = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await uploadImages();

      const res = await fetchWithAuth(CREATE_AUCTION_API, {
        method: "POST",
        body: JSON.stringify({
          title,
          categoryId: Number(categoryId),
          startPrice: startingBid,
          bidStep,
          buyNowPrice: enableBuyNow ? buyNow : null,
          auctionType: enableBuyNow ? "buy_now" : "traditional",
          description,
          autoExtend: enableAutoExtend,
          durationMinutes: computeDurationMinutes(),
          uploadSessionId, // 🔥 QUAN TRỌNG
        }),
      });

      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || "Create auction failed");
        return;
      }

      toast.success("Auction created successfully 🎉");
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-foreground mb-2">Create New Auction</h1>
        <p className="text-muted-foreground">
          List your item and start receiving bids
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* ===== BASIC INFO ===== */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
            <h2 className="text-foreground text-lg">Basic Information</h2>
            <Separator className="bg-border/50" />

            <div className="space-y-4">
              <div>
                <Label className="text-yellow-500 mb-2">Product Title *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-secondary/50 border-border/50"
                  placeholder="Auction title"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-yellow-500 mb-2">Category *</Label>

                <Select value={categoryId} onValueChange={setCategoryId}>
                  {/* TRIGGER */}
                  <SelectTrigger className="bg-black/60 border border-[#fbbf24]/20 text-gray-300 hover:bg-black/80 focus:ring-0">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  {/* DROPDOWN */}
                  <SelectContent className="bg-[#0a0a0a] border border-[#fbbf24]/30 shadow-xl">
                    {categories.map((sub) => {
                      const isActive = categoryId === String(sub.id);

                      return (
                        <SelectItem
                          key={sub.id}
                          value={String(sub.id)}
                          className={`cursor-pointer text-gray-300 focus:bg-[#fbbf24]/20 focus:text-[#fbbf24] hover:bg-[#fbbf24]/20 hover:text-[#fbbf24] ${
                            isActive ? "bg-[#fbbf24]/25 text-[#fbbf24]" : ""
                          }`}
                        >
                          {sub.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-yellow-500 mb-2">Description *</Label>
                <div className="border border-border/50 rounded-lg overflow-hidden bg-secondary/50">
                  <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    value={description}
                    onEditorChange={(content) => setDescription(content)}
                    init={{
                      height: 300,
                      menubar: false,
                      skin: "oxide-dark",
                      content_css: "dark",
                      plugins: [
                        "lists",
                        "link",
                        "image",
                        "table",
                        "preview",
                        "code",
                      ],
                      toolbar:
                        "undo redo | bold italic underline | bullist numlist | link image | preview code",
                    }}
                  />
                </div>
                <p className="text-muted-foreground">
                  Minimum 100 characters ({descriptionLength}/100)
                </p>
              </div>
            </div>
          </div>

          {/* IMAGES */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-3">
            <Label className="text-yellow-500">Images *</Label>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg border border-dashed border-border/50 flex items-center justify-center bg-black/40 hover:bg-black/60 transition cursor-pointer"
                  onClick={() => handleSelectImage(idx)}
                >
                  {/* IMAGE PREVIEW */}
                  {img.previewUrl ? (
                    <>
                      <img
                        src={img.previewUrl}
                        alt={`preview-${idx}`}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />

                      {/* ⭐ MAIN BADGE */}
                      {idx === 0 && img.previewUrl && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-[#fbbf24] text-black text-xs px-2 py-0.5 shadow">
                            Main
                          </Badge>
                        </div>
                      )}
                      {/* REMOVE BUTTON */}
                      {idx >= 3 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                          className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-red-500 hover:bg-black"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload size={20} />
                      <span className="text-xs">
                        {idx === 0 ? "Main image" : "Upload"}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* ADD MORE */}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={addImage}
                  className="aspect-square rounded-lg border border-dashed border-border/50 flex items-center justify-center text-muted-foreground hover:bg-black/40 transition"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>

            <p className="text-muted-foreground text-xs">
              Minimum 3 images, maximum 5
            </p>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-6">
          {/* ===== AUCTION SETTINGS ===== */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
            <h2 className="text-foreground">Auction Settings</h2>
            <Separator className="bg-border/50" />

            <div className="space-y-4">
              <div>
                <Label className="text-yellow-500 mb-2">Starting Bid *</Label>
                <Input
                  value={formatCurrency(startingBid)}
                  onChange={(e) => {
                    const raw = parseCurrency(e.target.value);
                    setStartingBid(raw === "" ? "" : Number(raw));
                  }}
                />
              </div>

              <div>
                <Label className="text-yellow-500 mb-2">Bid Increment *</Label>
                <Input
                  value={formatCurrency(bidStep)}
                  onChange={(e) => {
                    const raw = parseCurrency(e.target.value);
                    setBidStep(raw === "" ? "" : Number(raw));
                  }}
                />
              </div>

              <div>
                {/* BUY NOW TOGGLE */}
                <label className="flex items-center gap-2 text-yellow-500 mb-2">
                  <input
                    type="checkbox"
                    checked={enableBuyNow}
                    onChange={(e) => setEnableBuyNow(e.target.checked)}
                    className="accent-[#fbbf24] w-4 h-4 "
                  />
                  Enable Buy Now
                </label>

                {enableBuyNow && (
                  <Input
                    value={formatCurrency(buyNow)}
                    onChange={(e) => {
                      const raw = parseCurrency(e.target.value);
                      setBuyNow(raw === "" ? "" : Number(raw));
                    }}
                  />
                )}
              </div>

              <Separator className="bg-border/50" />

              <div>
                <Label className="text-yellow-500 mb-2">
                  Auction Duration *
                </Label>
                <Select onValueChange={setDurationType} value={durationType}>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="5">5 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {durationType === "other" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="0"
                        value={customDays}
                        onChange={(e) => {
                          const raw = digitsOnly(e.target.value);
                          setCustomDays(raw === "" ? "" : Number(raw));
                        }}
                      />
                      <span className="text-muted-foreground">days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="0"
                        value={customMinutes}
                        onChange={(e) => {
                          const raw = digitsOnly(e.target.value);
                          setCustomMinutes(raw === "" ? "" : Number(raw));
                        }}
                      />
                      <span className="text-muted-foreground">mins</span>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="bg-border/50" />

              {/* ===== AUTO EXTEND ===== */}
              <label className="flex items-center gap-2 text-yellow-500 mb-2">
                <input
                  type="checkbox"
                  checked={enableAutoExtend}
                  onChange={(e) => handleToggleAutoExtend(e.target.checked)}
                  className="accent-[#fbbf24] rounded w-4 h-4"
                />
                Enable Auto Extend
              </label>

              {enableAutoExtend && autoExtendConfig && (
                <div className="bg-black/40 border border-[#fbbf24]/20 rounded-lg p-4 text-sm">
                  <p className="text-gray-300">
                    If a bid is placed within{" "}
                    <span className="text-[#fbbf24] font-semibold">
                      {autoExtendConfig.thresholdMinutes} minutes
                    </span>{" "}
                    before the auction ends,
                  </p>

                  <p className="text-gray-300">
                    the auction will be automatically extended by{" "}
                    <span className="text-[#fbbf24] font-semibold">
                      {autoExtendConfig.durationMinutes} minutes
                    </span>
                    .
                  </p>

                  <p className="text-gray-500 mt-2 text-xs">
                    These values are set by the administrator and apply to all
                    auctions.
                  </p>
                </div>
              )}
            </div>

            {/* SAVE */}
            <div className="bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/5 border border-[#fbbf24]/20 rounded-xl p-6">
              <Button
                disabled={!isValid}
                onClick={() => setShowConfirm(true)}
                className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
              >
                Save Auction
              </Button>
            </div>
          </div>

          {/* ===== ACTIONS ===== */}
          {showConfirm && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-card border border-border/50 rounded-xl p-6 w-[420px] space-y-4 relative">
                {isSubmitting && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl z-10">
                    <LoadingSpinner />
                  </div>
                )}

                <h3 className="text-foreground text-lg">Confirm Creation</h3>
                <p className="text-muted-foreground">
                  Are you sure you want to create this auction? This action
                  cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
                    onClick={handleConfirmCreate}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
