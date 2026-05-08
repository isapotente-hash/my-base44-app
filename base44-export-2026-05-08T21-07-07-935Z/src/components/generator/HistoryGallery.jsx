import React, { useState } from "react";
import { Download, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { downloadCroppedImage } from "@/utils/downloadImage";

const aspectRatioMap = {
  "1:1": "1 / 1",
  "16:9": "16 / 9",
  "9:16": "9 / 16",
};

function HistoryItem({ item, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative cursor-pointer rounded-lg overflow-hidden border border-border bg-secondary/30 hover:border-primary/50 transition-all duration-200"
      style={{ aspectRatio: aspectRatioMap[item.aspectRatio] || "1 / 1" }}
      onClick={() => onClick(item)}
    >
      <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <span className="text-white text-xs font-medium px-2 text-center line-clamp-3">{item.prompt}</span>
      </div>
    </motion.div>
  );
}

function LightboxModal({ item, onClose }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadCroppedImage(item.url, item.aspectRatio);
    setDownloading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative max-w-2xl w-full bg-card rounded-2xl overflow-hidden border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className="w-full bg-secondary/30"
          style={{ aspectRatio: aspectRatioMap[item.aspectRatio] || "1 / 1" }}
        >
          <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
        </div>

        <div className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{item.prompt}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground/60">{item.aspectRatio} · {item.timestamp}</span>
            <Button
              onClick={handleDownload}
              disabled={downloading}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="w-4 h-4 mr-1.5" />
              {downloading ? "Downloading..." : "Download"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HistoryGallery({ history }) {
  const [selected, setSelected] = useState(null);

  if (history.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>History ({history.length})</span>
      </div>

      {/* Masonry-style grid that respects each image's aspect ratio */}
      <div className="columns-2 sm:columns-3 gap-3 space-y-3">
        {history.map((item) => (
          <div key={item.id} className="break-inside-avoid mb-3">
            <HistoryItem item={item} onClick={setSelected} />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <LightboxModal item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}