import { SPORTS } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";

interface SportSelectorProps {
  selected: string;
  onSelect: (sport: string) => void;
}

const SportSelector = ({ selected, onSelect }: SportSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {SPORTS.map((sport) => (
        <button
          key={sport.id}
          onClick={() => onSelect(sport.id)}
          className={cn(
            "rounded-xl px-5 py-3 text-sm font-semibold tracking-wide uppercase transition-all duration-300 border",
            selected === sport.id
              ? "border-primary bg-primary/15 text-primary glow"
              : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
          )}
        >
          {sport.name}
        </button>
      ))}
    </div>
  );
};

export default SportSelector;
