import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import Button from "@mui/material/Button";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import toast, { Toaster } from "react-hot-toast";
export const ViewEmployee = () => {
  const token = Cookies.get("token");
  const [employee, setEmployee] = useState([]);

  const apiUrl = process.env.BASE_URL + "/api/v1/employee";

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setEmployee(response.data.employee);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const deleteUrl = apiUrl + `/${id}`;

      const response = await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        console.log(response);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  // Fetch all data
  useEffect(() => {
    fetchData();
  }, [employee]);

  return (
    <>
      <Toaster />
      <Layout>
        <div className="bg-gray-50">
          <div className="grid sm:grid-cols-12 min-h-screen">
            {employee &&
              employee.map((item) => {
                return (
                  <div key={item._id} className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="bg-white rounded p-5 m-5 shadow-lg">
                      <div className="flex flex-col">
                        <div className="flex justify-center">
                          <img
                            src={`${process.env.BASE_URL}/uploads${item.image}`}
                            alt=""
                            className="rounded-[50%] h-[200px] w-[200px] object-top object-cover border-2 border-blue-700"
                          />
                        </div>
                        <ul className="flex flex-col gap-5 justify-start mt-8">
                          <li>
                            <strong>Employee Name: </strong> {item.name}
                          </li>
                          <li>
                            <strong>Date of Joining: </strong>{" "}
                            {((date) =>
                              `${String(date.getDate()).padStart(
                                2,
                                "0"
                              )}/${String(date.getMonth() + 1).padStart(
                                2,
                                "0"
                              )}/${date.getFullYear()}`)(
                              new Date(item.date_of_joining)
                            )}
                          </li>
                          <li>
                            <strong>Name of TL: </strong> {item.name_of_TL}
                          </li>
                        </ul>
                        <div className="mt-5">
                          <Link to={`/view-employee/${item._id}`}>
                            <Button variant="outlined" fullWidth>
                              View Full Details
                            </Button>
                          </Link>
                        </div>
                        <div className="mt-5 flex gap-3">
                          <div className="flex-1">
                            <Link to={`/edit-employee/${item._id}`}>
                              <Button
                                color="success"
                                startIcon={<EditIcon />}
                                variant="outlined"
                                fullWidth
                              >
                                {" "}
                                Edit
                              </Button>
                            </Link>
                          </div>
                          <div className="flex-1">
                            <Button
                              onClick={() => handleDelete(item._id)}
                              color="error"
                              startIcon={<DeleteIcon />}
                              variant="contained"
                              fullWidth
                            >
                              {" "}
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Layout>
    </>
  );
};
