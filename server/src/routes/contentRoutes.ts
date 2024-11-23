import { Router } from "express";
import { createContent, deleteContent, getContent, saveContent } from "../controllers/contentController";
import verifyToken, { authMiddleware } from "../Middleware/authMiddleware";
import { getSharedContent, getSharedContentsByUser, shareContent } from "../controllers/shareContentController";
import { validateObjectId } from "../Middleware/validateObjectId";

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);


const router = Router();

router.post('/content', verifyToken, authMiddleware(['link', 'type', 'title']), asyncHandler(createContent));

router.get('/content', verifyToken, asyncHandler(getContent));

router.delete('/content/:contentId', verifyToken, asyncHandler(deleteContent));

router.post('/brain/share', verifyToken, asyncHandler(shareContent));  // Ensure verifyToken is correctly used

router.get('/brain/:shareLink', asyncHandler(getSharedContent));

router.get("/brain/shared-contents/:userId", validateObjectId("userId") ,asyncHandler(getSharedContentsByUser))

export default router;
