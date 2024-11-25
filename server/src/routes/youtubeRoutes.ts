import {Router} from "express"
import { fetchSavedYouTubeVideos, saveYouTubeVideo, fetchYouTubeVideo } from "../controllers/youtubeController"
import verifyToken from "../Middleware/authMiddleware"

const router = Router()

router.get("/youtube/video",verifyToken, fetchYouTubeVideo)
router.post("/save/youtube/video", verifyToken, saveYouTubeVideo)
router.get("/fetch/youtube/video", verifyToken, fetchSavedYouTubeVideos)


export default router;