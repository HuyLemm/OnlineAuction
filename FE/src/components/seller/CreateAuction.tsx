import { useState, useMemo } from "react";
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

const formatCurrency = (value: number | "") =>
  value === "" ? "" : `$${value.toLocaleString()}`;

const parseCurrency = (value: string) => value.replace(/[^0-9]/g, "");

const digitsOnly = (s: string) => s.replace(/\D/g, "");

export function CreateAuction() {
  /* ====== STATES ====== */
  const [title, setTitle] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const imagePreviews = useMemo(
    () => images.map((f) => URL.createObjectURL(f)),
    [images]
  );

  const [startingBid, setStartingBid] = useState<number | "">("");
  const [bidStep, setBidStep] = useState<number | "">("");

  const [enableBuyNow, setEnableBuyNow] = useState(false);
  const [buyNow, setBuyNow] = useState<number | "">("");

  const [description, setDescription] = useState("");

  const [enableAutoExtend, setEnableAutoExtend] = useState(false);
  const [extendMinutes, setExtendMinutes] = useState<number | "">("");
  const [extendThreshold, setExtendThreshold] = useState<number | "">("");

  const [durationType, setDurationType] = useState("3");
  const [customDays, setCustomDays] = useState<number | "">("");
  const [customMinutes, setCustomMinutes] = useState<number | "">("");

  const [startDate, setStartDate] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);

  /* ====== DERIVED ====== */
  const descriptionLength = useMemo(
    () => description.replace(/<[^>]+>/g, "").trim().length,
    [description]
  );

  const isValid =
    title.trim() &&
    images.length >= 3 &&
    startingBid !== "" &&
    bidStep !== "" &&
    descriptionLength >= 100 &&
    startDate &&
    (!enableBuyNow || buyNow !== "") &&
    (!enableAutoExtend || (extendMinutes !== "" && extendThreshold !== "")) &&
    (durationType !== "other" || customDays !== "" || customMinutes !== "");

  /* ====== HANDLER ====== */
  const handleConfirmCreate = () => {
    setShowConfirm(false);

    const payload = {
      title,
      starting_bid: startingBid,
      bid_step: bidStep,
      buy_now_price: enableBuyNow ? buyNow : null,
      auto_extend: enableAutoExtend,
      auto_extend_minutes: enableAutoExtend ? extendMinutes : null,
      auto_extend_threshold: enableAutoExtend ? extendThreshold : null,
      duration_days:
        durationType === "other" ? customDays : Number(durationType),
      duration_minutes: durationType === "other" ? customMinutes : 0,
      start_date: startDate,
      images,
      description,
    };

    console.log("CREATE AUCTION:", payload);
  };

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
                  placeholder="e.g. Rolex Submariner 116610LN"
                />
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
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
            <h2 className="text-yellow-500">Images *</h2>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setImages(e.target.files ? Array.from(e.target.files) : [])
              }
              className="hidden"
              id="image-upload"
            />

            <label
              htmlFor="image-upload"
              className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Upload className="h-5 w-5" />
              Upload images
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square border border-border/50 rounded-lg overflow-hidden"
                >
                  <img src={src} className="w-full h-full object-cover" />
                  <button
                    onClick={() =>
                      setImages(images.filter((_, idx) => idx !== i))
                    }
                    className="absolute top-2 right-2 bg-black/60 h-6 w-6 rounded-full flex items-center justify-center"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  {i === 0 && (
                    <Badge className="absolute bottom-2 left-2 bg-[#fbbf24] text-black">
                      Primary
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <p className="text-muted-foreground">
              Min 3 imgs required & 5 Max imgs allowed ({images.length}/5)
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

              <div>
                <Label className="text-yellow-500 mb-2">Start Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border/50"
                  />
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* ===== AUTO EXTEND ===== */}
              <label className="flex items-center gap-2 text-yellow-500 mb-2">
                <input
                  type="checkbox"
                  checked={enableAutoExtend}
                  onChange={(e) => setEnableAutoExtend(e.target.checked)}
                  className="accent-[#fbbf24] rounded w-4 h-4"
                />
                Enable Auto Extend
              </label>

              {enableAutoExtend && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Extend by"
                      value={extendMinutes}
                      onChange={(e) => {
                        const raw = digitsOnly(e.target.value);
                        setExtendMinutes(raw === "" ? "" : Number(raw));
                      }}
                    />
                    <span className="text-muted-foreground">mins</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="If bid placed within"
                      value={extendThreshold}
                      onChange={(e) => {
                        const raw = digitsOnly(e.target.value);
                        setExtendThreshold(raw === "" ? "" : Number(raw));
                      }}
                    />
                    <span className="text-muted-foreground">mins</span>
                  </div>
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
              <div className="bg-card border border-border/50 rounded-xl p-6 w-[420px] space-y-4">
                <h3 className="text-foreground text-lg">Confirm Creation</h3>
                <p className="text-muted-foreground">
                  Are you sure you want to create this auction? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
                    onClick={handleConfirmCreate}
                  >
                    Confirm
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
