import React from "react";
import { cn } from "@/lib/utils";

const styles = [
  { id: "none", label: "None", emoji: "✨", modifier: "" },
  { id: "oil_painting", label: "Oil Painting", emoji: "🖼️", modifier: "in the style of a classical oil painting, rich brushstrokes, textured canvas, painterly" },
  { id: "pencil_drawing", label: "Pencil Drawing", emoji: "✏️", modifier: "as a detailed pencil sketch drawing, graphite shading, hand-drawn lines, sketch art" },
  { id: "watercolor", label: "Watercolor", emoji: "🎨", modifier: "in watercolor painting style, soft washes of color, translucent, flowing pigment on paper" },
  { id: "digital_art", label: "Digital Art", emoji: "💻", modifier: "as vibrant digital concept art, highly detailed, sharp, professional digital illustration" },
  { id: "anime", label: "Anime", emoji: "⛩️", modifier: "in anime illustration style, cel-shaded, Japanese animation aesthetic, clean lines" },
  { id: "photorealistic", label: "Photo", emoji: "📷", modifier: "photorealistic, DSLR photograph, sharp focus, natural lighting, ultra-realistic" },
  { id: "charcoal", label: "Charcoal", emoji: "🖤", modifier: "as a charcoal drawing, bold dark strokes, smudged shading, expressive charcoal on paper" },
];

export default function StyleSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {styles.map((s) => {
        const selected = value === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg border-2 transition-all duration-200 text-center",
              selected
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-secondary/50 text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
            )}
          >
            <span className="text-lg">{s.emoji}</span>
            <span className="text-[10px] font-semibold leading-tight">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export { styles };