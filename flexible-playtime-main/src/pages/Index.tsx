import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BookingForm from "@/components/BookingForm";
import { Header } from "@/components/ui/header-1";

const Index = () => {
  const bookingRef = useRef<HTMLDivElement>(null);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection onBookNow={scrollToBooking} />
      <FeaturesSection />
      <div ref={bookingRef}>
        <BookingForm />
      </div>
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand & About */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">ArenaTurf</h3>
              <p className="text-sm text-muted-foreground">
                Premium sports turf facility for football, cricket, and more. Book your slot and play on world-class synthetic turf.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">Contact Us</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">📍ArenaTurf, Bogadi, Mysore- 570026</li>
                <li className="flex items-start gap-2">📞 +918075985017</li>
                <li className="flex items-start gap-2">✉️ info@arenaturf.in</li>
              </ul>
            </div>

            {/* Timings & Extras */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">Timings</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Mon – Fri: 6:00 AM – 12:00 PM</li>
                <li>Sat – Sun: 5:00 AM – 12:00 PM</li>
                <li>Parking available on-site</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            <p>© 2026 ArenaTurf. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
