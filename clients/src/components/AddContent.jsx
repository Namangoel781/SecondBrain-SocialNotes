import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { X } from "lucide-react";

export default function AddContentModal({ isOpen, onClose, onAddContent }) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    link: "",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value.toLowerCase() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.type ||
      (formData.type === "tweets" && !formData.link)
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    const contentData = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
    };

    onAddContent(contentData);
    setFormData({ title: "", type: "", link: "", tags: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              name="type"
              value={formData.type}
              onValueChange={handleTypeChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="tweets">Tweets</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {["video", "audio", "tweets", "article"].includes(formData.type) && (
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add Content</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
