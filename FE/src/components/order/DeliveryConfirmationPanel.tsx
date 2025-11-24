import { useState } from "react";
import { PackageCheck, AlertTriangle, CheckCircle2, Upload, X, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";

interface DeliveryConfirmationPanelProps {
  isDelivered: boolean;
  deliveryConfirmed?: boolean;
  onConfirmDelivery?: (data: DeliveryConfirmationData) => void;
}

interface DeliveryConfirmationData {
  confirmed: boolean;
  conditionNotes?: string;
  photos?: File[];
  hasIssues: boolean;
  issueDescription?: string;
}

export function DeliveryConfirmationPanel({ 
  isDelivered, 
  deliveryConfirmed,
  onConfirmDelivery 
}: DeliveryConfirmationPanelProps) {
  const [conditionNotes, setConditionNotes] = useState("");
  const [hasIssues, setHasIssues] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      return true;
    });

    if (photos.length + validFiles.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    setPhotos([...photos, ...validFiles]);
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} photo(s) added`);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (hasIssues && !issueDescription.trim()) {
      toast.error("Please describe the issues with the item");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const data: DeliveryConfirmationData = {
        confirmed: true,
        conditionNotes,
        photos,
        hasIssues,
        issueDescription: hasIssues ? issueDescription : undefined
      };

      if (onConfirmDelivery) {
        onConfirmDelivery(data);
      }

      if (hasIssues) {
        toast.success("Delivery confirmed with issues. Support will contact you shortly.");
      } else {
        toast.success("Delivery confirmed successfully! You can now rate this transaction.");
      }
      
      setIsSubmitting(false);
    }, 1500);
  };

  if (!isDelivered) {
    return (
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center mx-auto mb-4">
            <PackageCheck className="h-8 w-8 text-[#8b5cf6]" />
          </div>
          <h3 className="text-foreground mb-2">Item In Transit</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your item is on its way. You'll be able to confirm delivery once the package arrives.
          </p>
        </div>
      </div>
    );
  }

  if (deliveryConfirmed) {
    return (
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-[#10b981]/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-[#10b981]" />
          </div>
          <h3 className="text-foreground mb-2">Delivery Confirmed</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You have successfully confirmed receipt of this item.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-foreground mb-2">Confirm Delivery</h3>
        <p className="text-muted-foreground">
          Please confirm that you have received the item and inspect its condition
        </p>
      </div>

      {/* Alert */}
      <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-[#fbbf24] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-foreground mb-1">Important Notice</p>
            <p className="text-muted-foreground">
              By confirming delivery, you acknowledge that you have received the item. 
              If there are any issues with the item, please report them before confirming.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Item Condition */}
        <div className="space-y-2">
          <Label htmlFor="condition-notes">Item Condition Assessment</Label>
          <Textarea
            id="condition-notes"
            value={conditionNotes}
            onChange={(e) => setConditionNotes(e.target.value)}
            placeholder="Describe the condition of the item as received (optional)..."
            className="bg-input border-border/50 min-h-[100px]"
          />
        </div>

        {/* Upload Photos */}
        <div className="space-y-2">
          <Label>Upload Photos (Optional, max 5 photos)</Label>
          <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-[#fbbf24]/50 transition-colors">
            <label htmlFor="photo-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-[#fbbf24]" />
                </div>
                <div>
                  <p className="text-foreground">Click to upload photos</p>
                  <p className="text-muted-foreground">
                    PNG or JPG up to 5MB each ({5 - photos.length} remaining)
                  </p>
                </div>
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={photos.length >= 5}
              />
            </label>
          </div>

          {/* Photo Preview */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-secondary/30">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Issues Checkbox */}
        <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
          <Checkbox
            id="has-issues"
            checked={hasIssues}
            onCheckedChange={(checked) => setHasIssues(checked as boolean)}
          />
          <div className="flex-1">
            <label
              htmlFor="has-issues"
              className="text-foreground cursor-pointer"
            >
              Report an issue with this item
            </label>
            <p className="text-muted-foreground">
              Check this if the item has damages, defects, or doesn't match the description
            </p>
          </div>
        </div>

        {/* Issue Description */}
        {hasIssues && (
          <div className="space-y-2 p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg">
            <Label htmlFor="issue-description" className="text-[#ef4444]">
              Issue Description *
            </Label>
            <Textarea
              id="issue-description"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Please describe the issues in detail..."
              className="bg-input border-border/50 min-h-[120px]"
            />
            <p className="text-muted-foreground">
              Our support team will review your report and help resolve the issue
            </p>
          </div>
        )}

        {/* Confirm Button */}
        <div className="space-y-4">
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`w-full ${
              hasIssues
                ? "bg-[#ef4444] hover:bg-[#ef4444]/90 text-white"
                : "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
            }`}
          >
            {isSubmitting ? "Processing..." : hasIssues ? "Confirm with Issues" : "Confirm Delivery"}
          </Button>

          <p className="text-muted-foreground text-center">
            {hasIssues 
              ? "A support ticket will be created to address your concerns"
              : "After confirmation, you can rate and review this transaction"
            }
          </p>
        </div>
      </div>
    </div>
  );
}
