import { Request, Response } from "express";
import axios from "axios";
import { Content } from "../models/ContentModel";

const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "AIzaSyBp9LTLY0cG3JPhtoFKVMHiSivVQxEUpJE";

if (!YOUTUBE_API_KEY) {
  console.error("Error: YouTube API Key is not defined in environment variables.");
  throw new Error("YouTube API Key is required.");
}

// Fetch YouTube video details using the API
export const fetchYouTubeVideo = async (req: Request & {userId: string}, res: Response): Promise<void> => {
    try {
        
        // Step 1: Extract userId from request (from token or query)
        const userId = req.userId;  // Assuming userId is available in req.user or as query param

        if (!userId) {
            res.status(400).json({ error: "User ID is required to fetch saved videos" });
            return;
        }

        const videoUrl: string | undefined = req.query.videoUrl as string;

        if (!videoUrl) {
            res.status(400).json({ error: "YouTube video URL is required" });
            return;
        }

        const videoIdMatch = videoUrl.match(/(?:v=|youtu\.be\/|\/v\/|embed\/|\/watch\?v=)([a-zA-Z0-9_-]{11})/);

        if (!videoIdMatch) {
            res.status(400).json({ error: "Invalid YouTube URL. Ensure it contains a valid video ID." });
            return;
        }

        const videoId = videoIdMatch[1];

        // Step 2: Prepare request to fetch YouTube video data
        const axiosConfig = {
            method: "get",
            url: `${YOUTUBE_API_BASE_URL}/videos`,
            params: {
                id: videoId,
                part: "snippet,statistics,contentDetails",
                key: YOUTUBE_API_KEY,
            },
        };

        const response = await axios(axiosConfig);

        if (response.data.items.length === 0) {
            res.status(404).json({ error: "YouTube video not found" });
            return;
        }

        const videoData = response.data.items[0];

        // Step 3: Check if the video is saved by the user
        const savedVideo = await Content.findOne({ 
            link: videoUrl, 
            type: 'video', 
            userId: userId 
        });

        if (!savedVideo) {
            res.status(404).json({ error: "Video not found in user's saved content" });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                id: videoData.id,
                title: videoData.snippet.title,
                description: videoData.snippet.description,
                thumbnails: videoData.snippet.thumbnails,
                channelTitle: videoData.snippet.channelTitle,
                viewCount: videoData.statistics.viewCount,
                likeCount: videoData.statistics.likeCount,
                duration: videoData.contentDetails.duration,
            },
        });
    } catch (error: any) {
        console.error("Error fetching YouTube video:", error);
        res.status(500).json({
            error: "Unexpected error occurred while fetching YouTube video.",
            details: error.message,
        });
    }
};

// Save YouTube video data to the database
export const saveYouTubeVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { link, title, type, userId } = req.body;

    if (!link || !title || !type || !userId) {
      res.status(400).json({ error: "Missing required fields: link, title, type, or userId" });
      return;
    }

    if (type !== "video") {
      res.status(400).json({ error: "Content type must be 'video' for YouTube videos" });
      return;
    }

    const newContent = new Content({
      link,
      type,
      title,
      userId,
    });

    const savedContent = await newContent.save();

    res.status(201).json({
      success: true,
      message: "YouTube video saved successfully",
      data: savedContent,
    });
  } catch (error: any) {
    console.error("Error saving YouTube video:", error);
    res.status(500).json({ error: "Failed to save YouTube video" });
  }
};

// Fetch saved YouTube videos from the database
export const fetchSavedYouTubeVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({ error: "User ID is required to fetch saved videos" });
      return;
    }

    const videos = await Content.find({ userId, type: "video" });

    if (videos.length === 0) {
      res.status(404).json({ message: "No saved YouTube videos found for this user" });
      return;
    }

    res.status(200).json({
      success: true,
      data: videos,
    });
  } catch (error: any) {
    console.error("Error fetching saved YouTube videos:", error);
    res.status(500).json({ error: "Failed to fetch saved YouTube videos" });
  }
};
