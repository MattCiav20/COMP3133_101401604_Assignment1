const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");
require("dotenv").config();

const resolvers = {
  Query: {
    login: async (_, { username, email, password }) => {
      const user = await User.findOne({ $or: [{ email }, { username }] });
      if (!user) throw new Error("User not found!");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials!");

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return { user, token };
    },

    getAllEmployees: async () => await Employee.find(),

    searchEmployeeByID: async (_, { _id }) => {
      const employee = await Employee.findById(_id);
      if (!employee) throw new Error("Employee not found!");
      return employee;
    },

    searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
      if (!designation && !department) throw new Error("At least one filter is required!");
      return await Employee.find({ $or: [{ designation }, { department }] });
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      if (await User.findOne({ email })) throw new Error("Email already exists!");

      const user = new User({ username, email, password });
      await user.save();

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return { user, token };
    },

    addEmployee: async (_, args) => {
      if (await Employee.findOne({ email: args.email })) throw new Error("Email already exists!");

      const employee = new Employee(args);
      await employee.save();
      return employee;
    },

    updateEmployeeByID: async (_, { _id, ...updates }) => {
      const employee = await Employee.findByIdAndUpdate(_id, updates, { new: true });
      if (!employee) throw new Error("Employee not found!");
      return employee;
    },

    deleteEmployeeByID: async (_, { _id }) => {
      const employee = await Employee.findByIdAndDelete(_id);
      if (!employee) throw new Error("Employee not found!");
      return "Employee deleted successfully!";
    },
  },
};

module.exports = resolvers;
