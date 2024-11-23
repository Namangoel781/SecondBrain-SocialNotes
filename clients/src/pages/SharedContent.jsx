import React, { useState } from "react";
import FetchSharedContent from "./FetchSharedContent";

const SharedContent = () => {
  const [sharedLink, setSharedLink] = useState("");

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    // Optionally, validate the link before passing it to FetchSharedContent
    setSharedLink(e.target.elements.link.value);
  };

  return (
    <div>
      <h1>Fetch Shared Content</h1>
      <form onSubmit={handleLinkSubmit}>
        <input
          type="text"
          name="link"
          placeholder="Enter link to fetch content"
          className="border px-3 py-2"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Fetch Content
        </button>
      </form>

      {sharedLink && <FetchSharedContent link={sharedLink} />}
    </div>
  );
};

export default SharedContent;
