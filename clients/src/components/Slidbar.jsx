import React, { useState } from "react";
import {
  Brain,
  FileText,
  Link2,
  Tags,
  Twitter,
  Video,
  Share2Icon,
} from "lucide-react";

const Sidebar = ({ setActiveTab, activeTab }) => {
  const handleTabSwitch = (tab) => {
    setActiveTab(tab); // Set the active tab
  };

  return (
    <aside className="w-64 border-r bg-white p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <Brain className="w-8 h-8 text-indigo-600" />
        <span className="text-xl font-bold text-slate-800">Second Brain</span>
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
          label="Documents"
          isActive={activeTab === "documents"}
          onClick={() => handleTabSwitch("documents")}
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
    </aside>
  );
};

const SidebarButton = ({ icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 text-slate-700 rounded-md transition-colors 
      ${isActive ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-100"}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Sidebar;
