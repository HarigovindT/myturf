import {
  generateTimeSlots,
  minutesToTime,
  isSlotAvailable,
  isPeakTime,
  hasConflict,
  OPERATING_HOURS,
  type Booking,
} from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { Clock, AlertCircle } from "lucide-react";

interface TimelineViewProps {
  date: string;
  bookings: Booking[];
  selectedStart: number | null;
  selectedDuration: number;
  onSelectStart: (minutes: number) => void;
}

const TimelineView = ({
  date,
  bookings,
  selectedStart,
  selectedDuration,
  onSelectStart,
}: TimelineViewProps) => {
  const slots = generateTimeSlots();

  const isInSelection = (slot: number) => {
    if (selectedStart === null) return false;
    const end = selectedStart + selectedDuration * 60;
    return slot >= selectedStart && slot < end;
  };

  const canStartHere = (slot: number) => {
    const endMinutes = slot + selectedDuration * 60;
    if (endMinutes > OPERATING_HOURS.end * 60) return false;
    return !hasConflict(slot, selectedDuration, date, bookings);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/30" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-destructive/30 border border-destructive/20" />
          <span className="text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary border border-primary" />
          <span className="text-muted-foreground">Your Selection</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-accent/20 border border-accent/30" />
          <span className="text-muted-foreground">Peak (₹1200/hr)</span>
        </div>
      </div>

      {selectedStart !== null && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-sm">
          <Clock className="h-4 w-4 text-primary shrink-0" />
          <span className="text-foreground">
            Selected: <strong>{minutesToTime(selectedStart)}</strong> → <strong>{minutesToTime(selectedStart + selectedDuration * 60)}</strong> ({selectedDuration}hr{selectedDuration > 1 ? 's' : ''})
          </span>
        </div>
      )}

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {slots.map((slot) => {
          const available = isSlotAvailable(slot, date, bookings);
          const selected = isInSelection(slot);
          const peak = isPeakTime(slot);
          const validStart = available && canStartHere(slot);

          return (
            <button
              key={slot}
              disabled={!available}
              onClick={() => validStart && onSelectStart(slot)}
              title={
                !available
                  ? "Already booked"
                  : !validStart
                    ? "Not enough time for selected duration"
                    : `Start at ${minutesToTime(slot)}`
              }
              className={cn(
                "relative py-2.5 px-1.5 rounded-lg text-xs font-medium transition-all duration-200 border",
                selected
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105 z-10"
                  : available
                    ? validStart
                      ? peak
                        ? "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 hover:border-accent/40 hover:scale-105"
                        : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:border-primary/40 hover:scale-105"
                      : "bg-muted/50 text-muted-foreground border-border/30 cursor-not-allowed opacity-50"
                    : "bg-destructive/10 text-destructive/50 cursor-not-allowed border-destructive/10 line-through"
              )}
            >
              {minutesToTime(slot)}
            </button>
          );
        })}
      </div>

      {selectedStart !== null && !canStartHere(selectedStart) && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>This slot conflicts with an existing booking or exceeds operating hours.</span>
        </div>
      )}
    </div>
  );
};

export default TimelineView;
