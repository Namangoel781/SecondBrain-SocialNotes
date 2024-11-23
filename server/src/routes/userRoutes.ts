import { Router } from "express";
import  {signup, login}  from "../controllers/userController";
import { authMiddleware } from "../Middleware/authMiddleware";

const router = Router()

router.post('/',authMiddleware(['username', 'email', 'password']) ,signup)
router.post('/signin', authMiddleware(['email', 'password']), login)

export default router