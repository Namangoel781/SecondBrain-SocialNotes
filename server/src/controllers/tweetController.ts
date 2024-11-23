import { Request, Response } from "express";
import axios from "axios";

const TWITTER_API_BASE_URL = 'https://api.twitter.com/2';
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || "AAAAAAAAAAAAAAAAAAAAACBTxAEAAAAAFbKdH6oQtlEiZsIHomTbdx3PvCA%3DY8uNkkgUEmQKWV9hZhMUrd5dla1YNKYESEj1LtNotEiFrgPJA8";


if (!BEARER_TOKEN) {
  console.error("Error: Twitter Bearer Token is not defined in environment variables.");
  throw new Error("Twitter Bearer Token is required.");
}

export const fetchTweet = async (req: Request, res: Response): Promise<void> => {
  try {
    // Step 1: Validate tweet URL
    const tweetUrl: string | undefined = req.query.tweetUrl as string;
    
    if (!tweetUrl) {
      res.status(400).json({ error: "Tweet URL is required" });
      return;
    }

    // Step 2: Extract tweet ID from the URL
    const tweetIdMatch = tweetUrl.match(/\/status\/(\d+)/);
    
    if (!tweetIdMatch) {
      res.status(400).json({ 
        error: "Invalid tweet URL. Ensure it contains '/status/{tweetId}'" 
      });
      return;
    }

    const tweetId: string = tweetIdMatch[1];

    // Step 3: Prepare Twitter API request parameters
    const axiosConfig = {
      method: 'get',
      url: `${TWITTER_API_BASE_URL}/tweets/${tweetId}`,
      params: {
        expansions: 'author_id,attachments.media_keys',
        'tweet.fields': 'created_at,text,public_metrics,entities,referenced_tweets',
        'user.fields': 'name,username,profile_image_url,verified',
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    };

    // Step 4: Make API call to Twitter
    const response = await axios(axiosConfig);

    // Step 5: Respond with tweet data
    res.status(200).json({
      success: true,
      data: response.data
    });

  } catch (error: any) {
    // Step 6: Comprehensive error handling
    console.error("Error fetching tweet:", error);

    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({
        error: error.response?.data || "Twitter API request failed",
      });
    } else {
      res.status(500).json({
        error: "Unexpected error occurred while fetching tweet",
        details: error.message,
      });
    }
  }
};

export const getTweetMedia = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ message: "getTweetMedia is not implemented yet." });
}
