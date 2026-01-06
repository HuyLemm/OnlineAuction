import { useState } from "react";
import { ThumbsUp, ThumbsDown, User } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

interface RatingReviewFormProps {
  orderParty: {
    name: string;
    role: "buyer" | "seller";
  };
  onSubmit: (data: { score: 1 | -1; comment: string }) => void;
  loading?: boolean;
  existingRating?: {
    score: 1 | -1;
    comment: string;
    created_at?: string;
  } | null;
}

export function RatingReviewForm({
  orderParty,
  onSubmit,
  loading = false,
  existingRating,
}: RatingReviewFormProps) {
  const [score, setScore] = useState<1 | -1 | null>(
    existingRating?.score ?? null
  );
  const [comment, setComment] = useState(existingRating?.comment ?? "");
  const [isEditing, setIsEditing] = useState(!existingRating);

  const handleSubmit = () => {
    if (!score) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    onSubmit({
      score,
      comment: comment.trim(),
    });
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Rate {orderParty.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {existingRating
                ? "Your review for this transaction"
                : `Share your experience with this ${orderParty.role}`}
            </p>
          </div>
        </div>

        {/* Edit button */}
        {existingRating && !isEditing && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            Edit review
          </Button>
        )}
      </div>

      {/* Rating buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          disabled={!isEditing}
          onClick={() => setScore(1)}
          className={`group rounded-xl border p-5 flex flex-col items-center gap-2 transition
          ${score === 1 ? "border-green-500 bg-green-500/15" : "border-border"}
          ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <ThumbsUp
            className={`h-6 w-6 ${
              score === 1 ? "text-green-500" : "text-muted-foreground"
            }`}
          />
          <span className="font-medium text-green-500">Positive</span>
          <span className="text-xs text-muted-foreground">
            Smooth transaction
          </span>
        </button>

        <button
          disabled={!isEditing}
          onClick={() => setScore(-1)}
          className={`group rounded-xl border p-5 flex flex-col items-center gap-2 transition
          ${score === -1 ? "border-red-500 bg-red-500/15" : "border-border"}
          ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <ThumbsDown
            className={`h-6 w-6 ${
              score === -1 ? "text-red-500" : "text-muted-foreground"
            }`}
          />
          <span className="font-medium text-red-500">Negative</span>
          <span className="text-xs text-muted-foreground">Had issues</span>
        </button>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <Textarea
          disabled={!isEditing}
          placeholder={`Write a review about ${orderParty.name}...`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[120px] rounded-xl text-white text-lg"
        />
        {existingRating?.created_at && (
          <p className="text-xs text-muted-foreground text-right">
            Reviewed at {new Date(existingRating.created_at).toLocaleString()}
          </p>
        )}
      </div>

      {/* Submit / Status */}
      {isEditing ? (
        <Button
          disabled={loading}
          onClick={handleSubmit}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black font-semibold"
        >
          {loading
            ? "Saving..."
            : existingRating
            ? "Update Review"
            : "Submit Review"}
        </Button>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          You can edit your review at any time.
        </p>
      )}
    </div>
  );
}
