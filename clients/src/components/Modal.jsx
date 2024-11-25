import { useState, useEffect } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import API from "../api/api";

export default function ShareModal({ isOpen, onClose, content }) {
  const [shareLink, setShareLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.log("Content passed to ShareModal:", content); // Log content
    if (!isOpen) {
      setShareLink("");
      setError("");
      setCopied(false);
    }
  }, [isOpen]); // Log content when modal opens

  const handleShare = async () => {
    if (!content || (!content.id && !content._id)) {
      setError("Content is not valid or missing content ID");
      return;
    }
    setLoading(true);
    try {
      const contentId = content.id || content._id;
      const { data } = await API.post("/brain/share", {
        contentId,
        share: true,
      });
      console.log("API Response:", data); // Log API response
      if (data.shareLink) {
        setShareLink(data.shareLink); // Update shareLink state
      } else {
        setError("Failed to generate the shareable link.");
      }
      setError("");
    } catch (err) {
      console.error("Error sharing content:", err);
      setError(
        err.response?.data?.message || "Failed to generate the shareable link."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Second Brain</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {shareLink ? (
            <>
              <p className="text-sm text-muted-foreground">
                Share your collection with others. They'll be able to import
                your content into their own Second Brain.
              </p>
              <div className="flex items-center space-x-2">
                <Input value={shareLink} readOnly className="flex-1" />
                <Button size="icon" onClick={copyToClipboard}>
                  <AnimatePresence initial={false} mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Copy className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </>
          ) : (
            <Button onClick={handleShare} disabled={loading}>
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Brain
                </>
              )}
            </Button>
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
