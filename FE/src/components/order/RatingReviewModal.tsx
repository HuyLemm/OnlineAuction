import { useState } from "react";
import { Star, ThumbsUp, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

interface RatingReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderParty: {
    name: string;
    role: "buyer" | "seller";
  };
  onSubmit?: (data: RatingData) => void;
}

interface RatingData {
  overallRating: number;
  communicationRating: number;
  accuracyRating: number;
  speedRating: number;
  review: string;
}

export function RatingReviewModal({ open, onOpenChange, orderParty, onSubmit }: RatingReviewModalProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [accuracyRating, setAccuracyRating] = useState(0);
  const [speedRating, setSpeedRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (overallRating === 0) {
      toast.error("Please provide an overall rating");
      return;
    }

    if (communicationRating === 0 || accuracyRating === 0 || speedRating === 0) {
      toast.error("Please rate all categories");
      return;
    }

    if (!review.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const data: RatingData = {
        overallRating,
        communicationRating,
        accuracyRating,
        speedRating,
        review
      };

      if (onSubmit) {
        onSubmit(data);
      }

      toast.success("Thank you for your feedback!");
      onOpenChange(false);
      setIsSubmitting(false);
    }, 1500);
  };

  const StarRating = ({ 
    value, 
    onChange, 
    size = "md" 
  }: { 
    value: number; 
    onChange: (rating: number) => void;
    size?: "sm" | "md" | "lg";
  }) => {
    const sizeClasses = {
      sm: "h-5 w-5",
      md: "h-6 w-6",
      lg: "h-8 w-8"
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                star <= value
                  ? "fill-[#fbbf24] text-[#fbbf24]"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 flex items-center justify-center">
              <User className="h-5 w-5 text-[#fbbf24]" />
            </div>
            <div>
              <p className="text-foreground">Rate & Review</p>
              <p className="text-muted-foreground">
                Share your experience with {orderParty.name}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Rate and review your transaction with {orderParty.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Overall Rating */}
          <div className="text-center p-6 bg-gradient-to-r from-[#fbbf24]/10 to-[#f59e0b]/10 rounded-xl">
            <Label className="text-foreground mb-4 block">Overall Experience</Label>
            <div className="flex justify-center mb-3">
              <StarRating value={overallRating} onChange={setOverallRating} size="lg" />
            </div>
            <p className="text-muted-foreground">
              {overallRating === 0 && "Select a rating"}
              {overallRating === 1 && "Poor"}
              {overallRating === 2 && "Fair"}
              {overallRating === 3 && "Good"}
              {overallRating === 4 && "Very Good"}
              {overallRating === 5 && "Excellent"}
            </p>
          </div>

          <Separator />

          {/* Detailed Ratings */}
          <div className="space-y-4">
            <h4 className="text-foreground">Detailed Ratings</h4>

            {/* Communication */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div className="flex-1">
                <p className="text-foreground">Communication</p>
                <p className="text-muted-foreground">
                  Response time and clarity
                </p>
              </div>
              <StarRating value={communicationRating} onChange={setCommunicationRating} />
            </div>

            {/* Accuracy */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div className="flex-1">
                <p className="text-foreground">
                  {orderParty.role === "seller" ? "Item Accuracy" : "Payment Accuracy"}
                </p>
                <p className="text-muted-foreground">
                  {orderParty.role === "seller" 
                    ? "Item matches description" 
                    : "Payment as agreed"
                  }
                </p>
              </div>
              <StarRating value={accuracyRating} onChange={setAccuracyRating} />
            </div>

            {/* Speed */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div className="flex-1">
                <p className="text-foreground">
                  {orderParty.role === "seller" ? "Shipping Speed" : "Payment Speed"}
                </p>
                <p className="text-muted-foreground">
                  {orderParty.role === "seller" 
                    ? "How quickly item was shipped" 
                    : "How quickly payment was made"
                  }
                </p>
              </div>
              <StarRating value={speedRating} onChange={setSpeedRating} />
            </div>
          </div>

          <Separator />

          {/* Written Review */}
          <div className="space-y-2">
            <Label htmlFor="review">Written Review</Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder={`Share your experience with ${orderParty.name}. What went well? What could be improved?`}
              className="bg-input border-border/50 min-h-[150px]"
            />
            <p className="text-muted-foreground">
              {review.length}/500 characters
            </p>
          </div>

          {/* Quick Tags */}
          <div className="space-y-2">
            <Label>Quick Tags (Optional)</Label>
            <div className="flex flex-wrap gap-2">
              {[
                "Excellent communication",
                "Fast shipping",
                "Item as described",
                "Professional",
                "Highly recommended",
                "Great packaging",
                "Responsive",
                "Trustworthy"
              ].map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border/50 hover:bg-[#fbbf24]/20 hover:text-[#fbbf24] hover:border-[#fbbf24]/30"
                  onClick={() => {
                    if (!review.includes(tag)) {
                      setReview(review ? `${review} ${tag}.` : `${tag}.`);
                    }
                  }}
                >
                  <ThumbsUp className="h-3 w-3 mr-1.5" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border/50"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>

          <p className="text-muted-foreground text-center">
            Your review will be publicly visible and help build trust in the community
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
