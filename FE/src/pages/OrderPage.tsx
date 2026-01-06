import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  ArrowLeft,
  MessageCircle,
  Copy,
  CreditCard,
  PhoneCall,
  Box,
  Package,
  Truck,
  Hourglass,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { formatCurrency } from "../lib/utils";

import { OrderTimeline } from "../components/order/OrderTimeline";
import { OrderStatusPanel } from "../components/order/OrderStatusPanel";
import { PaymentSubmissionForm } from "../components/order/PaymentSubmissionForm";
import { ShippingInvoicePanel } from "../components/order/ShippingInvoicePanel";
import { DeliveryConfirmationPanel } from "../components/order/DeliveryConfirmationPanel";
import { ChatInterface } from "../components/chat/ChatInterface";
import { RatingReviewForm } from "../components/order/RatingReviewForm";
import { useNavigate } from "react-router-dom";

import {
  GET_ORDER_DETAIL_API,
  ORDER_PAYMENT_API,
  GET_PAYMENT_ORDER_API,
  SUBMIT_SHIPMENT_API,
  GET_SHIPPING_ORDER_API,
  CONFIRM_DELIVERY_API,
  RATE_BUYER_API,
  RATE_SELLER_API,
  GET_RATING_API,
} from "../components/utils/api";
import { fetchWithAuth } from "../components/utils/fetchWithAuth";
import { toast } from "sonner";
import { LoadingSpinner } from "../components/state";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

type OrderStatus =
  | "payment_pending"
  | "shipping_pending"
  | "delivered_pending"
  | "completed"
  | "cancelled";

type OrderStep = "payment" | "shipping" | "delivery" | "review";

const statusToStep: Record<OrderStatus, OrderStep> = {
  payment_pending: "payment",
  shipping_pending: "shipping",
  delivered_pending: "delivery",
  completed: "review",
  cancelled: "review",
};

const statusToCompletedSteps: Record<OrderStatus, OrderStep[]> = {
  payment_pending: [],

  shipping_pending: ["payment"],

  delivered_pending: ["payment", "shipping"],

  completed: ["payment", "shipping", "delivery", "review"],

  cancelled: ["payment"], // huỷ sau khi buyer gửi payment
};

interface OrderPageProps {
  onBack?: () => void;
}

export function OrderPage({ onBack }: OrderPageProps) {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  if (!orderId) {
    return <div className="p-10 text-center">Invalid order</div>;
  }
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [shippingInfo, setShippingInfo] = useState<any>(null);
  const [existingRating, setExistingRating] = useState<{
    score: 1 | -1;
    comment: string;
    created_at: string;
  } | null>(null);

  const [ratingLoading, setRatingLoading] = useState(false);

  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [submittingShipping, setSubmittingShipping] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setRatingLoading(true);

        const res = await fetchWithAuth(GET_RATING_API(orderId));
        const json = await res.json();

        if (json.success) {
          setExistingRating(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setRatingLoading(false);
      }
    })();
  }, [orderId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth(GET_SHIPPING_ORDER_API(orderId));
        const json = await res.json();
        console.log(json);
        if (json.success) {
          setShippingInfo(json.data);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [orderId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth(GET_PAYMENT_ORDER_API(orderId));
        const json = await res.json();
        if (json.success) {
          setPaymentInfo(json.data);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [orderId]);

  /* ===============================
   * Fetch order detail
   * =============================== */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth(GET_ORDER_DETAIL_API(orderId));
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "Failed to load order");
        }

        setOrderData(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!orderData) {
    return <div className="p-10 text-center">Order not found</div>;
  }

  const orderStatus = orderData.status as OrderStatus;

  const currentStep = statusToStep[orderStatus] ?? "payment";

  const completedSteps = statusToCompletedSteps[orderStatus] ?? [];

  /* ===============================
   * Handlers (demo – sau này gọi API)
   * =============================== */

  const handlePaymentSubmit = async (data: any) => {
    try {
      setSubmittingPayment(true);

      const res = await fetchWithAuth(ORDER_PAYMENT_API(orderId), {
        method: "POST",
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!json.success) throw new Error("Payment failed");

      // ✅ refetch payment
      const payRes = await fetchWithAuth(GET_PAYMENT_ORDER_API(orderId));
      const payJson = await payRes.json();
      if (payJson.success) setPaymentInfo(payJson.data);

      // ✅ refetch order
      const refetch = await fetchWithAuth(GET_ORDER_DETAIL_API(orderId));
      const refetchJson = await refetch.json();
      if (refetchJson.success) setOrderData(refetchJson.data);

      toast.success("Payment submitted");
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleSubmitShipping = async (data: any) => {
    try {
      setSubmittingShipping(true);

      const res = await fetchWithAuth(SUBMIT_SHIPMENT_API(orderId), {
        method: "POST",
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Submit shipping failed");
      }

      toast.success("Shipping information submitted");

      // ✅ refetch order
      const refetch = await fetchWithAuth(GET_ORDER_DETAIL_API(orderId));
      const refetchJson = await refetch.json();

      if (refetchJson.success) {
        setOrderData(refetchJson.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit shipping");
    } finally {
      setSubmittingShipping(false);
    }
  };

  const handleDeliveryConfirm = async (data: { note?: string }) => {
    try {
      const res = await fetchWithAuth(CONFIRM_DELIVERY_API(orderId), {
        method: "POST",
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Confirm delivery failed");
      }

      toast.success("Delivery confirmed successfully");

      // ✅ Refetch order → status = completed
      const refetch = await fetchWithAuth(GET_ORDER_DETAIL_API(orderId));
      const refetchJson = await refetch.json();

      if (refetchJson.success) {
        setOrderData(refetchJson.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to confirm delivery");
    }
  };

  const handleRatingSubmit = async (data: {
    score: number;
    comment: string;
  }) => {
    try {
      setRatingLoading(true);

      const api = isBuyer ? RATE_SELLER_API : RATE_BUYER_API;

      const res = await fetchWithAuth(api(orderId), {
        method: "POST",
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Rating failed");
      }

      toast.success("Thank you for your review!");

      // optional: refetch order để disable form
      const refetch = await fetchWithAuth(GET_ORDER_DETAIL_API(orderId));
      const refetchJson = await refetch.json();
      if (refetchJson.success) {
        setOrderData(refetchJson.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setRatingLoading(false);
    }
  };

  const currentUserId: string = orderData.currentUserId;

  const isBuyer = currentUserId === orderData.buyer.id;

  const currentUser = isBuyer ? orderData.buyer : orderData.seller;
  const otherParty = isBuyer ? orderData.seller : orderData.buyer;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  navigate(-1);
                }
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div>
              <h1 className="text-foreground">Order Completion</h1>
              <p className="text-muted-foreground">#{orderData.orderId}</p>
            </div>
          </div>

          <Button variant="outline" onClick={() => setActiveTab("chat")}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
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
            wonDate={new Date(orderData.wonDate)}
          />
        </div>

        {/* Right */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* =====================
      STEP 1: PAYMENT
     ===================== */}
              {orderStatus === "payment_pending" &&
                (isBuyer ? (
                  <PaymentSubmissionForm
                    onSubmit={handlePaymentSubmit}
                    loading={submittingPayment}
                  />
                ) : (
                  <div className="bg-card border border-border/50 p-6 text-center">
                    <h3 className="text-foreground mb-2">
                      Waiting for buyer to submit payment
                    </h3>
                    <p className="text-muted-foreground">
                      The buyer has not completed the payment information yet.
                    </p>
                  </div>
                ))}

              {/* =====================
      STEP 2: SHIPPING
     ===================== */}
              {orderStatus === "shipping_pending" && (
                <>
                  {/* ✅ Luôn hiện payment info cho cả 2 */}
                  <PaymentInfoBox paymentInfo={paymentInfo} />

                  {isBuyer ? (
                    <div className="bg-card border border-green-500/20 rounded-xl p-6 flex flex-col items-center gap-3 text-center">
                      {/* Icon */}
                      <div className="relative">
                        <Package className="w-10 h-10 text-primary" />
                        <Truck className="w-4 h-4 text-muted-foreground absolute -bottom-1 -right-1 animate-pulse" />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-foreground">
                        Seller is preparing your shipment
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground max-w-md">
                        Your order has been confirmed. The seller is packing the
                        item and will provide shipping information shortly.
                      </p>

                      {/* Status badge */}
                      <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1 text-xs font-medium">
                        📦 Preparing shipment
                      </span>
                    </div>
                  ) : (
                    <ShippingInvoicePanel
                      mode="seller"
                      shippingData={undefined}
                      onSubmitShipping={handleSubmitShipping}
                      loading={submittingShipping}
                    />
                  )}
                </>
              )}

              {/* =====================
      STEP 3: DELIVERY CONFIRM
     ===================== */}
              {orderStatus === "delivered_pending" && (
                <>
                  <PaymentInfoBox paymentInfo={paymentInfo} />

                  <ShippingInfoBox
                    shippingData={shippingInfo}
                    shippingAddress={paymentInfo?.deliveryAddress}
                  />

                  {isBuyer ? (
                    <DeliveryConfirmationPanel
                      onConfirmDelivery={handleDeliveryConfirm}
                      loading={false}
                    />
                  ) : (
                    <div className="bg-card border border-green-500/20 rounded-xl p-6 flex flex-col items-center gap-3 text-center">
                      {/* Icon */}
                      <div className="relative">
                        <Hourglass className="w-10 h-10 text-primary animate-pulse" />
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground absolute -bottom-1 -right-1" />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-foreground">
                        Waiting for buyer confirmation
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground max-w-md">
                        The item has been shipped successfully. Please wait
                        while the buyer confirms that they have received the
                        package.
                      </p>

                      {/* Status badge */}
                      <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1 text-xs font-medium">
                        ⏳ Awaiting confirmation
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* =====================
      STEP 4: REVIEW
     ===================== */}
              {orderStatus === "completed" && (
                <>
                  <div className="bg-card border border-green-500/30 rounded-2xl p-8 text-center space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>

                    <h3 className="text-xl font-semibold text-foreground">
                      Order Completed
                    </h3>

                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      This transaction has been completed successfully. Thank
                      you for using our marketplace.
                    </p>
                  </div>

                  <RatingReviewForm
                    orderParty={{
                      name: otherParty.name,
                      role: isBuyer ? "seller" : "buyer",
                    }}
                    existingRating={existingRating}
                    onSubmit={handleRatingSubmit}
                    loading={ratingLoading}
                  />
                </>
              )}

              {/* =====================
      CANCELLED
     ===================== */}
              {orderStatus === "cancelled" && (
                <div className="bg-card border border-border/50 p-6 text-center">
                  <h3 className="text-destructive mb-2">Order Cancelled</h3>
                  <p className="text-muted-foreground">
                    This transaction has been cancelled.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="chat">
              <ChatInterface
                orderId={orderData.orderId}
                otherParty={{
                  id: otherParty.id,
                  name: otherParty.name,
                  role: isBuyer ? "seller" : "buyer",
                }}
                currentUserId={currentUserId}
                currentUserName={currentUser.name}
                isMinimized={false}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function PaymentInfoBox({ paymentInfo }: { paymentInfo: any }) {
  if (!paymentInfo) return null;

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(paymentInfo.paymentRef);
    toast.success("Invoice ID copied");
  };

  return (
    <div className="bg-card border border-border/60 rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-primary" />
        <h3 className="text-foreground font-semibold text-lg">
          Payment Information
        </h3>
      </div>

      {/* Amount */}
      <div className="flex justify-between text-lg">
        <span className="text-muted-foreground">Amount</span>
        <span className="text-yellow-500 font-semibold">
          {formatCurrency(paymentInfo.amount)}
        </span>
      </div>

      {/* Buyer */}
      {paymentInfo.buyerName && (
        <div className="flex justify-between text-lg">
          <span className="text-muted-foreground">Paid by</span>
          <span className="text-yellow-500">{paymentInfo.buyerName}</span>
        </div>
      )}

      {/* Invoice / payment ref */}
      <div className="space-y-1">
        <span className="text-muted-foreground text-lg">Invoice ID</span>
        <div className="flex items-center justify-between bg-muted/40 rounded-md px-3 py-2">
          <code className="text-lg text-foreground break-all">
            {paymentInfo.paymentRef}
          </code>
          <button
            onClick={handleCopyInvoice}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delivery info */}
      {(paymentInfo.deliveryAddress || paymentInfo.phoneNumber) && (
        <div className="pt-3 border-t border-border/50 space-y-3">
          {paymentInfo.deliveryAddress && (
            <p className="flex items-center gap-2 text-lg text-muted-foreground">
              <Box className="w-5 h-5" />
              <span>Address:</span>
              <span className="text-foreground">
                {paymentInfo.deliveryAddress}
              </span>
            </p>
          )}

          {paymentInfo.phoneNumber && (
            <p className="flex items-center gap-2 text-lg text-muted-foreground">
              <PhoneCall className="w-5 h-5" />
              <span>Phone: </span>
              <span className="text-foreground">{paymentInfo.phoneNumber}</span>
            </p>
          )}
        </div>
      )}

      {/* Note */}
      {paymentInfo.note && (
        <div className="bg-green-500/20 border border-border/40 border-green-500/20 rounded-md p-3">
          <span className="text-muted-foreground text-lg">Note:</span>{" "}
          <span className="text-foreground text-sm">{paymentInfo.note}</span>
        </div>
      )}

      {/* Submitted time */}
      <p className="text-xs text-muted-foreground text-right">
        Submitted at {new Date(paymentInfo.submittedAt).toLocaleString()}
      </p>
    </div>
  );
}

function ShippingInfoBox({
  shippingData,
  shippingAddress,
}: {
  shippingData: any;
  shippingAddress?: string;
}) {
  if (!shippingData) return null;

  return (
    <div className="bg-card border border-border/60 rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Truck className="w-5 h-5 text-primary" />
        <h3 className="text-foreground font-semibold text-lg">
          Shipping Information
        </h3>
      </div>

      {/* Shipping code */}
      <div className="space-y-1">
        <span className="text-muted-foreground text-lg">Tracking Code</span>
        <div className="flex items-center justify-between bg-muted/40 rounded-md px-3 py-2">
          <code className="text-lg text-foreground break-all">
            {shippingData.shipping_code}
          </code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shippingData.shipping_code);
              toast.success("Tracking code copied");
            }}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Provider */}
      {shippingData.shipping_provider && (
        <div className="flex justify-between text-lg">
          <span className="text-muted-foreground">Carrier</span>
          <span className="text-foreground">
            {shippingData.shipping_provider}
          </span>
        </div>
      )}

      {/* Address */}
      {shippingAddress && (
        <div className="pt-3 border-t border-border/50 space-y-2">
          <p className="flex items-center gap-2 text-lg text-muted-foreground">
            <Box className="w-5 h-5" />
            <span>Delivery Address:</span>
            <span className="text-foreground">{shippingAddress}</span>
          </p>
        </div>
      )}

      {/* Note */}
      {shippingData.note && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3">
          <span className="text-muted-foreground text-lg">Seller Note:</span>{" "}
          <span className="text-foreground text-sm">{shippingData.note}</span>
        </div>
      )}

      {/* Time */}
      {shippingData.shipped_at && (
        <p className="text-xs text-muted-foreground text-right">
          Shipped at {new Date(shippingData.shipped_at).toLocaleString()}
        </p>
      )}
    </div>
  );
}
