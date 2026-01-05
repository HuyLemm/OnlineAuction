import { Check, Clock, Package, Star, CreditCard, Truck } from "lucide-react";

type OrderStep = "payment" | "shipping" | "delivery" | "review";

interface OrderTimelineProps {
  currentStep: OrderStep;
  completedSteps?: OrderStep[]; // ⬅️ optional để tránh crash
}

export function OrderTimeline({
  currentStep,
  completedSteps = [], // ⬅️ fallback an toàn tuyệt đối
}: OrderTimelineProps) {
  const steps = [
    {
      id: "payment" as OrderStep,
      title: "Payment Submission",
      description: "Buyer submits payment information",
      icon: CreditCard,
    },
    {
      id: "shipping" as OrderStep,
      title: "Shipping Invoice",
      description: "Seller confirms & ships item",
      icon: Package,
    },
    {
      id: "delivery" as OrderStep,
      title: "Delivery Confirmation",
      description: "Buyer confirms receipt",
      icon: Truck,
    },
    {
      id: "review" as OrderStep,
      title: "Rating & Review",
      description: "Both parties rate transaction",
      icon: Star,
    },
  ];

  const getStepIndex = (step: OrderStep) =>
    steps.findIndex((s) => s.id === step);

  const currentStepIndex = getStepIndex(currentStep);

  const getStepStatus = (stepId: OrderStep, index: number) => {
    if (completedSteps.includes(stepId)) return "completed";
    if (stepId === currentStep) return "current";
    if (index < currentStepIndex) return "completed";
    return "upcoming";
  };

  // ⬅️ Clamp progress để không vượt 100%
  const progressPercent = Math.min(
    (completedSteps.length / (steps.length - 1)) * 100,
    100
  );

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6">
      <h3 className="text-foreground mb-6">Order Progress</h3>

      <div className="relative">
        {/* Timeline background */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border" />

        {/* Timeline progress */}
        <div
          className="absolute left-6 top-6 w-0.5 bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] transition-all duration-500"
          style={{ height: `${progressPercent}%` }}
        />

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id, index);
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`
                    relative z-10 h-12 w-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${
                      status === "completed"
                        ? "bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] border-[#fbbf24]"
                        : status === "current"
                        ? "bg-card border-[#fbbf24] ring-4 ring-[#fbbf24]/20"
                        : "bg-card border-border"
                    }
                  `}
                >
                  {status === "completed" ? (
                    <Check className="h-6 w-6 text-black" />
                  ) : status === "current" ? (
                    <Clock className="h-6 w-6 text-[#fbbf24] animate-pulse" />
                  ) : (
                    <Icon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h4
                    className={`
                      mb-1 transition-colors
                      ${
                        status === "completed" || status === "current"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    `}
                  >
                    {step.title}
                  </h4>

                  <p className="text-muted-foreground">{step.description}</p>

                  {status === "completed" && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10b981]/20 text-[#10b981]">
                      <Check className="h-3 w-3" />
                      <span>Completed</span>
                    </div>
                  )}

                  {status === "current" && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fbbf24]/20 text-[#fbbf24]">
                      <Clock className="h-3 w-3" />
                      <span>In Progress</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
