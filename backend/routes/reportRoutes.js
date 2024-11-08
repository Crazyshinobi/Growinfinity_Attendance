const express = require("express");
const { getmonthlyReport, getSingleMonthReport, getSingleDayReport } = require("../controller/reportController");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.route("/").get(adminAuth, getmonthlyReport);
router.route("/single-month").get(adminAuth, getSingleMonthReport);
router.route("/single-day-report").get(adminAuth, getSingleDayReport);

module.exports = router;
