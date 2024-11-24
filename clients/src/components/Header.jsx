import React from "react";
import { Plus } from "lucide-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Header = ({ onShareClick, onAddClick }) => {
  return (
    <header className="h-16 border-b bg-white px-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-slate-800">All Notes</h1>
      <div className="flex gap-2">
        {/* <button
          onClick={onShareClick}
          className="px-3 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share Brain
        </button> */}
        <button
          onClick={onAddClick}
          className="px-3 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Content
        </button>
        <Link
          to="/shared-content"
          className="px-3 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add shared Content
        </Link>
      </div>
    </header>
  );
};

Header.propTypes = {
  onShareClick: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
};

export default Header;
