import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = "156156"

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authMiddleware = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields = fields.filter((field) => !req.body[field]);
    if (missingFields.length) {
      res.status(400).json({ message: `Missing fields: ${missingFields.join(", ")}` });
      return; 
    }
    next();
  };
};

  const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1]; // Assuming "Bearer <token>"
    
    if (!token) {
        res.status(401).json({ message: "Authentication token missing" });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        console.log("Decoded token:", decoded); // Log the decoded token
        req.userId = decoded.userId; // Extend the req object with userId
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default verifyToken;