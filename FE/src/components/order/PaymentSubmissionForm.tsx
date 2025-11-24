import { useState } from "react";
import { Upload, X, CheckCircle, CreditCard, Building2, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";

interface PaymentSubmissionFormProps {
  totalAmount: number;
  onSubmit?: (data: PaymentData) => void;
}

interface PaymentData {
  paymentMethod: string;
  transactionId: string;
  bankName?: string;
  accountNumber?: string;
  notes?: string;
  proofFile?: File;
}

export function PaymentSubmissionForm({ totalAmount, onSubmit }: PaymentSubmissionFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        toast.error("Only images and PDF files are allowed");
        return;
      }
      setProofFile(file);
      toast.success("File uploaded successfully");
    }
  };

  const handleRemoveFile = () => {
    setProofFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod || !transactionId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!proofFile) {
      toast.error("Please upload payment proof");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const data: PaymentData = {
        paymentMethod,
        transactionId,
        bankName,
        accountNumber,
        notes,
        proofFile: proofFile || undefined
      };
      
      if (onSubmit) {
        onSubmit(data);
      }
      
      toast.success("Payment submitted successfully! Seller will review your payment.");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-foreground mb-2">Submit Payment</h3>
        <p className="text-muted-foreground">
          Complete your payment and upload proof of transaction
        </p>
      </div>

      {/* Amount Summary */}
      <div className="bg-gradient-to-r from-[#fbbf24]/10 to-[#f59e0b]/10 border border-[#fbbf24]/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-black" />
            </div>
            <div>
              <p className="text-muted-foreground">Total Amount</p>
              <p className="text-[#fbbf24]">${totalAmount.toLocaleString()}</p>
            </div>
          </div>
          <CheckCircle className="h-6 w-6 text-[#fbbf24]" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method */}
        <div className="space-y-2">
          <Label htmlFor="payment-method">Payment Method *</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger id="payment-method" className="bg-input border-border/50">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
              <SelectItem value="wire-transfer">Wire Transfer</SelectItem>
              <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
              <SelectItem value="cashiers-check">Cashier's Check</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction ID */}
        <div className="space-y-2">
          <Label htmlFor="transaction-id">Transaction ID / Reference Number *</Label>
          <Input
            id="transaction-id"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter transaction reference number"
            className="bg-input border-border/50"
          />
        </div>

        {/* Bank Name (conditional) */}
        {(paymentMethod === "bank-transfer" || paymentMethod === "wire-transfer") && (
          <div className="space-y-2">
            <Label htmlFor="bank-name">Bank Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="bank-name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter bank name"
                className="bg-input border-border/50 pl-10"
              />
            </div>
          </div>
        )}

        {/* Account Number (conditional) */}
        {(paymentMethod === "bank-transfer" || paymentMethod === "wire-transfer") && (
          <div className="space-y-2">
            <Label htmlFor="account-number">Account Number (Last 4 digits)</Label>
            <Input
              id="account-number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="XXXX"
              maxLength={4}
              className="bg-input border-border/50"
            />
          </div>
        )}

        {/* Upload Payment Proof */}
        <div className="space-y-2">
          <Label>Payment Proof * (Image or PDF, max 5MB)</Label>
          <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-[#fbbf24]/50 transition-colors">
            {!proofFile ? (
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-[#fbbf24]" />
                  </div>
                  <div>
                    <p className="text-foreground">Click to upload payment proof</p>
                    <p className="text-muted-foreground">PNG, JPG, or PDF up to 5MB</p>
                  </div>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between bg-secondary/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-[#fbbf24]" />
                  <div className="text-left">
                    <p className="text-foreground">{proofFile.name}</p>
                    <p className="text-muted-foreground">
                      {(proofFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional information about your payment..."
            className="bg-input border-border/50 min-h-[100px]"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
        >
          {isSubmitting ? "Submitting..." : "Submit Payment Proof"}
        </Button>

        <p className="text-muted-foreground text-center">
          Your payment will be verified by the seller within 24-48 hours
        </p>
      </form>
    </div>
  );
}
