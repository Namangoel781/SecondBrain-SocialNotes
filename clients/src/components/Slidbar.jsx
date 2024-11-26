import React, { useState } from "react";
import {
  Brain,
  FileText,
  Link2,
  Tags,
  Twitter,
  Video,
  Share2Icon,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Sidebar = ({ setActiveTab, activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 mb-8">
        <Brain className="w-8 h-8 text-indigo-600" />
        <span className="text-xl font-bold text-foreground">Second Brain</span>
      </div>
      <nav className="space-y-2">
        <SidebarButton
          icon={<Twitter className="w-4 h-4" />}
          label="Tweets"
          isActive={activeTab === "tweets"}
          onClick={() => handleTabSwitch("tweets")}
        />
        <SidebarButton
          icon={<Video className="w-4 h-4" />}
          label="Videos"
          isActive={activeTab === "videos"}
          onClick={() => handleTabSwitch("videos")}
        />
        <SidebarButton
          icon={<FileText className="w-4 h-4" />}
          label="Articles"
          isActive={activeTab === "articles"}
          onClick={() => handleTabSwitch("articles")}
        />
        <SidebarButton
          icon={<Link2 className="w-4 h-4" />}
          label="Links"
          isActive={activeTab === "links"}
          onClick={() => handleTabSwitch("links")}
        />
        <SidebarButton
          icon={<Tags className="w-4 h-4" />}
          label="Tags"
          isActive={activeTab === "tags"}
          onClick={() => handleTabSwitch("tags")}
        />
        <SidebarButton
          icon={<Share2Icon className="w-4 h-4" />}
          label="Shared Brain"
          isActive={activeTab === "shared"}
          onClick={() => handleTabSwitch("shared")}
        />
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-background p-4 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <SheetHeader>
            <SheetTitle className="flex justify-between items-center">
              Menu
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

const SidebarButton = ({ icon, label, onClick, isActive }) => (
  <Button
    variant={isActive ? "ghost" : "ghost"}
    className={cn(
      "w-full justify-start hover:bg-indigo-50 hover:text-indigo-600",
      isActive &&
        "bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700"
    )}
    onClick={onClick}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </Button>
);

export default Sidebar;
