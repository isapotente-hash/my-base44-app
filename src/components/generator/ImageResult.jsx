import React, { useState } from "react";
import { Download, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { downloadCroppedImage } from "@/utils/downloadImage";

// Map aspect ratio string → CSS aspect-ratio value
const aspectRatioMap = {
  "1:1": "1 / 1",
  "16:9": "16 / 9",
  "9:16": "9 / 16",
};

export default function ImageResult({ imageUrl, aspectRatio }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadCroppedImage(imageUrl, aspectRatio);
    setDownloading(false);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const cssRatio = aspectRatioMap[aspectRatio] || "1 / 1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div
        className="relative rounded-xl overflow-hidden border border-border bg-secondary/30 w-full"
        style={{ aspectRatio: cssRatio }}
      >
        <img
          src={imageUrl}
          alt="Generated image"
          className="w-full h-full object-cover block"
        />
      </div>

      <Button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200"
      >
        {downloading ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Downloading...</>
        ) : downloaded ? (
          <><Check className="w-5 h-5 mr-2" />Downloaded!</>
        ) : (
          <><Download className="w-5 h-5 mr-2" />Download Image</>
        )}
      </Button>
    </motion.div>
  );
}