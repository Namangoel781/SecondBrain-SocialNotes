import React, { useState } from "react";
import FetchSharedContent from "./components/FetchSharedContent";

const SharedContent = () => {
  const [sharedLink, setSharedLink] = useState("");

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    setSharedLink(e.target.elements.link.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          Fetch Shared Content
        </h1>
        <form onSubmit={handleLinkSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="link"
              placeholder="Enter link to fetch content"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Fetch Content
          </button>
        </form>

        {sharedLink && (
          <div className="mt-8 p-4 bg-indigo-50 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              Fetched Content
            </h2>
            <FetchSharedContent link={sharedLink} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedContent;
