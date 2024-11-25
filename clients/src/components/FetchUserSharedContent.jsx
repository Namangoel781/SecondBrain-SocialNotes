import React, { useState, useEffect } from "react";
import API from "../api/api";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tweet } from "react-tweet";
import Masonry from "react-masonry-css";
import YouTube from "react-youtube"; // Import YouTube component
import usePagination from "../context/usePagination"; // Import your pagination hook

const FetchUserSharedContent = () => {
  const [content, setContent] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;

  // Use pagination hook to handle pagination
  const {
    paginatedItems,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
  } = usePagination(content, itemsPerPage);

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  const fetchSharedContents = async () => {
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      setError("You must be logged in to fetch shared contents.");
      setLoading(false);
      return;
    }

    const parsedUser = user ? JSON.parse(user) : null;

    if (!parsedUser || !parsedUser.id) {
      setError("Invalid user data. Please log in again.");
      setLoading(false);
      return;
    }

    const userId = parsedUser.id;

    try {
      const response = await API.get(`/brain/shared-contents/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedSharedContents = response.data.sharedContents || [];
      const uniqueContents = [];
      const seenLinks = new Set();

      for (const item of fetchedSharedContents) {
        if (!seenLinks.has(item.link)) {
          seenLinks.add(item.link);
          uniqueContents.push(item);
        }
      }

      if (uniqueContents.length === 0) {
        setError("No shared content found for this user.");
      } else {
        setContent(uniqueContents);
      }
    } catch (err) {
      console.error("Error fetching shared contents: ", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch shared contents. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedContents();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  // Function to extract video ID from YouTube URL
  const extractYouTubeVideoId = (url) => {
    const youtubeRegex =
      /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:v\/|e(?:mbed)?)|youtu\.be\/)([^""&?=\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        User's Shared Content
      </h2>

      {error && <p className="text-red-600">{error}</p>}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-transparent"
      >
        {content.length > 0
          ? paginatedItems.map((sharedContent) => {
              const videoId = extractYouTubeVideoId(sharedContent.link);

              return (
                <Card
                  key={sharedContent._id}
                  className="mb-4 overflow-hidden shadow-lg border border-gray-200 rounded-lg bg-white transition-transform transform hover:scale-105"
                >
                  <CardHeader className="flex flex-row items-center justify-between p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {sharedContent.title || "Untitled"}
                    </h3>
                  </CardHeader>
                  <CardContent className="p-4">
                    {/* Render tweet link */}
                    {sharedContent.link && videoId ? (
                      <YouTube
                        videoId={videoId}
                        opts={{ height: "390", width: "100%" }}
                      />
                    ) : sharedContent.link ? (
                      <Tweet id={extractTweetId(sharedContent.link)} />
                    ) : (
                      <p className="text-sm text-gray-700">
                        No content available.
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 bg-gray-50">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {sharedContent.tags &&
                        sharedContent.tags.map((tag) => (
                          <Badge
                            key={tag._id}
                            className="bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs"
                          >
                            {tag.title}
                          </Badge>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Added on{" "}
                      {sharedContent.createdAt
                        ? new Date(sharedContent.createdAt).toLocaleDateString()
                        : "Recent"}
                    </p>
                  </CardFooter>
                </Card>
              );
            })
          : !error && <p>No shared content found for this user.</p>}
      </Masonry>

      <div className="flex justify-between mt-4">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>

      <Button onClick={fetchSharedContents} className="mt-4 text-center">
        Refresh Shared Content
      </Button>
    </div>
  );
};

const extractTweetId = (url) => {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : null;
};

export default FetchUserSharedContent;
