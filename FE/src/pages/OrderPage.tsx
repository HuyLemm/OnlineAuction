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
  AlertTriangle,
  XCircle,
  Clock,
  MessageCircleWarning,
  ThumbsDown,
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
  CANCEL_AUCTION_API,
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

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

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

      // ✅ REFRESH SHIPPING INFO (QUAN TRỌNG)
      const shipRes = await fetchWithAuth(GET_SHIPPING_ORDER_API(orderId));
      const shipJson = await shipRes.json();
      if (shipJson.success) {
        setShippingInfo(shipJson.data);
      }

      // ✅ REFRESH ORDER STATUS
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

  const handleCancelAuction = async (reason: string) => {
    try {
      setCancelLoading(true);

      const res = await fetchWithAuth(CANCEL_AUCTION_API(orderId), {
        method: "POST",
        body: JSON.stringify({ reason }),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Cancel failed");
      }

      toast.success("Auction cancelled successfully");

      setCancelModalOpen(false);

      // ✅ refetch order → status = cancelled
      const refetch = await fetchWithAuth(GET_ORDER_DETAIL_API(orderId));
      const refetchJson = await refetch.json();
      if (refetchJson.success) {
        setOrderData(refetchJson.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel auction");
    } finally {
      setCancelLoading(false);
    }
  };

  const currentUserId: string = orderData.currentUserId;

  const isBuyer = currentUserId === orderData.buyer.id;

  const currentUser = isBuyer ? orderData.buyer : orderData.seller;
  const otherParty = isBuyer ? orderData.seller : orderData.buyer;

  const canSellerCancel = !isBuyer && orderStatus === "payment_pending";

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

          <div className="flex items-center gap-2">
            {canSellerCancel && (
              <Button
                variant="destructive"
                onClick={() => setCancelModalOpen(true)}
              >
                Cancel Auction
              </Button>
            )}

            <Button variant="outline" onClick={() => setActiveTab("chat")}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="space-y-6">
          <OrderTimeline
            currentStep={currentStep}
            completedSteps={completedSteps}
            isCancelled={orderStatus === "cancelled"}
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
                  <div className="bg-card border border-yellow-500/10 rounded-xl p-6 flex flex-col items-center gap-4 text-center">
                    {/* Icon */}
                    <div className="relative">
                      <div className="h-14 w-14 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <CreditCard className="h-7 w-7 text-yellow-500" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-yellow-500 animate-pulse" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-foreground">
                      Waiting for buyer payment
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground max-w-md">
                      The buyer hasn’t submitted the payment information yet.
                      Once completed, you’ll be able to prepare and ship the
                      item.
                    </p>

                    {/* Status badge */}
                    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/15 text-yellow-500 px-4 py-1 text-xs font-medium">
                      ⏳ Payment pending
                    </span>
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

              {orderStatus === "cancelled" && isBuyer && (
                <div className="space-y-6">
                  {/* ===== SUMMARY ===== */}
                  <div className="bg-card border border-red-500/30 rounded-3xl p-8 text-center space-y-5">
                    <div className="mx-auto h-20 w-20 rounded-full bg-red-500/15 flex items-center justify-center">
                      <XCircle className="h-10 w-10 text-red-500" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-foreground">
                        Order Cancelled
                      </h3>
                      <p className="text-sm text-red-400 font-medium">
                        Cancelled by seller
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                      Because you did not submit the payment on time, this order
                      was cancelled by{" "}
                      <span className="font-semibold text-foreground">
                        {otherParty.name}
                      </span>
                      .
                    </p>

                    <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 text-red-400 px-4 py-1 text-xs font-medium">
                      ⚠️ Payment deadline missed
                    </span>
                  </div>

                  {/* ===== CONSEQUENCE ===== */}
                  <div className="bg-card border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <ThumbsDown className="h-5 w-5 text-red-500" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-red-400">
                        Negative rating applied
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You received a <strong>-1 rating</strong> for failing to
                        complete the payment. This may affect your future
                        transactions.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {orderStatus === "cancelled" && !isBuyer && (
                <div className="space-y-6">
                  {/* ===== SUMMARY ===== */}
                  <div className="bg-card border border-yellow-500/30 rounded-3xl p-8 space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-yellow-500" />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold text-foreground">
                          Order Cancelled
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Buyer failed to submit payment
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This order was cancelled because{" "}
                      <span className="font-semibold text-foreground">
                        {otherParty.name}
                      </span>{" "}
                      did not submit the payment before the deadline.
                    </p>

                    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/20 text-yellow-500 px-4 py-1 text-xs font-medium">
                      ⏳ Payment timeout
                    </span>
                  </div>

                  {/* ===== RATING RECORD ===== */}
                  {existingRating && (
                    <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-5">
                      <h4 className="text-sm font-semibold text-muted-foreground">
                        Rating record (final)
                      </h4>

                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-red-500/20 flex items-center justify-center">
                          <ThumbsDown className="h-5 w-5 text-red-500" />
                        </div>
                        <span className="text-red-500 font-semibold">
                          Negative rating (-1)
                        </span>
                      </div>

                      <div className="rounded-xl border border-border/50 bg-muted/40 p-4 text-sm text-foreground">
                        {existingRating.comment}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        This rating is permanently recorded and cannot be
                        modified.
                      </p>
                    </div>
                  )}
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
      <CancelAuctionModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelAuction}
        loading={cancelLoading}
      />
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

function CancelAuctionModal({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading: boolean;
}) {
  const reasons = [
    {
      value: "payment_timeout",
      label: "Buyer did not submit payment on time",
      icon: Clock,
    },
    {
      value: "buyer_unresponsive",
      label: "Buyer did not respond to messages",
      icon: MessageCircleWarning,
    },
    {
      value: "suspicious_activity",
      label: "Suspicious buyer activity",
      icon: AlertTriangle,
    },
  ];

  const [selected, setSelected] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 space-y-6 shadow-xl">
        {/* ===== Header ===== */}
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-destructive">
              Cancel Auction
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* ===== Warning Box ===== */}
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive leading-relaxed">
          <p className="text-yellow-500 text-lg">
            Cancelling this auction will:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>1. Cancel the order immediately</li>
            <li>2. Automatically give buyer a negative rating</li>
            <li>3. Mark the reason publicly in history</li>
          </ul>
        </div>

        {/* ===== Reasons ===== */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Select a reason</p>

          {reasons.map((r) => {
            const Icon = r.icon;
            const active = selected === r.value;

            return (
              <button
                key={r.value}
                onClick={() => setSelected(r.value)}
                className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition
                  ${
                    active
                      ? "border-destructive bg-destructive/15 text-destructive"
                      : "border-border hover:bg-muted/40 text-muted-foreground"
                  }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    active ? "text-destructive" : "text-muted-foreground"
                  }`}
                />
                <span className="flex-1 text-left">{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* ===== Actions ===== */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Back
          </Button>

          <Button
            variant="destructive"
            disabled={!selected || loading}
            onClick={() => onConfirm(selected!)}
            className="min-w-[140px]"
          >
            {loading ? "Cancelling..." : "Confirm Cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
}
