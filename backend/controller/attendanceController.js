const mongoose = require("mongoose");
const Attendance = require("../model/Attendance");
const Employee = require("../model/Employee");

// Create Attendance
const createAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body; // Destructure the required fields from the request body

    // Create a new attendance record
    const newAttendance = new Attendance({
      employeeId,
      date,
      status,
    });

    // Save the attendance record to the database
    await newAttendance.save();

    res.status(200).json({ success: true, message: "Attendance recorded." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Check Today's Attendance
const checkTodayAttendance = async (req, res) => {
  const date = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Assuming you have a model for employees
  const employees = await Employee.find(); // Fetch all employees
  const attendanceRecords = await Attendance.find({ date });

  const attendanceStatus = employees.map((employee) => {
    const attendance = attendanceRecords.find(
      (record) => record.employeeId.toString() === employee._id.toString()
    );
    return {
      employeeId: employee._id,
      name: employee.name,
      status: attendance ? attendance.status : null,
    };
  });

  return res.status(200).json({
    success: true,
    attendance: attendanceStatus,
  });
};

const getAllAttendance = async (req, res) => {
  try {
    const report = await Attendance.find()
      .populate("employeeId", "name") // Populate employeeId with name field
      .exec();
    res.status(200).json({
      success: true,
      message: "Report fetched successfully",
      report,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
module.exports = { createAttendance, checkTodayAttendance, getAllAttendance };
