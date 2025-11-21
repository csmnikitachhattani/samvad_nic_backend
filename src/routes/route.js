import express from "express";
import { getNewspapers, getNpUserWithNewspaper, getBankDetailsByUser, getGSTDetailsByUser, updateNpUserWithNewspaper, npProfileHandler } from "../controllers/newspaper.js";
import { noticeBoard } from "../controllers/noticeBoard.js";
//import { npProfileHandler } from "../controllers/npProfileController.js";
import { npBankDetailHandler } from "../controllers/npBankController.js";
import {
  getGstDetails,
  checkGstExists,
  updateGstDetails,
} from "../controllers/npGSTController.js";



const router = express.Router();
// newspaper API
router.get("/newspaper", getNewspapers);
router.get("/npuser/:user_id", getNpUserWithNewspaper);
router.patch("/npuser/edit/:user_id", updateNpUserWithNewspaper);
router.post("/np-profile", npProfileHandler);
router.get("/npuser/bank/:user_id", getBankDetailsByUser);
router.get("/npuser/gst/:user_id", getGSTDetailsByUser);


// GET → /bank-detail/NP001


router.get("/gst/:user_id", getGstDetails);
router.get("/gst-exists/:user_id", checkGstExists);
router.post("/gst/update", updateGstDetails);

router.get("/bank-detail/:np_cd", (req, res) => {
    req.body = {
      np_cd: req.params.np_cd,
      action: "get",
    };
    npBankDetailHandler(req, res);
  });

// POST/EDIT → /bank-detail
router.post("/np/bank-detail", npBankDetailHandler);


// notice board API
router.get("/notice-board", noticeBoard)



export default router;   // <-- IMPORTANT
