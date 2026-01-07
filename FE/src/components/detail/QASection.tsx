import { useState } from "react";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import {
  QUESTION_API,
  SELLER_REPLY_QUESTION_API,
  BIDDER_REPLY_QUESTION_API,
} from "../utils/api";
import { LoadingSpinner } from "../state";
import { useNavigate } from "react-router-dom";

/* ===============================
 * TYPES
 * =============================== */
interface QASectionProps {
  questions: {
    id: string;
    question: {
      content: string;
      askedBy: {
        id: string;
        name: string;
      };
      askedAt: string;
    };
    messages: {
      id: string;
      content: string;
      createdAt: string;
      sender: {
        id: string;
        name: string;
        role: "seller" | "bidder";
      };
    }[];
  }[];
  productId: string;
  currentUserRole: "seller" | "bidder" | "admin" | null;
  onQuestionSubmitted?: () => void;
}

/* ===============================
 * COMPONENT
 * =============================== */
export function QASection({
  questions,
  productId,
  currentUserRole,
  onQuestionSubmitted,
}: QASectionProps) {
  const navigate = useNavigate();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Ask question (bidder)
  const [showForm, setShowForm] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reply (seller / bidder)
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  /* ===============================
   * ASK QUESTION (BIDDER)
   * =============================== */
  const handleSubmitQuestion = async () => {
    if (!questionText.trim()) {
      toast.warning("Please enter your question");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetchWithAuth(QUESTION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          content: questionText,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      toast.success("Question submitted");
      setQuestionText("");
      setShowForm(false);
      onQuestionSubmitted?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit question");
    } finally {
      setSubmitting(false);
    }
  };

  /* ===============================
   * REPLY (SELLER / BIDDER)
   * =============================== */
  const handleSubmitReply = async (questionId: string) => {
    if (!replyText.trim()) {
      toast.warning("Please enter your reply");
      return;
    }

    const api =
      currentUserRole === "seller"
        ? SELLER_REPLY_QUESTION_API(questionId)
        : BIDDER_REPLY_QUESTION_API(questionId);

    try {
      setReplyLoading(true);

      const res = await fetchWithAuth(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      toast.success("Reply sent");
      setReplyText("");
      setReplyingId(null);
      onQuestionSubmitted?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to send reply");
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-[#fbbf24]" />
          <h3 className="text-foreground">Questions & Answers</h3>
          <Badge variant="outline">{questions.length}</Badge>
        </div>

        {currentUserRole === "bidder" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm((v) => !v)}
          >
            Ask Question
          </Button>
        )}
      </div>

      {/* Ask question form */}
      {showForm && currentUserRole === "bidder" && (
        <div className="space-y-3 p-4 bg-secondary/30 border rounded-lg">
          <Textarea
            placeholder="Ask the seller a question..."
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="text-white"
          />

          <div className="flex gap-2">
            <Button
              onClick={handleSubmitQuestion}
              disabled={submitting}
              className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
            >
              {submitting ? <LoadingSpinner size="sm" /> : "Submit Question"}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setQuestionText("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q) => {
          const isOpen = expandedId === q.id;

          return (
            <div key={q.id} className="border rounded-lg overflow-hidden">
              {/* Question */}
              <div className="p-4 bg-secondary/20">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#fbbf24] text-black">
                      {q.question.askedBy.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="text-sm flex items-center gap-2 mb-1">
                      {/* Tên người hỏi */}
                      <p className="font-medium text-yellow-500">
                        {q.question.askedBy.name}
                      </p>

                      {currentUserRole === "seller" && (
                        <Badge
                          variant="outline"
                          className="cursor-pointer text-xs border-green-500/20 bg-green-500/5 text-green-500"
                          onClick={() =>
                            navigate(`/profile/bidder/${q.question.askedBy.id}`)
                          }
                        >
                          View Legit
                        </Badge>
                      )}

                      <span className="text-muted-foreground">•</span>

                      {/* Thời gian hỏi */}
                      <p className="text-muted-foreground">
                        {new Date(q.question.askedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="text-lg text-white">{q.question.content}</p>

                    {q.messages.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 p-0 h-auto text-[#fbbf24]"
                        onClick={() => toggle(q.id)}
                      >
                        {isOpen ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide replies
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            View replies ({q.messages.length})
                          </>
                        )}
                      </Button>
                    )}

                    {currentUserRole && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-gray-400 hover:text-gray-300"
                        onClick={() =>
                          setReplyingId((prev) => (prev === q.id ? null : q.id))
                        }
                      >
                        {currentUserRole === "seller"
                          ? "Reply bidder"
                          : "Reply seller"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Conversation */}
              {isOpen && q.messages.length > 0 && (
                <div className="p-4 space-y-3 bg-black/20 border-t">
                  {q.messages.map((m) => (
                    <div key={m.id} className="flex gap-3">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback
                          className={
                            m.sender.role === "seller"
                              ? "bg-[#10b981] text-white"
                              : "bg-[#3b82f6] text-white"
                          }
                        >
                          {m.sender.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex gap-2 text-sm mb-1 items-center">
                          <p className="font-medium text-yellow-500">
                            {m.sender.name}
                          </p>

                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              m.sender.role === "seller"
                                ? "text-green-500 border-green-500/30"
                                : "text-gray-400 border-gray-400/30"
                            }`}
                          >
                            {m.sender.role}
                          </Badge>

                          <span className="text-muted-foreground">•</span>
                          <p className="text-muted-foreground">
                            {new Date(m.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <p className="text-white">{m.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              {replyingId === q.id && currentUserRole && (
                <div className="p-4 bg-secondary/30 border-t space-y-3">
                  <Textarea
                    placeholder={`Write your reply as ${currentUserRole}...`}
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="text-white"
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSubmitReply(q.id)}
                      disabled={replyLoading}
                      className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
                    >
                      {replyLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        "Send Reply"
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setReplyingId(null);
                        setReplyText("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty */}
      {questions.length === 0 && (
        <div className="text-center py-8 opacity-60">
          <MessageCircle className="h-12 w-12 mx-auto mb-3" />
          <p>No questions yet</p>
        </div>
      )}
    </div>
  );
}
