const express = require("express");
const {
  createAttendance,
  checkTodayAttendance,
  getAllAttendance,
} = require("../controller/attendanceController");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router
  .route("/")
  .post(adminAuth, createAttendance)
  .get(adminAuth, getAllAttendance);
router.route("/today").get(checkTodayAttendance);

module.exports = router;
