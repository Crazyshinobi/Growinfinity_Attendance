import React, { useState } from "react";
import Cookies from "js-cookie";
import { Layout } from "../../components/Layout";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";

export const UpdateAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false); // Loader state for the fetch operation
  const [updating, setUpdating] = useState(false); // Loader state for the update operation

  const token = Cookies.get("token");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const fetchAttendance = async () => {
    try {
      if (!selectedDate) {
        toast.error("Select a Date");
        return;
      }
      setLoading(true); // Show loader when fetching data
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const apiUrl = `${process.env.BASE_URL}/api/v1/attendance/date?date=${formattedDate}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setAttendance(response.data.attendance);
      } else {
        toast.error("Failed to fetch attendance data.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching attendance data.");
    } finally {
      setLoading(false); // Hide loader when fetching is complete
    }
  };

  const handleOpenModal = (attendanceItem) => {
    setCurrentAttendance(attendanceItem);
    setStatus(attendanceItem.status);
    setRemarks(attendanceItem.remarks || "");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setStatus("");
    setRemarks("");
  };

  const handleUpdateAttendance = async () => {
    try {
      if (!status) {
        toast.error("Status is required.");
        return;
      }

      setUpdating(true); // Show loader when updating attendance
      const updatedData = {
        status,
        remarks: remarks || "", // remarks is optional
      };

      const apiUrl = `${process.env.BASE_URL}/api/v1/attendance/update-attendance/${currentAttendance._id}`;

      const response = await axios.put(apiUrl, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Attendance updated successfully!");
        setOpenModal(false); // Close the modal after update
        fetchAttendance(); // Fetch updated attendance data
      } else {
        toast.error("Failed to update attendance.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating attendance.");
    } finally {
      setUpdating(false); // Hide loader when update is complete
    }
  };

  return (
    <>
      <Toaster />
      <Layout>
        <div className="bg-gray-50">
          <div className="bg-white rounded p-5 lg:m-5 shadow-lg">
            <div className="min-h-screen">
              <div className="mb-4">
                <label
                  htmlFor="attendance-date"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Select Attendance Date
                </label>
                <DatePicker
                  id="attendance-date"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  className="p-2 border border-gray-300 rounded"
                  placeholderText="Select a date"
                />
              </div>

              <Button
                onClick={fetchAttendance}
                color="primary"
                variant="contained"
                size="small"
                sx={{ textTransform: "none" }}
                disabled={loading} // Disable button while loading
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Fetch Attendance"
                )}
              </Button>
              {attendance.length > 0 ? (
                <div className="mt-5">
                  <h2 className="text-sm lg:text-xl font-bold mb-4">
                    Attendance for{" "}
                    {selectedDate
                      ? format(selectedDate, "MMMM dd, yyyy")
                      : "N/A"}
                  </h2>
                  <div className="overflow-auto">
                    <table className="w-full border-collapse min-w-[900px]">
                      <thead>
                        <tr>
                          <th className="border p-2">S.No.</th>
                          <th className="border p-2">Employee Name</th>
                          <th className="border p-2">Status</th>
                          <th className="border p-2">Remarks</th>
                          <th className="border p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map((item, index) => (
                          <tr key={index}>
                            <td className="border p-2 text-center">
                              {index + 1}
                            </td>
                            <td className="border p-2 text-center">
                              {item.employeeId.name}
                            </td>
                            <td className="border p-2 text-center">
                              {item.status}
                            </td>
                            <td className="border p-2 text-center">
                              {item.remarks}
                            </td>
                            <td className="border p-2 text-center">
                              <Button
                                variant="contained"
                                size="small"
                                color="secondary"
                                sx={{ textTransform: "none" }}
                                onClick={() => handleOpenModal(item)}
                              >
                                Update
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-[50vh]">
                  <p className="text-center text-xl">No Attendance Record Found!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal for updating attendance */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="update-attendance-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Update Attendance for {currentAttendance?.employeeId?.name}
            </Typography>

            {/* Display the selected date in the modal */}
            {selectedDate ? (
              <Typography variant="body1" gutterBottom>
                <strong>Date:</strong> {format(selectedDate, "MMMM dd, yyyy")}
              </Typography>
            ) : (
              <Typography variant="body1" color="error" gutterBottom>
                <strong>Date:</strong> N/A
              </Typography>
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="half_day">Half Day</MenuItem>
                <MenuItem value="holiday">Holiday</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Remarks (optional)"
              fullWidth
              multiline
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateAttendance}
              fullWidth
              disabled={updating} // Disable button while updating
            >
              {updating ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Attendance"
              )}
            </Button>
          </Box>
        </Modal>
      </Layout>
    </>
  );
};
