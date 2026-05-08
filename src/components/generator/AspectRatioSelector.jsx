import React from "react";
import { cn } from "@/lib/utils";

const options = [
  {
    id: "1:1",
    label: "Square",
    sublabel: "1:1",
    // preview box dimensions (relative, always sum to fit nicely)
    previewW: "w-10",
    previewH: "h-10",
  },
  {
    id: "16:9",
    label: "Landscape",
    sublabel: "16:9",
    previewW: "w-14",
    previewH: "h-8",
  },
  {
    id: "9:16",
    label: "Portrait",
    sublabel: "9:16",
    previewW: "w-8",
    previewH: "h-14",
  },
];

export default function AspectRatioSelector({ value, onChange }) {
  return (
    <div className="flex gap-3">
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-2 py-4 px-2 rounded-lg border-2 transition-all duration-200",
              selected
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-secondary/50 text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
            )}
          >
            {/* Visual aspect ratio preview */}
            <div className="h-14 flex items-center justify-center">
              <div
                className={cn(
                  "rounded border-2 transition-all duration-200",
                  opt.previewW,
                  opt.previewH,
                  selected ? "border-primary bg-primary/20" : "border-muted-foreground/40 bg-muted/30"
                )}
              />
            </div>
            <span className="text-xs font-semibold">{opt.label}</span>
            <span className="text-[10px] opacity-60">{opt.sublabel}</span>
          </button>
        );
      })}
    </div>
  );
}