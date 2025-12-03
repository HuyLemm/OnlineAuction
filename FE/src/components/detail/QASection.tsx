import { useState } from "react";
import { MessageCircle, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface QA {
  id: string;
  question: string;
  asker: string;
  askedTime: string;
  answer?: string;
  answerer?: string;
  answeredTime?: string;
  likes: number;
  isExpanded?: boolean;
}

interface QASectionProps {
  questions?: QA[];
}

export function QASection({ questions: initialQuestions = [] }: QASectionProps) {
  // Default mock data if no questions provided
  const defaultQuestions: QA[] = [
    {
      id: "1",
      question: "Does this watch come with original box and papers?",
      asker: "Michael Chen",
      askedTime: "2 days ago",
      answer: "Yes, this Rolex Submariner comes with the original box, papers, warranty card, and all accessories. Everything is in excellent condition.",
      answerer: "Premium Watches Gallery",
      answeredTime: "2 days ago",
      likes: 12,
      isExpanded: false,
    },
    {
      id: "2",
      question: "Has the watch been serviced recently?",
      asker: "Sarah Williams",
      askedTime: "3 days ago",
      answer: "The watch was professionally serviced by a certified Rolex technician 6 months ago. All service records are included with the purchase.",
      answerer: "Premium Watches Gallery",
      answeredTime: "3 days ago",
      likes: 8,
      isExpanded: false,
    },
    {
      id: "3",
      question: "What is your return policy for this item?",
      asker: "David Martinez",
      askedTime: "4 days ago",
      answer: "We offer a 30-day money-back guarantee. The watch must be returned in the same condition with all original packaging and documentation.",
      answerer: "Premium Watches Gallery",
      answeredTime: "4 days ago",
      likes: 15,
      isExpanded: false,
    },
  ];

  const [questions, setQuestions] = useState(
    initialQuestions.length > 0 ? initialQuestions : defaultQuestions
  );
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  const toggleExpand = (id: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, isExpanded: !q.isExpanded } : q
    ));
  };

  const handleSubmitQuestion = () => {
    if (newQuestion.trim()) {
      // In a real app, this would submit to an API
      setNewQuestion("");
      setShowQuestionForm(false);
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
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
          onClick={() => setShowQuestionForm(!showQuestionForm)}
          className="border-border/50"
        >
          Ask Question
        </Button>
      </div>

      {/* Question Form */}
      {showQuestionForm && (
        <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border/50">
          <Textarea
            placeholder="Ask the seller a question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="bg-background border-border/50"
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSubmitQuestion}
              className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
            >
              Submit Question
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowQuestionForm(false);
                setNewQuestion("");
              }}
              className="border-border/50"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((qa) => (
          <div
            key={qa.id}
            className="border border-border/50 rounded-lg overflow-hidden"
          >
            {/* Question */}
            <div className="p-4 bg-secondary/20">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 text-foreground">
                    {qa.asker.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-foreground">{qa.asker}</p>
                    <span className="text-muted-foreground">•</span>
                    <p className="text-muted-foreground">{qa.askedTime}</p>
                  </div>
                  <p className="text-foreground">{qa.question}</p>
                  {qa.answer && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(qa.id)}
                      className="mt-2 h-auto p-0 text-[#fbbf24] hover:text-[#f59e0b]"
                    >
                      {qa.isExpanded ? (
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
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {qa.likes}
                </Button>
              </div>
            </div>

            {/* Answer */}
            {qa.answer && qa.isExpanded && (
              <div className="p-4 bg-[#fbbf24]/5 border-t border-border/50">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10 text-foreground">
                      {qa.answerer?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-foreground">{qa.answerer}</p>
                      <Badge variant="outline" className="h-5 text-[10px] border-[#10b981]/30 text-[#10b981]">
                        Seller
                      </Badge>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-muted-foreground">{qa.answeredTime}</p>
                    </div>
                    <p className="text-foreground">{qa.answer}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No questions yet. Be the first to ask!</p>
        </div>
      )}
    </div>
  );
}