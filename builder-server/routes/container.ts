import express from "express";
import { CreateMongoContainer, DeletMongoContainer } from "../controllers/container";
const router = express.Router();

router.post('/make', CreateMongoContainer);
router.post('/remove/:id', DeletMongoContainer)
export default router;