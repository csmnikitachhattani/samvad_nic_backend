import express from "express";
import { getNewspapers, getNpUserWithNewspaper, getBankDetailsByUser } from "../controllers/newspaper.js";
import { noticeBoard } from "../controllers/noticeBoard.js";



const router = express.Router();

router.get("/newspaper", getNewspapers);
router.get("/npuser/:user_id", getNpUserWithNewspaper);
router.get("/npuser/bank/:user_id", getBankDetailsByUser)
router.get("/notice-board", noticeBoard)



export default router;   // <-- IMPORTANT
