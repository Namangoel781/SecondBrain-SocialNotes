import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

export const validateObjectId = (field: string) => {
    return (req: Request, res: Response, next: Function): void => {
        const value = req.params[field] || req.body[field];
        if (!mongoose.Types.ObjectId.isValid(value)) {
             res.status(400).json({ message: `${field} is not a valid ObjectId` });
             return
        }
        next();
    };
};
