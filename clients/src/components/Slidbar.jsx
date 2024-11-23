import React from "react";
import { Brain, FileText, Link2, Tags, Twitter, Video } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 border-r bg-white p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <Brain className="w-8 h-8 text-indigo-600" />
        <span className="text-xl font-bold text-slate-800">Second Brain</span>
      </div>
      <nav className="space-y-2">
        <SidebarButton icon={<Twitter className="w-4 h-4" />} label="Tweets" />
        <SidebarButton icon={<Video className="w-4 h-4" />} label="Videos" />
        <SidebarButton
          icon={<FileText className="w-4 h-4" />}
          label="Documents"
        />
        <SidebarButton icon={<Link2 className="w-4 h-4" />} label="Links" />
        <SidebarButton icon={<Tags className="w-4 h-4" />} label="Tags" />
      </nav>
    </aside>
  );
};

const SidebarButton = ({ icon, label }) => (
  <button className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
    {icon}
    <span>{label}</span>
  </button>
);

export default Sidebar;
