const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true,
  },
  name_of_TL: {
    type: String,
    required: true,
  },
  date_of_joining: {
    type: Date,
    required: true
  },
  designation: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true
  },
  emergency_mobile: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  aadhar_number: {
    type: Number,
    required: true
  },
  bank_details: {
    account_holder_name: {
      type: String,
      required: true
    },
    bank_name: {
      type: String,
      required: true
    },
    account_number: {
      type: Number,
      required: true
    },
    IFSC: {
      type: String,
      required: true
    }
  }
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
