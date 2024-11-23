import express from "express";
import { fetchTweet } from "../controllers/tweetController";
import validateTweetType from "../Middleware/validateTweet";
import { Content } from "../models/ContentModel";
import verifyToken from "../Middleware/authMiddleware";
// import { authMiddleware } from "../Middleware/authMiddleware";

const router = express.Router();



router.post("/save-tweet", verifyToken ,validateTweetType, async (req, res) => {
    try {
      // Logic to save the tweet to the database
      const { link, type, title, tags, userId } = req.body;
  
      // Example save operation
      const savedTweet = await Content.create({ link, type, title, tags, userId });
  
      res.status(201).json({ success: true, message: "Tweet saved successfully!", data: savedTweet });
    } catch (error) {
      console.error("Error saving tweet:", error);
      res.status(500).json({ error: "Failed to save tweet" });
    }
  });

// Fetch tweet route
router.get("/fetch-tweet", verifyToken,fetchTweet);

export default router;
