import { AlertCircle, RefreshCw, Wifi, Server, ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { cn } from "../../lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  type?: "network" | "server" | "permission" | "general";
  onRetry?: () => void;
  retryText?: string;
  className?: string;
  fullScreen?: boolean;
}

const errorConfig = {
  network: {
    icon: Wifi,
    title: "Connection Lost",
    message: "Unable to connect to the server. Please check your internet connection and try again.",
    color: "text-orange-500",
  },
  server: {
    icon: Server,
    title: "Server Error",
    message: "Something went wrong on our end. Our team has been notified and is working on a fix.",
    color: "text-red-500",
  },
  permission: {
    icon: ShieldAlert,
    title: "Access Denied",
    message: "You don't have permission to access this resource. Please contact support if you believe this is an error.",
    color: "text-yellow-500",
  },
  general: {
    icon: AlertCircle,
    title: "Something Went Wrong",
    message: "An unexpected error occurred. Please try again or contact support if the problem persists.",
    color: "text-red-500",
  },
};

export function ErrorState({
  title,
  message,
  type = "general",
  onRetry,
  retryText = "Try Again",
  className,
  fullScreen = false,
}: ErrorStateProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

  const content = (
    <Card className={cn(
      "flex flex-col items-center justify-center p-12 text-center space-y-6 bg-card/50 border-border/50",
      className
    )}>
      {/* Icon */}
      <div className={cn(
        "h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center",
        config.color
      )}>
        <Icon className="h-8 w-8" />
      </div>

      {/* Text Content */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-foreground">
          {title || config.title}
        </h3>
        <p className="text-muted-foreground text-sm">
          {message || config.message}
        </p>
      </div>

      {/* Action Button */}
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-[#d4a446] hover:bg-[#c89b3c] text-background"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {retryText}
        </Button>
      )}
    </Card>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-6">
        {content}
      </div>
    );
  }

  return content;
}
