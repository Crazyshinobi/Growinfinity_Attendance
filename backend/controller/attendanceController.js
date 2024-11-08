const mongoose = require("mongoose");
const Attendance = require("../model/Attendance");
const Employee = require("../model/Employee");

// Create Attendance
const createAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, remarks } = req.body;

    // Check if attendance already exists for the given employee and date
    const existingAttendance = await Attendance.findOne({
      employeeId: employeeId,
      date: date,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance for this date is already recorded.",
      });
    }

    // Create a new attendance record if no existing record is found
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

// Update Attendance
const updateAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, remarks } = req.body; // Extract the required fields from the request body

    // Find and update the attendance record
    const updatedAttendance = await Attendance.findOneAndUpdate(
      { employeeId: employeeId, date: date },
      { status: status },
      { remarks: remarks},
      { new: true } // Return the updated document
    );

    if (!updatedAttendance) {
      // If no matching record is found, send an error response
      return res.status(404).json({
        success: false,
        message: "Attendance record not found for the specified date.",
      });
    }

    // If the update is successful, send a success response
    res.status(200).json({
      success: true,
      message: "Attendance record updated successfully.",
      data: updatedAttendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
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

module.exports = { createAttendance, updateAttendance, checkTodayAttendance, getAllAttendance };
