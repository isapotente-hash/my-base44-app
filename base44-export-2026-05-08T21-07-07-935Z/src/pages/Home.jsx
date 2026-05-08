const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { motion, AnimatePresence } from "framer-motion";
import AspectRatioSelector from "../components/generator/AspectRatioSelector";
import ImageResult from "../components/generator/ImageResult";
import LoadingAnimation from "../components/generator/LoadingAnimation";
import HistoryGallery from "../components/generator/HistoryGallery";
import StyleSelector, { styles } from "../components/generator/StyleSelector";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [styleId, setStyleId] = useState("none");
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Maps aspect ratio to the size string the GenerateImage API accepts
  const sizeMap = {
    "1:1": "1024x1024",
    "16:9": "1792x1024",
    "9:16": "1024x1792",
  };

  const buildPrompt = () => {
    const styleObj = styles.find((s) => s.id === styleId);
    const styleModifier = styleObj?.modifier || "";
    const base = prompt.trim();
    return styleModifier ? `${base}, ${styleModifier}. High quality, detailed.` : `${base}. High quality, detailed, professional.`;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setCurrentImage(null);
    const result = await db.integrations.Core.GenerateImage({
      prompt: buildPrompt(),
      size: sizeMap[aspectRatio] || "1024x1024",
    });
    const newImage = {
      id: Date.now(),
      url: result.url,
      aspectRatio,
      styleId,
      prompt: prompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setCurrentImage(newImage);
    setHistory((prev) => [newImage, ...prev]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">AI Image Generator</h1>
            <p className="text-xs text-muted-foreground">Describe anything — get an image instantly</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Input Section */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Describe your image</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A sunset over a mountain lake with pine trees reflecting in the water..."
                className="min-h-[100px] bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/50 resize-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !loading) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Aspect Ratio</label>
              <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Style</label>
              <StyleSelector value={styleId} onChange={setStyleId} />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 disabled:opacity-40 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Image
            </Button>
          </div>

          {/* Result Section */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LoadingAnimation />
              </motion.div>
            )}
            {!loading && currentImage && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ImageResult imageUrl={currentImage.url} aspectRatio={currentImage.aspectRatio} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* History Gallery */}
          {history.length > 0 && (
            <div className="border-t border-border/30 pt-8">
              <HistoryGallery history={history} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 px-6 py-3">
        <p className="text-center text-xs text-muted-foreground/50">
          Powered by AI · No signup required
        </p>
      </footer>
    </div>
  );
}