import React, { useState, useEffect } from "react";
import API from "../api/api";
import { Tweet } from "react-tweet";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Share2, Trash2 } from "lucide-react";

const FetchSharedContent = ({ link: initialLink }) => {
  const [link, setLink] = useState(initialLink || "");
  const [content, setContent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const isValidUrl = (url) => {
    const regex =
      /^http:\/\/localhost:5000\/api\/v1\/brain\/shared_[a-z0-9]+_[a-z0-9]+$/;
    return regex.test(url);
  };

  const isValidSharedUrl = (url) => {
    const regex = /^shared_[a-z0-9]+_[a-z0-9]+$/;
    return regex.test(url);
  };

  const fetchContent = async () => {
    setError("");
    setContent(null);

    if (!link) {
      setError("Please enter a valid URL.");
      return;
    }

    let contentId;
    if (isValidUrl(link)) {
      contentId = link.split("shared_")[1];
      if (!contentId) {
        setError("Invalid URL format. Please check the URL.");
        return;
      }
    } else if (isValidSharedUrl(link)) {
      contentId = link;
    } else {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/brain/${contentId}`);

      // Log the response to see its structure
      console.log("API Response:", response);

      if (response.data && response.data.sharedContent) {
        setContent(response.data.sharedContent); // Corrected the response key
      } else {
        throw new Error("Content not found in the response.");
      }
    } catch (err) {
      console.error("Error fetching content:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch the content. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    if (!content) {
      setError("No content to save.");
      return;
    }

    const validTypes = ["Article", "Video", "Audio", "tweets"];
    if (!validTypes.includes(content.type)) {
      setError(
        `Invalid content type: ${content.type}. Please select a valid type.`
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to save content.");
      return;
    }

    const user = localStorage.getItem("user");
    if (!user) {
      setError("No user found in localstorage. Please log in.");
      return;
    }

    let userId = null;
    try {
      const parsedUser = JSON.parse(user); // Safely parse the user object
      userId = parsedUser?.id; // Access the id if parsed successfully
    } catch (error) {
      setError("Failed to parse user data.");
      return;
    }

    if (!userId) {
      setError("User data is missing or invalid.");
      return;
    }

    const tags = Array.isArray(content.tags)
      ? content.tags.map((tag) => String(tag)) // Convert all elements to strings
      : [];

    try {
      setSaveStatus("Saving Content...");
      const response = await API.post(
        "/content",
        {
          link,
          type: content.type,
          title: content.title || "Untitled",
          tags,
          userId: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response:", response); // Log full response
      setContent(response.data);
      setSaveStatus("Content saved successfully.");
    } catch (err) {
      console.error("Error saving content:", err.response?.data || err.message);
      setSaveStatus("Failed to save content.");
      setError(
        err.response?.data?.message ||
          "An error occurred while saving the content. Please try again."
      );
    }
  };

  useEffect(() => {
    if (initialLink) fetchContent(); // Fetch content if initialLink is provided
  }, [initialLink]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Fetch Shared Content
      </h2>

      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter the URL"
        className="w-full p-2 border rounded-lg mb-4"
      />
      <Button onClick={fetchContent} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Content"}
      </Button>

      {error && <p className="text-red-600">{error}</p>}
      {saveStatus && <p className="text-green-600">{saveStatus}</p>}

      {content && (
        <Card className="mb-4 overflow-hidden shadow-md border border-gray-200 rounded-lg bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">
              {content.title || "Untitled"}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-blue-100"
                aria-label="Share this note"
                onClick={() => alert("Sharing feature not implemented yet")}
              >
                <Share2 className="h-4 w-4 text-blue-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-100"
                onClick={() => alert("Delete feature not implemented yet")}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {content.type === "tweets" && content.link ? (
              <div className="border rounded-lg p-3 bg-blue-50">
                <Tweet id={content.link.split("/status/")[1]} />
              </div>
            ) : (
              <p className="text-sm text-gray-700">
                {typeof content.content === "string"
                  ? content.content
                  : JSON.stringify(content.content) || "No content available."}
              </p>
            )}
          </CardContent>
          <CardFooter className="p-4 bg-gray-50">
            <div className="flex flex-wrap gap-2 mb-2">
              {content.tags &&
                content.tags.map((tag, index) => (
                  <Badge
                    key={tag._id || `${tag.title}-${index}`}
                    className="bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs"
                  >
                    {tag.title}
                  </Badge>
                ))}
            </div>
            <p className="text-xs text-gray-500">
              Added on {content.date || "Recent"}
            </p>
          </CardFooter>
        </Card>
      )}

      <Button onClick={saveContent} className="mt-4">
        Save Content
      </Button>
    </div>
  );
};

export default FetchSharedContent;
