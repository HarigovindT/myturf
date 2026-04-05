import { Link } from "react-router-dom";
import heroImage from "@/assets/turf-hero.jpg";
import arenaLogo from "@/assets/arena-logo.png";
import { Button } from "@/components/ui/button";
import { CalendarCheck, ChevronDown, ClipboardList, Shield } from "lucide-react";

interface HeroSectionProps {
  onBookNow: () => void;
}

const HeroSection = ({ onBookNow }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Premium turf field at sunset"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Header is now in the parent layout */}

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">

        <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Book Your <span className="text-gradient">Perfect Game</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Premium turf, flexible durations, instant booking. Play football, cricket, badminton & more — your way.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={onBookNow} className="text-lg px-8 py-6 glow">
            <CalendarCheck className="mr-2 h-5 w-5" />
            Book Now
          </Button>
          <Link to="/my-bookings">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary/30 hover:bg-foreground/10 hover:text-foreground w-full">
              <ClipboardList className="mr-2 h-5 w-5" />
              My Bookings
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
          {[
            { label: "Sports", value: "4+" },
            { label: "Per Hour", value: "₹800" },
            { label: "Open", value: "6AM-12AM" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading font-bold text-primary text-lg">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </section>
  );
};

export default HeroSection;
