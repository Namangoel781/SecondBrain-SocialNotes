import { Request, Response } from "express";
import mongoose from "mongoose";
import { Content } from "../models/ContentModel";
import { User } from "../models/UserModel";
import { Tag } from "../models/TagModel";
import { SharedContent } from "../models/SharedContentModel";

export const createContent = async (req: Request & {userId?: string}, res: Response): Promise<void> => {
    try {
        const {link, type, title, tags, } = req.body;
        const userId = req.userId

        console.log('Request Body:', { link, type, title, tags, userId });


        if (!link || !type || !title || !userId || !Array.isArray(tags)) {
            res.status(400).json({message: "All fields and authentication are required"})
            return
        }

        if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string')) {
            res.status(400).json({ message: "Tags must be an array of strings" });
            return;
        }
        

        const userExists = await User.findById(userId)
        if (!userExists) {
            res.status(404).json({message: 'User not found'})
            return
        }

        const validTypes = ['article', 'video', 'audio', 'tweets']; // Add your valid types here
        if (!validTypes.includes(type)) {
             res.status(400).json({ message: "Invalid content type" });
             return
        }

        const tagIds = await Promise.all(
            tags.map(async (tagTitle: string) => {
                const tag = await Tag.findOneAndUpdate(
                    { title: tagTitle },
                    { $setOnInsert: { title: tagTitle } },
                    { upsert: true, new: true }
                );
                return tag._id;
            })
        );
        

        const newContent = new Content({
            link,
            type,
            title,
            tags: tagIds,
            userId
        })

        await newContent.save()

        const shareLink = `shared_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;


        await SharedContent.create({
            shareLink,
            link,
            type,
            title,
            tags: tagIds,
            ownerId: userId
        })

        res.status(201).json({
            message: 'Content create successfully.', content: newContent
        })
        } catch (error) {
            console.error('Error creating content:', error);
            res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getContent = async (req: Request & {userId?: string}, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        console.log("USER ID:", userId)
        if (!userId) {
            res.status(401).json({message: "Authentication required"})
            return
        }

        const userContent = await Content.find({userId}).populate("tags")
        console.log("Fetched Content:", userContent)

        res.status(200).json({
            message: "Content fetched successfully", Content: userContent
        })
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteContent = async (req: Request & {userId?: string}, res: Response): Promise<void> => {
    try {
        const {contentId} = req.params;
        const userId = req.userId;

        console.log("Deleting content with ID:", contentId);
        console.log("Authenticated user ID:", userId);


        if (!userId) {
            res.status(401).json({message: "Authentication required"})
            return
        }

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            res.status(400).json({ message: "Invalid content ID" });
            return;
        }

       const content = await Content.findOneAndDelete({_id: contentId, userId})

       if (!content) {
        console.log(`Content with ID ${contentId} not found`);
        res.status(404).json({message: "Content not found or you don't have permission to delete it"})
        return
       }
       res.status(200).json({ message: "Content deleted successfully" });

    } catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const saveContent = async (req: Request & { userId?: string }, res: Response) => {
    try {
        const {link, type, title, tags} = req.body;
        const userId = req.userId;

        if (!link || !type || !title || !tags || !userId) {
            return res.status(400).json({message: "Link, type, title, and userId are required"})
        }

        if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string')) {
            res.status(400).json({ message: "Tags must be an array of strings" });
            return;
        }
        

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tagIds = await Promise.all(
            tags.map(async (tagTitle: string) => {
                const tag = await Tag.findOneAndUpdate(
                    { title: tagTitle },
                    { $setOnInsert: { title: tagTitle } },
                    { upsert: true, new: true }
                );
                return tag._id;
            })
        );
        

        const newContent = new Content({
            link,
            type,
            title,
            tags: tagIds, 
            userId
        });

        await newContent.save()

        const populatedContent = await Content.findById(newContent._id).populate("tags");


        res.status(201).json({
            message: "Content saved successfully",
            content: populatedContent
        });
    } catch (err) {
        console.error("Error saving content:", err);
        res.status(500).json({ message: 'Server error, failed to save content' });
    }
}