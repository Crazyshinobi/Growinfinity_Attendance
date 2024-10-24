import React, { useState } from "react";
import { Layout } from "../../components/Layout";
import { toast, Toaster } from "react-hot-toast";
import DownloadIcon from "@mui/icons-material/Download";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const DownloadReport = () => {
  const token = Cookies.get("token");
  const apiUrl = `${process.env.BASE_URL}/api/v1/attendance`;
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        return response.data.report.map(
          ({ _id, __v, employeeId, date, ...rest }) => {
            const currentDate = new Date(date);

            // Format day, month, and year in words
            const day = currentDate.toLocaleDateString("en-US", {
              weekday: "long", // e.g., "Tuesday"
            });
            const month = currentDate.toLocaleDateString("en-US", {
              month: "long", // e.g., "October"
            });
            const year = currentDate.getFullYear(); // e.g., 2024

            // Format the date as DD/MM/YYYY
            const formattedDate = `${String(currentDate.getDate()).padStart(
              2,
              "0"
            )}/${String(currentDate.getMonth() + 1).padStart(
              2,
              "0"
            )}/${currentDate.getFullYear()}`;

            return {
              employeeName: employeeId.name,
              date: formattedDate, // Format date in DD/MM/YYYY
              day, // Add day in words (e.g., "Tuesday")
              month, // Add month in words (e.g., "October")
              year, // Add year (e.g., "2024")
              ...rest,
            };
          }
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Download not available");
      console.log(error);
      return null;
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    const reportData = await fetchData();
    setLoading(false);

    if (reportData) {
      // Format the date for the filename
      const formattedDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      // Create a worksheet from the report data
      const worksheet = XLSX.utils.json_to_sheet(reportData, {
        header: ["employeeName", "date", "day", "month", "year", "status"],
      });

      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

      // Style headers (make bold and capitalized)
      const headerCells = ["A1", "B1", "C1", "D1", "E1", "F1"];
      headerCells.forEach((cell) => {
        worksheet[cell].s = {
          font: {
            bold: true, // Make font bold
            sz: 12, // Font size
            color: { rgb: "000000" }, // Black color
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
          },
        };
      });

      // Capitalize the headers manually
      worksheet["A1"].v = worksheet["A1"].v.toUpperCase(); // EMPLOYEE NAME
      worksheet["B1"].v = worksheet["B1"].v.toUpperCase(); // DATE
      worksheet["C1"].v = worksheet["C1"].v.toUpperCase(); // DAY
      worksheet["D1"].v = worksheet["D1"].v.toUpperCase(); // MONTH
      worksheet["E1"].v = worksheet["E1"].v.toUpperCase(); // YEAR
      worksheet["F1"].v = worksheet["F1"].v.toUpperCase(); // STATUS

      // Convert the workbook to a binary Excel buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const dataBlob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      // Use the formatted date in the filename
      saveAs(dataBlob, `attendance_report_${formattedDate}.xlsx`);
    }
  };

  return (
    <>
      <Toaster />
      <Layout>
        <div className="bg-gray-50">
          <div className="bg-white rounded p-5 m-5 shadow-lg h-screen flex flex-col items-center justify-center">
            <h1 className="text-center uppercase text-2xl lg:text-4xl font-bold pt-8 pb-10">
              Download Report
            </h1>
            <div className="flex flex-col items-center gap-5 justify-center">
              <p className="text-sm text-center lg:text-lg">
                *After clicking on button download will start automatically,
                wait for few seconds*
              </p>
              <Button
                startIcon={
                  loading ? <CircularProgress size={20} /> : <DownloadIcon />
                }
                size="large"
                variant="contained"
                color="secondary"
                sx={{ textTransform: "none" }}
                onClick={handleDownload}
                disabled={loading}
              >
                {loading ? "Downloading..." : "Download Report"}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
