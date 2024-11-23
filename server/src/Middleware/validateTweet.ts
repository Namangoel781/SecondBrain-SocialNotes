import { Request, Response, NextFunction } from "express";

const validateTweetType = (req: Request, res: Response, next: NextFunction): void => {
  const { type } = req.body;

  // Allowed types
  const validTypes = ["video", "article", "image", "tweet"];

  if (!type || !validTypes.includes(type)) {
    res.status(400).json({
      error: "Invalid type. Allowed types are: video, article, image, tweet.",
    });
    return; // Explicitly return to stop further execution
  }

  next(); // Continue to the next handler
};

export default validateTweetType;
