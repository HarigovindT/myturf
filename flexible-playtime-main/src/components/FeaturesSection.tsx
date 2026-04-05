import { Clock, Shield, Zap, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Clock,
    title: "Flexible Duration",
    desc: "Book for 1, 1.5, 2, 2.5, or 3 hours — your call.",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    desc: "Real-time availability. No waiting, no calls.",
  },
  {
    icon: IndianRupee,
    title: "Dynamic Pricing",
    desc: "Lower rates off-peak, transparent pricing always.",
  },
  {
    icon: Shield,
    title: "Conflict-Free",
    desc: "Smart algorithm prevents double bookings.",
  },
];

const FeaturesSection = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="py-20 px-4">
  <div className="max-w-5xl mx-auto">
    <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
      Why Play <span className="text-gradient">With Us</span>
    </h2>

        {/* Desktop grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={cn(
                "glass-card p-6 transition-all duration-500",
                active === i
                  ? "border-primary/40 bg-primary/5 scale-[1.04] shadow-lg shadow-primary/10"
                  : "hover:border-primary/30 hover:scale-[1.02]"
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile slider */}
        <div className="sm:hidden overflow-hidden relative">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {features.map((f) => (
              <div key={f.title} className="w-full shrink-0 px-2">
                <div className="glass-card p-6 border-primary/30 bg-primary/5">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  active === i ? "bg-primary w-6" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
