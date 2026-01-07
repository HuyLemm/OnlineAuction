import { useState } from "react";
import { Code, X, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface DevToolsProps {
  onNavigate?: (page: string) => void;
}

export function DevTools({ onNavigate }: DevToolsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  // if (process.env.NODE_ENV === 'production') return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        title="Dev Tools"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-black" />
        ) : (
          <Code className="h-6 w-6 text-black group-hover:rotate-12 transition-transform" />
        )}
      </button>

      {/* Dev Menu */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 p-4 space-y-3 bg-card/95 backdrop-blur-lg border-[#fbbf24]/30 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 min-w-[280px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Code className="h-4 w-4 text-[#fbbf24]" />
              Dev Tools
            </h3>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => {
                onNavigate?.("state-examples" as any);
                setIsOpen(false);
              }}
              className="w-full justify-start bg-[#d4a446] hover:bg-[#c89b3c] text-background"
              size="sm"
            >
              <Eye className="mr-2 h-4 w-4" />
              State Components Demo
            </Button>

            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Quick access to demo pages
              </p>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
