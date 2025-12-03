import express from "express";
import { getNewspapers, getNpUserWithNewspaper, npProfileHandler } from "../controllers/newspaper.js";
import { noticeBoard } from "../controllers/noticeBoard.js";
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
// newspaper user Detail API
router.get("/newspaper", getNewspapers);
router.get("/npuser/:user_id", getNpUserWithNewspaper);
router.post("/np-profile", npProfileHandler);
// GST User Detail API
router.get("/gst/:user_id", getGstDetails);
router.get("/gst-exists/:user_id", checkGstExists);
router.post("/gst/update", updateGstDetails);
// Bank Sub  Detail API
router.get("/bank-sub-detail/:np_cd", getNpBankSubDetails)
router.post("/np/bank-detail", getNpBankSubDetails)
// Bank Detail API
router.get("/np/bank-detail/:np_cd", getNpBankDetails);
router.post("/np/bank-detail/edit", postOrEditNpBankDetails);
// notice board API
router.get("/notice-board", noticeBoard)



export default router;
