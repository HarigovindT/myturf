import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, CheckCircle2, Loader2, IndianRupee, Clock, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  summary: {
    sport: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    price: number;
  };
}

const PaymentDialog = ({ open, onClose, onSuccess, summary }: PaymentDialogProps) => {
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  const isFormValid = method === "upi" ? upiId.includes("@") : cardNumber.length >= 16 && cardExpiry.length >= 4 && cardCvv.length >= 3;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Complete Payment</DialogTitle>
          <DialogDescription>Confirm your booking details and pay</DialogDescription>
        </DialogHeader>

        {/* Booking Summary */}
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" /> Date
            </span>
            <span className="font-medium">{summary.date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Time
            </span>
            <span className="font-medium">{summary.startTime} → {summary.endTime}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sport</span>
            <span className="font-medium capitalize">{summary.sport}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">{summary.duration}hr{summary.duration > 1 ? 's' : ''}</span>
          </div>
          <div className="border-t border-border/50 pt-2 mt-2 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-heading font-bold text-lg text-primary">₹{summary.price}</span>
          </div>
        </div>

        {/* Payment Method */}
        <RadioGroup value={method} onValueChange={setMethod} className="grid grid-cols-2 gap-3">
          <Label
            htmlFor="upi"
            className={cn(
              "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
              method === "upi" ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"
            )}
          >
            <RadioGroupItem value="upi" id="upi" />
            <Smartphone className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">UPI</span>
          </Label>
          <Label
            htmlFor="card"
            className={cn(
              "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
              method === "card" ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"
            )}
          >
            <RadioGroupItem value="card" id="card" />
            <CreditCard className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Card</span>
          </Label>
        </RadioGroup>

        {/* Payment Form */}
        <div className="space-y-3">
          {method === "upi" ? (
            <div>
              <Label htmlFor="upi-id" className="text-sm text-muted-foreground">UPI ID</Label>
              <Input
                id="upi-id"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="mt-1"
              />
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="card-num" className="text-sm text-muted-foreground">Card Number</Label>
                <Input
                  id="card-num"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry" className="text-sm text-muted-foreground">Expiry</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-sm text-muted-foreground">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="mt-1"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <Button
          size="lg"
          className="w-full text-base py-5"
          disabled={!isFormValid || processing}
          onClick={handlePay}
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            <>
              <IndianRupee className="mr-2 h-4 w-4" /> Pay ₹{summary.price}
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
