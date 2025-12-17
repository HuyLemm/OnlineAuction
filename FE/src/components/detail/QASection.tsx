import { useState } from "react";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

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
    answer?: {
      content: string;
      answeredBy: {
        id: string;
        name: string;
      };
      answeredAt: string;
    };
  }[];
}

export function QASection({ questions }: QASectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [questionText, setQuestionText] = useState("");

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-[#fbbf24]" />
          <h3 className="text-foreground">Questions & Answers</h3>
          <Badge variant="outline" className="border-border/50">
            {questions.length}
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="border-border/50"
          onClick={() => setShowForm((v) => !v)}
        >
          Ask Question
        </Button>
      </div>

      {/* Ask question (UI only) */}
      {showForm && (
        <div className="space-y-3 p-4 bg-secondary/30 border border-border/50 rounded-lg">
          <Textarea
            placeholder="Ask the seller a question..."
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              disabled
              className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
            >
              Submit (API later)
            </Button>
            <Button
              variant="outline"
              className="border-border/50"
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

      {/* Questions list */}
      <div className="space-y-4">
        {questions.map((q) => {
          const isOpen = expandedId === q.id;
          const hasAnswer = !!q.answer;

          return (
            <div
              key={q.id}
              className="border border-border/50 rounded-lg overflow-hidden"
            >
              {/* Question */}
              <div className="p-4 bg-secondary/20">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 text-foreground">
                      {q.question.askedBy.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm mb-1">
                      <p className="text-foreground font-medium">
                        {q.question.askedBy.name}
                      </p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-muted-foreground">
                        {new Date(q.question.askedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="text-foreground">{q.question.content}</p>

                    {hasAnswer && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 p-0 h-auto text-[#fbbf24]"
                        onClick={() => toggle(q.id)}
                      >
                        {isOpen ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Answer
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            View Answer
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Answer */}
              {q.answer && isOpen && (
                <div className="p-4 bg-[#fbbf24]/5 border-t border-border/50">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10">
                        {q.answer.answeredBy.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <p className="text-foreground font-medium">
                          {q.answer.answeredBy.name}
                        </p>
                        <Badge
                          variant="outline"
                          className="h-5 text-[10px] border-[#10b981]/30 text-[#10b981]"
                        >
                          Seller
                        </Badge>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-muted-foreground">
                          {new Date(q.answer.answeredAt).toLocaleDateString()}
                        </p>
                      </div>

                      <p className="text-foreground">{q.answer.content}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {questions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No questions yet. Be the first to ask!</p>
        </div>
      )}
    </div>
  );
}
