import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarIcon, Clock, IndianRupee, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { minutesToTime, SPORTS } from "@/lib/booking-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DbBooking {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  sport: string;
  booking_date: string;
  start_time: number;
  duration: number;
  end_time: number;
  total_price: number;
  status: string;
  created_at: string;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<DbBooking[]>([]);
  const [phoneSearch, setPhoneSearch] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!phoneSearch.trim()) return;
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("customer_phone", phoneSearch.trim())
      .order("created_at", { ascending: false });

    setBookings((data || []) as DbBooking[]);
    setSearched(true);
  };

  const handleCancel = async (id: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      toast.error("Failed to cancel booking");
    } else {
      toast.success("Booking cancelled");
      handleSearch();
    }
  };

  const getSportIcon = (sportId: string) =>
    SPORTS.find((s) => s.id === sportId)?.icon || "🏟️";

  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  const BookingCard = ({ booking }: { booking: DbBooking }) => (
    <div className={cn(
      "glass-card p-5 transition-all duration-300 hover:scale-[1.01]",
      booking.status === "cancelled" && "opacity-60"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getSportIcon(booking.sport)}</span>
          <div>
            <h3 className="font-heading font-semibold capitalize">{booking.sport}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {booking.booking_date}
            </p>
          </div>
        </div>
        <Badge variant={booking.status === "confirmed" ? "default" : "destructive"} className="text-xs">
          {booking.status}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
          <Clock className="h-3.5 w-3.5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs font-medium">{minutesToTime(booking.start_time)} - {minutesToTime(booking.end_time)}</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
          <p className="text-xs text-muted-foreground mb-1">Duration</p>
          <p className="text-xs font-medium">{booking.duration}hr{booking.duration > 1 ? 's' : ''}</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
          <IndianRupee className="h-3.5 w-3.5 mx-auto mb-1 text-primary" />
          <p className="text-xs font-bold text-primary">₹{booking.total_price}</p>
        </div>
      </div>

      {booking.status === "confirmed" && (
        <Button
          variant="outline"
          size="sm"
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={() => handleCancel(booking.id)}
        >
          <XCircle className="mr-1.5 h-3.5 w-3.5" /> Cancel Booking
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="icon" className="border-border">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">My Bookings</h1>
            <p className="text-sm text-muted-foreground">Search by your phone number</p>
          </div>
        </div>

        {/* Phone Search */}
        <div className="glass-card p-6 mb-8">
          <div className="flex gap-3">
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        {!searched ? (
          <div className="glass-card p-12 text-center">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="font-heading text-lg font-semibold mb-2">Find your bookings</h3>
            <p className="text-sm text-muted-foreground">Enter your phone number to see your bookings.</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="font-heading text-lg font-semibold mb-2">No bookings found</h3>
            <p className="text-sm text-muted-foreground mb-6">No bookings found for this phone number.</p>
            <Link to="/">
              <Button>Book Now</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {confirmed.length > 0 && (
              <div>
                <h2 className="font-heading text-lg font-semibold mb-4 text-primary">Active Bookings</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {confirmed.map((b) => <BookingCard key={b.id} booking={b} />)}
                </div>
              </div>
            )}
            {cancelled.length > 0 && (
              <div>
                <h2 className="font-heading text-lg font-semibold mb-4 text-muted-foreground">Cancelled</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {cancelled.map((b) => <BookingCard key={b.id} booking={b} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
