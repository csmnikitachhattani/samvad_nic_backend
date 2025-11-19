import express from "express";
import { getNewspapers, getNpUserWithNewspaper, getBankDetailsByUser, getGSTDetailsByUser, updateNpUserWithNewspaper } from "../controllers/newspaper.js";
import { noticeBoard } from "../controllers/noticeBoard.js";



const router = express.Router();
// newspaper API
router.get("/newspaper", getNewspapers);
router.get("/npuser/:user_id", getNpUserWithNewspaper);
router.patch("/npuser/edit/:user_id", updateNpUserWithNewspaper);
router.get("/npuser/bank/:user_id", getBankDetailsByUser);
router.get("/npuser/gst/:user_id", getGSTDetailsByUser);


// notice board API
router.get("/notice-board", noticeBoard)



export default router;   // <-- IMPORTANT
