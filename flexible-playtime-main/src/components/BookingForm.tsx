import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, IndianRupee, Timer, CheckCircle2, User, Phone, Mail } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import SportSelector from "./SportSelector";
import TimelineView from "./TimelineView";
import {
  DURATIONS,
  calculatePrice,
  hasConflict,
  minutesToTime,
  type Booking,
  OPERATING_HOURS,
} from "@/lib/booking-utils";
import { toast } from "sonner";

const BookingForm = () => {
  const [sport, setSport] = useState("football");
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(1);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const dateStr = date ? format(date, "yyyy-MM-dd") : "";

  // Fetch bookings from database filtered by sport
  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("status", "confirmed")
        .eq("sport", sport);
      
      if (data) {
        setBookings(data.map(b => ({
          id: b.id,
          sport: b.sport,
          date: b.booking_date,
          startTime: b.start_time,
          duration: b.duration,
          endTime: b.end_time,
          totalPrice: b.total_price,
          customerName: b.customer_name,
          status: b.status as "confirmed" | "cancelled",
        })));
      }
    };
    fetchBookings();
  }, [confirmed, sport]);

  const price = useMemo(() => {
    if (startTime === null) return 0;
    return calculatePrice(startTime, duration);
  }, [startTime, duration]);

  const endTimeMinutes = startTime !== null ? startTime + duration * 60 : null;

  const isValidBooking = useMemo(() => {
    if (!date || startTime === null) return false;
    if (!customerName.trim() || !customerPhone.trim()) return false;
    const end = startTime + duration * 60;
    if (end > OPERATING_HOURS.end * 60) return false;
    return !hasConflict(startTime, duration, dateStr, bookings);
  }, [date, startTime, duration, dateStr, bookings, customerName, customerPhone]);

  const handleConfirm = async () => {
    if (!isValidBooking || startTime === null || !date) return;

    const { error } = await supabase.from("bookings").insert({
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_email: customerEmail.trim() || null,
      sport,
      booking_date: dateStr,
      start_time: startTime,
      duration,
      end_time: startTime + duration * 60,
      total_price: price,
      status: "confirmed",
    });

    if (error) {
      toast.error("Failed to save booking. Please try again.");
      return;
    }

    // Try to send admin notification (non-blocking)
    try {
      await supabase.functions.invoke("notify-admin-booking", {
        body: {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim(),
          sport,
          date: dateStr,
          startTime: minutesToTime(startTime),
          endTime: minutesToTime(startTime + duration * 60),
          duration,
          totalPrice: price,
        },
      });
    } catch (e) {
      // Don't block booking if email fails
    }

    setConfirmed(true);
    setShowSuccessDialog(true);

    setTimeout(() => {
      setConfirmed(false);
      setShowSuccessDialog(false);
      setStartTime(null);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
    }, 5000);
  };


  const stepClasses = "glass-card p-6 transition-all duration-300";
  const stepNumberClasses = "w-8 h-8 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold shrink-0";

  return (
    <section id="booking" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Book Your <span className="text-gradient">Slot</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Pick your sport, date, time & duration. We handle the rest.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Sport */}
          <div className={stepClasses}>
            <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-3">
              <span className={stepNumberClasses}>1</span>
              Choose Sport
            </h3>
            <SportSelector selected={sport} onSelect={setSport} />
          </div>

          {/* Step 2: Your Details */}
          <div className={stepClasses}>
            <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-3">
              <span className={stepNumberClasses}>2</span>
              Your Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1.5">
                  <User className="h-3.5 w-3.5" /> Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone *
                </Label>
                <Input
                  id="phone"
                  placeholder="10-digit number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email (optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Step 3: Date */}
          <div className={stepClasses}>
            <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-3">
              <span className={stepNumberClasses}>3</span>
              Select Date
            </h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[280px] justify-start text-left font-normal h-12",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => { setDate(d); setStartTime(null); }}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Step 4: Duration */}
          <div className={stepClasses}>
            <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-3">
              <span className={stepNumberClasses}>4</span>
              Select Duration
            </h3>
            <div className="flex flex-wrap gap-3">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => { setDuration(d); setStartTime(null); }}
                  className={cn(
                    "py-3 rounded-xl text-sm font-medium transition-all duration-200 border px-[11px]",
                    duration === d
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                      : "bg-secondary border-border text-secondary-foreground hover:border-primary/40 hover:scale-105"
                  )}
                >
                  <Timer className="inline-block h-4 w-4 mr-1.5 -mt-0.5" />
                  {d} hr{d > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Step 5: Time */}
          {date && (
            <div className={stepClasses}>
              <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-3">
                <span className={stepNumberClasses}>5</span>
                Pick Start Time
                <span className="text-xs text-muted-foreground font-normal ml-auto">
                  Tap a slot to select {duration}hr{duration > 1 ? 's' : ''} starting from it
                </span>
              </h3>
              <TimelineView
                date={dateStr}
                bookings={bookings}
                selectedStart={startTime}
                selectedDuration={duration}
                onSelectStart={setStartTime}
              />
            </div>
          )}

          {/* Summary */}
          {startTime !== null && date && (
            <div className={cn(stepClasses, "glow border-primary/30")}>
              <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Booking Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">Sport</div>
                  <div className="font-medium capitalize">{sport}</div>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Time
                  </div>
                  <div className="font-medium">
                    {minutesToTime(startTime)} – {endTimeMinutes !== null && minutesToTime(endTimeMinutes)}
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">Duration</div>
                  <div className="font-medium">{duration} hr{duration > 1 ? "s" : ""}</div>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <IndianRupee className="h-3 w-3" /> Total
                  </div>
                  <div className="font-heading font-bold text-2xl text-primary">₹{price}</div>
                </div>
              </div>

              {!customerName.trim() || !customerPhone.trim() ? (
                <p className="text-accent text-sm mb-4">
                  Please fill in your name and phone number above to proceed.
                </p>
              ) : !isValidBooking && (
                <p className="text-destructive text-sm mb-4">
                  This slot conflicts with an existing booking or exceeds operating hours.
                </p>
              )}

              <Button
                size="lg"
                className="w-full text-lg py-6 font-semibold"
                disabled={!isValidBooking || confirmed}
                onClick={handleConfirm}
              >
                {confirmed ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Booking Confirmed!
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Confirm Booking – ₹{price}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Success Popup */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="items-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-heading">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-base">
              Your booking for <span className="font-semibold capitalize text-foreground">{sport}</span> on{" "}
              <span className="font-semibold text-foreground">{date ? format(date, "PPP") : ""}</span> has been confirmed.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-secondary/50 rounded-xl p-4 space-y-1 text-sm">
            <p><span className="text-muted-foreground">Time:</span> {startTime !== null ? minutesToTime(startTime) : ""} – {endTimeMinutes !== null ? minutesToTime(endTimeMinutes) : ""}</p>
            <p><span className="text-muted-foreground">Duration:</span> {duration} hr{duration > 1 ? "s" : ""}</p>
            <p className="text-lg font-bold text-primary">₹{price}</p>
          </div>
          <Button onClick={() => setShowSuccessDialog(false)} className="w-full mt-2">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BookingForm;
