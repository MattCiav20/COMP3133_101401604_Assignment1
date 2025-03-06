const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    created_at: String
    updated_at: String
  }

  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  type Query {
    login(username: String!, password: String!): String
    getAllEmployees: [Employee]
    searchEmployeeByEid(id: ID!): Employee
    searchEmployeeByDesignationOrDepartment(
      designation: String
      department: String
    ): [Employee]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    addEmployee(
      first_name: String!
      last_name: String!
      email: String!
      gender: String
      designation: String!
      salary: Float!
      date_of_joining: String!
      department: String!
      employee_photo: String
    ): Employee
    updateEmployeeByEid(
      id: ID!
      first_name: String
      last_name: String
      designation: String
      salary: Float
      department: String
    ): Employee
    deleteEmployeeByEid(id: ID!): String
  }
`;

module.exports = typeDefs;
