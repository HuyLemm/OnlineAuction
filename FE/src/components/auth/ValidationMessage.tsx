import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface ValidationMessageProps {
  type: "error" | "success" | "info";
  message: string;
}

export function ValidationMessage({ type, message }: ValidationMessageProps) {
  const getStyles = () => {
    switch (type) {
      case "error":
        return {
          container: "bg-red-500/10 border-red-500/20 text-red-500",
          icon: <AlertCircle className="h-4 w-4" />
        };
      case "success":
        return {
          container: "bg-green-500/10 border-green-500/20 text-green-500",
          icon: <CheckCircle className="h-4 w-4" />
        };
      case "info":
        return {
          container: "bg-blue-500/10 border-blue-500/20 text-blue-500",
          icon: <Info className="h-4 w-4" />
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${styles.container}`}>
      <div className="mt-0.5">{styles.icon}</div>
      <p className="text-sm flex-1">{message}</p>
    </div>
  );
}
