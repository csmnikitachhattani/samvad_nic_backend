import express from "express";
import { getNewspapers, getNpUserWithNewspaper, getBankDetailsByUser, getGSTDetailsByUser, updateNpUserWithNewspaper, npProfileHandler } from "../controllers/newspaper.js";
import { noticeBoard } from "../controllers/noticeBoard.js";
//import { npProfileHandler } from "../controllers/npProfileController.js";
import { getNpBankDetails, postOrEditNpBankDetails} from "../controllers/npBankController.js";
import {
  getGstDetails,
  checkGstExists,
  updateGstDetails,
} from "../controllers/npGSTController.js";
import {getNpBankSubDetails, } from "../controllers/npBankSubController.js"
import {getStates, getDistricts} from "../controllers/common.js"



const router = express.Router();

//common API
router.get("/states", getStates)
router.get("/district", getDistricts)

// newspaper API
router.get("/newspaper", getNewspapers);
router.get("/npuser/:user_id", getNpUserWithNewspaper);
router.patch("/npuser/edit/:user_id", updateNpUserWithNewspaper);
router.post("/np-profile", npProfileHandler);
router.get("/npuser/bank/:user_id", getBankDetailsByUser);
router.get("/npuser/gst/:user_id", getGSTDetailsByUser);
router.get("/gst/:user_id", getGstDetails);
router.get("/gst-exists/:user_id", checkGstExists);
router.post("/gst/update", updateGstDetails);
router.get("/bank-sub-detail/:np_cd", getNpBankSubDetails)
router.post("/np/bank-detail", getNpBankSubDetails)
router.get("/np/bank-detail/:np_cd", getNpBankDetails);
router.post("/np/bank-detail/edit", postOrEditNpBankDetails);


// notice board API
router.get("/notice-board", noticeBoard)



export default router;
