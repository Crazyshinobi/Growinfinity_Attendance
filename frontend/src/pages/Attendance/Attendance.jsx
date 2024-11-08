import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Layout } from "../../components/Layout";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Button, Chip, CircularProgress } from "@mui/material"; // Import CircularProgress

export const Attendance = () => {
  const date = new Date();
  const [employee, setEmployee] = useState([]);
  const [attendanceMarked, setAttendanceMarked] = useState({});
  const [loading, setLoading] = useState(true); // Loading state for fetching employees
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const token = Cookies.get("token");

  const fetchEmployee = async () => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const apiUrl = process.env.BASE_URL + "/api/v1/employee";
      const response = await axios(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setEmployee(response.data.employee);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const submitIndividualAttendance = async (employeeId, status) => {
    const attendanceData = {
      employeeId: employeeId,
      date: date.toISOString().split("T")[0],
      status: status.toLowerCase().replace(" ", "_"),
    };

    try {
      const apiUrl = process.env.BASE_URL + "/api/v1/attendance"; // Adjust the endpoint if necessary
      const response = await axios.post(apiUrl, attendanceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success(`Attendance for ${employeeId} marked as ${status}!`);
        setAttendanceMarked((prev) => ({ ...prev, [employeeId]: status })); // Mark attendance for this employee
      } else {
        toast.error("Failed to submit attendance for this employee");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error occurred while submitting attendance");
    }
  };

  const fetchEmployeeAttendance = async () => {
    try {
      const apiUrl = process.env.BASE_URL + "/api/v1/attendance/today"; // Adjust the endpoint if necessary
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        const attendanceData = response.data.attendance;
        const attendanceMap = attendanceData.reduce((acc, curr) => {
          acc[curr.employeeId] = curr.status;
          return acc;
        }, {});
        setAttendanceMarked(attendanceMap);
      } else {
        toast.error("Failed to fetch today's attendance");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error occurred while fetching attendance");
    }
  };

  useEffect(() => {
    fetchEmployee();
    fetchEmployeeAttendance();
  }, []);

  // If loading, show the loader
  if (loading) {
    return (
      <Layout>
        <Toaster />
        <div className="bg-gray-50 flex justify-center items-center min-h-screen">
          <CircularProgress /> {/* Loader is displayed here */}
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Toaster />
      <Layout>
        <div className="bg-gray-50">
          <div className="bg-white rounded p-5 m-5 shadow-lg">
            <div className="min-h-screen">
              <h1 className="text-center text-lg lg:text-2xl pt-3 pb-10 ">
                <span className="font-bold">Mark Attendance For:</span>{" "}
                {`${date.getDate()}/${
                  date.getMonth() + 1
                }/${date.getFullYear()}, ${weekday[date.getDay()]}`}
              </h1>
              <div className="overflow-auto">
                <div className="grid sm:grid-cols-12 min-w-[900px]">
                  <div className="col-span-12">
                    <div className="grid grid-cols-12 item-center">
                      <div className="col-span-1 border flex items-center">
                        <p className="text-md lg:text-xl font-bold ps-8">
                          S. No.
                        </p>
                      </div>
                      <div className="col-span-3 border flex justify-center items-center">
                        <h3 className="font-bold  text-md lg:text-lg py-3">
                          Employee Name
                        </h3>
                      </div>
                      <div className="border col-span-8 flex justify-around items-center gap-10">
                        <h3 className="font-bold text-md lg:text-lg py-3">
                          Attendance Status
                        </h3>
                      </div>
                    </div>
                  </div>
                  {employee.map((item, index) => (
                    <div key={item._id} className="col-span-12">
                      <div className="grid grid-cols-12 item-center">
                        <div className="col-span-1 border flex items-center">
                          <p className="text-md lg:text-xl ps-8">{index + 1}</p>
                        </div>
                        <div className="col-span-3 border flex gap-10 justify-center items-center">
                          <h3 className="text-md lg:text-lg py-3">
                            {item.name}
                          </h3>
                        </div>
                        <div className="border col-span-8 flex justify-around items-center gap-4 lg:gap-10">
                          {attendanceMarked[item._id] ? (
                            <span className="text-green-500 font-bold">
                              Attendance marked as {attendanceMarked[item._id]}{" "}
                              for today!
                            </span>
                          ) : (
                            <>
                              <Chip
                                label="Present"
                                variant="outlined"
                                color="default"
                                onClick={() =>
                                  submitIndividualAttendance(
                                    item._id,
                                    "Present"
                                  )
                                }
                              />
                              <Chip
                                label="Absent"
                                variant="outlined"
                                color="default"
                                onClick={() =>
                                  submitIndividualAttendance(item._id, "Absent")
                                }
                              />
                              <Chip
                                label="Half Day"
                                variant="outlined"
                                color="default"
                                onClick={() =>
                                  submitIndividualAttendance(
                                    item._id,
                                    "Half Day"
                                  )
                                }
                              />
                              <Chip
                                label="Holiday"
                                variant="outlined"
                                color="default"
                                onClick={() =>
                                  submitIndividualAttendance(
                                    item._id,
                                    "Holiday"
                                  )
                                }
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
