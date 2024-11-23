import React, { useState, useEffect } from "react";
import API from "../api/api";
import axios from "axios";
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

const SharedContentPage = ({ link: initialLink }) => {
  const [link, setLink] = useState(initialLink || "");
  const [content, setContent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [contentType, setContentType] = useState("Tweet");

  const validTypes = ["Article", "Video", "Audio", "Tweet"];

  const isValidSharedUrl = (url) => {
    const regex =
      /^shared_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
    return regex.test(url);
  };

  const fetchContent = async () => {
    setError("");
    setContent(null);

    if (!link || !isValidSharedUrl(link)) {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/brain/${link}`);
      console.log("API Response:", response);

      if (response.data && response.data.sharedContent) {
        setContent(response.data.sharedContent);
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

  const saveContent = async (contentData) => {
    const { link, title, tags, userId, type } = contentData;
    console.log("Content data to be saved:", contentData);

    if (!link || !title) {
      console.error("Missing fields: link, title");
      alert("Link and title are required.");
      return;
    }

    const normalizedType = type.trim().toLowerCase();
    const validTypes = ["article", "video", "audio", "tweets"];

    if (!validTypes.includes(normalizedType)) {
      console.error("Invalid content type:", type);
      alert("Invalid content type. Please select a valid type.");
      return;
    }

    const normalizedTags = tags
      .map((tag) => (typeof tag === "string" ? tag : tag.title || "").trim())
      .filter((tag) => tag.trim() !== ""); // Normalize to plain strings and remove empty values

    if (
      !Array.isArray(normalizedTags) ||
      normalizedTags.some((tag) => typeof tag !== "string")
    ) {
      alert("Tags must be an array of non-empty strings.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Authorization token missing");
      alert("You must be logged in to save content");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/content",
        {
          link,
          type: normalizedType,
          title,
          tags: normalizedTags,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Content saved successfully:", response.data);
      alert("Content saved successfully!");
    } catch (error) {
      console.error(
        "Error saving content:",
        error.response?.data || error.message
      );
      alert("Failed to save content. Please try again.");
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

      <Button
        onClick={() =>
          saveContent({
            link: content.link, // Pass content data here
            title: content.title,
            tags: content.tags,
            userId: "someUserId", // Dynamically use current user's ID
            type: content.type || "Article", // Ensure type is valid
          })
        }
        className="mt-4"
      >
        Save Content
      </Button>
    </div>
  );
};

export default SharedContentPage;
