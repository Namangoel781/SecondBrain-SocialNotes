import React, { useState, useEffect } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import { jwtDecode } from "jwt-decode";
import { Card, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Share2, Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge"; // Import Badge component
import { Youtube } from "lucide-react"; //Import Youtube icon
import Icon from "../assets/yt.svg";

function formatDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "00:00";

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}

const getVideoIdFromUrl = (url) => {
  const youtubeRegex =
    /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:v\/|e(?:mbed)?)|youtu\.be\/)([^""&?=\s]{11})/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
};

export default function SavedYTVideos({
  onDelete = () => {},
  onShare = () => {},
}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User authentication required.");
        setLoading(false);
        return;
      }

      const { userId } = jwtDecode(token);

      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/fetch/youtube/video",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              userId: userId,
            },
          }
        );
        const validVideos = (response.data.data || []).filter(
          (v) => v._id && v.link && v.type === "video"
        );
        setVideos(validVideos);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("Failed to fetch videos. Please try again later.");
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const youtubeOptions = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  const handleError = (event) => {
    console.error("YouTube player error:", event.data);
    setError(
      "An error occurred while playing the video. Please try again later."
    );
  };

  const handleDelete = async (videoId, video) => {
    try {
      await onDelete(videoId, video);
      setVideos(videos.filter((v) => v._id !== videoId));
      setSuccessMessage("Video successfully deleted.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting video:", error);
      setError("Failed to delete video. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {loading && (
        <p className="text-center text-gray-600">Loading videos...</p>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert
          variant="success"
          className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
        >
          <AlertTitle className="font-bold">Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && videos.length === 0 && (
        <p className="text-center text-gray-600">No saved videos found.</p>
      )}

      {videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos
            .filter((video) => video.type === "video")
            .map((video) => {
              const videoId = getVideoIdFromUrl(video.link);

              if (!videoId) {
                console.error(
                  "Failed to extract video ID from URL:",
                  video.link
                );
                return (
                  <p key={video._id} className="text-red-500">
                    Video not available.
                  </p>
                );
              }

              return (
                <Card
                  key={video._id}
                  className="mb-4 overflow-hidden shadow-md border border-gray-200 rounded-lg bg-white"
                >
                  {" "}
                  <CardHeader className="flex flex-row items-center justify-between p-4 bg-gray-50">
                    {" "}
                    <div className="flex items-center gap-2">
                      <img src={Icon} alt="" className="text-red-500 h-7 w-7" />
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {video.details?.title ||
                          video.title ||
                          "Untitled Video"}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-100"
                        aria-label="Share this video"
                        onClick={() => onShare(video)}
                      >
                        <Share2 className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-100"
                        aria-label="Delete this video"
                        onClick={() => handleDelete(video._id, video)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <div className="aspect-w-16 aspect-h-9 border rounded-lg p-3 bg-gray-100">
                    {" "}
                    {/* Updated YouTube player container */}
                    <YouTube
                      videoId={videoId}
                      opts={youtubeOptions}
                      onError={handleError}
                      className="w-full h-full"
                    />
                  </div>
                  <CardFooter className="p-4 bg-gray-50">
                    {" "}
                    <div className="w-full">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {video.tags?.map((tag, index) => (
                          <Badge
                            key={tag._id || `${tag.title}-${index}`}
                            className="bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs"
                          >
                            {tag.title}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Added on {video.details?.publishedAt || "Recent"}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
