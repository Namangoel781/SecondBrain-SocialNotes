import { Request, Response } from "express";
import mongoose from "mongoose";
import { Content } from "../models/ContentModel";
import { SharedContent } from "../models/SharedContentModel";
import {v4 as uuidv4} from "uuid"

// Share Content
export const shareContent = async (req: Request & { userId?: string }, res: Response) => {
    try {
        const { contentId } = req.body;
        const userId = req.userId;

        // Check for missing or invalid contentId and userId
        if (!contentId || !userId) {
            return res.status(400).json({ message: "Content ID and user ID are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return res.status(400).json({ message: "Invalid content ID" });
        }

        // Fetch content from the database
        const content = await Content.findById(contentId).populate("tags");
        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        // Generate a unique share link using nanoid
        const shareLink =  `shared_${uuidv4()}`;

        // Create and save the shared content
        const sharedContent = new SharedContent({
            shareLink,
            link: content.link,
            type: content.type,
            title: content.title,
            tags: content.tags,
            ownerId: userId,
            contentId: content._id,  // Store contentId to avoid sharing the same content again
        });

        await sharedContent.save();

        res.status(201).json({ message: "Content shared successfully", shareLink });
    } catch (error) {
        console.error("Error sharing content:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get Shared Content by Share Link
export const getSharedContent = async (req: Request & { userId?: string }, res: Response) => {
    const { shareLink } = req.params;

    try {
        console.log("Received shareLink:", shareLink);
        if (!shareLink) {
            return res.status(400).json({ message: "Share link is required" });
        }

        const sharedContent = await SharedContent.findOne({ shareLink })
        .populate("tags")
        .lean();

        console.log("Fetched shared Content:", sharedContent);         

        if (!sharedContent) {
            return res.status(404).json({ message: "Shared content not found" });
        }

        res.status(200).json({
            message: "Shared content fetched successfully",
            sharedContent,
        });
    } catch (error) {
        console.error("Error fetching shared content:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get All Shared Contents by User
export const getSharedContentsByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const sharedContents = await SharedContent.find({ ownerId: userId })
            .populate("tags")
            .lean();

        res.status(200).json({
            message: "Shared contents fetched successfully",
            sharedContents: sharedContents || [],
        });
    } catch (error) {
        console.error("Error fetching shared contents by user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
