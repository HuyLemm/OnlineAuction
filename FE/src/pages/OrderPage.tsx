import { useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { OrderTimeline } from "../components/order/OrderTimeline";
import { OrderStatusPanel } from "../components/order/OrderStatusPanel";
import { PaymentSubmissionForm } from "../components/order/PaymentSubmissionForm";
import { ShippingInvoicePanel } from "../components/order/ShippingInvoicePanel";
import { DeliveryConfirmationPanel } from "../components/order/DeliveryConfirmationPanel";
import { RatingReviewModal } from "../components/order/RatingReviewModal";
import { ChatInterface } from "../components/chat/ChatInterface";

type OrderStep = "payment" | "shipping" | "delivery" | "review";
type OrderStatus = "payment-pending" | "payment-submitted" | "shipping-pending" | "in-transit" | "delivered" | "completed";

interface OrderPageProps {
  onBack?: () => void;
}

export function OrderPage({ onBack }: OrderPageProps) {
  const [currentStep, setCurrentStep] = useState<OrderStep>("payment");
  const [completedSteps, setCompletedSteps] = useState<OrderStep[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("payment-pending");
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock order data
  const orderData = {
    orderId: "ORDER-2024-001",
    wonDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    item: {
      title: "Patek Philippe Nautilus 5711/1A Steel Blue Dial",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Watches",
      winningBid: 156000
    },
    buyer: {
      name: "John Anderson",
      email: "john.anderson@email.com",
      phone: "+1 (555) 123-4567",
      address: "123 Luxury Ave, Suite 100, New York, NY 10001, USA"
    },
    seller: {
      name: "LuxuryTimepieces",
      email: "contact@luxurytimepieces.com",
      phone: "+1 (555) 987-6543"
    }
  };

  const [shippingData, setShippingData] = useState<any>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);

  const handlePaymentSubmit = (data: any) => {
    console.log("Payment submitted:", data);
    setCompletedSteps([...completedSteps, "payment"]);
    setOrderStatus("payment-submitted");
    setCurrentStep("shipping");
    
    // Simulate payment verification after 3 seconds
    setTimeout(() => {
      setPaymentVerified(true);
      setOrderStatus("shipping-pending");
      
      // Simulate shipping after 5 more seconds
      setTimeout(() => {
        setShippingData({
          carrier: "FedEx International Priority",
          trackingNumber: "FX123456789US",
          shippedDate: new Date(),
          estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
          shippingAddress: orderData.buyer.address,
          invoiceNumber: "INV-2024-001",
          shippingCost: 150.00
        });
        setCompletedSteps([...completedSteps, "payment", "shipping"]);
        setOrderStatus("in-transit");
        setCurrentStep("delivery");
      }, 5000);
    }, 3000);
  };

  const handleDeliveryConfirm = (data: any) => {
    console.log("Delivery confirmed:", data);
    setDeliveryConfirmed(true);
    setCompletedSteps([...completedSteps, "payment", "shipping", "delivery"]);
    setOrderStatus("delivered");
    setCurrentStep("review");
    
    // Auto-open rating modal
    setTimeout(() => {
      setRatingModalOpen(true);
    }, 1000);
  };

  const handleRatingSubmit = (data: any) => {
    console.log("Rating submitted:", data);
    setCompletedSteps(["payment", "shipping", "delivery", "review"]);
    setOrderStatus("completed");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-foreground">Order Details</h1>
                <p className="text-muted-foreground">#{orderData.orderId}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setChatMinimized(!chatMinimized)}
              className="border-border/50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with Seller
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Timeline & Status */}
          <div className="space-y-6">
            <OrderTimeline 
              currentStep={currentStep} 
              completedSteps={completedSteps}
            />
            <OrderStatusPanel
              orderId={orderData.orderId}
              status={orderStatus}
              item={orderData.item}
              buyer={orderData.buyer}
              seller={orderData.seller}
              wonDate={orderData.wonDate}
            />
          </div>

          {/* Right Column - Action Panels */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-secondary/50 border border-border/50 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Payment Step */}
                {currentStep === "payment" && (
                  <PaymentSubmissionForm
                    totalAmount={orderData.item.winningBid}
                    onSubmit={handlePaymentSubmit}
                  />
                )}

                {/* Shipping Step */}
                {currentStep === "shipping" && (
                  <ShippingInvoicePanel
                    shippingData={shippingData}
                    paymentVerified={paymentVerified}
                    onDownloadInvoice={() => {
                      console.log("Download invoice");
                    }}
                  />
                )}

                {/* Delivery Step */}
                {currentStep === "delivery" && (
                  <>
                    <ShippingInvoicePanel
                      shippingData={shippingData}
                      paymentVerified={paymentVerified}
                      onDownloadInvoice={() => {
                        console.log("Download invoice");
                      }}
                    />
                    <DeliveryConfirmationPanel
                      isDelivered={orderStatus === "in-transit" || orderStatus === "delivered"}
                      deliveryConfirmed={deliveryConfirmed}
                      onConfirmDelivery={handleDeliveryConfirm}
                    />
                  </>
                )}

                {/* Review Step */}
                {currentStep === "review" && (
                  <div className="space-y-6">
                    <ShippingInvoicePanel
                      shippingData={shippingData}
                      paymentVerified={paymentVerified}
                      onDownloadInvoice={() => {
                        console.log("Download invoice");
                      }}
                    />
                    <div className="bg-card border border-border/50 rounded-xl p-6 text-center">
                      <div className="py-8">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="h-8 w-8 text-[#10b981]" />
                        </div>
                        <h3 className="text-foreground mb-2">Transaction Complete!</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          {completedSteps.includes("review") 
                            ? "Thank you for your review! This order is now complete."
                            : "Please rate your experience with this seller."
                          }
                        </p>
                        {!completedSteps.includes("review") && (
                          <Button
                            onClick={() => setRatingModalOpen(true)}
                            className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
                          >
                            Rate & Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="chat">
                <ChatInterface
                  orderId={orderData.orderId}
                  otherParty={{
                    id: "seller-1",
                    name: orderData.seller.name,
                    role: "seller"
                  }}
                  currentUserId="buyer-1"
                  currentUserName={orderData.buyer.name}
                  isMinimized={false}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Chat Minimized */}
      {chatMinimized && activeTab !== "chat" && (
        <ChatInterface
          orderId={orderData.orderId}
          otherParty={{
            id: "seller-1",
            name: orderData.seller.name,
            role: "seller"
          }}
          currentUserId="buyer-1"
          currentUserName={orderData.buyer.name}
          isMinimized={true}
          onToggleMinimize={() => {
            setChatMinimized(false);
            setActiveTab("chat");
          }}
        />
      )}

      {/* Rating Modal */}
      <RatingReviewModal
        open={ratingModalOpen}
        onOpenChange={setRatingModalOpen}
        orderParty={{
          name: orderData.seller.name,
          role: "seller"
        }}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}
