const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    companies: [Company!]!
    company(name: String!): Company!
  }

  extend type Mutation {
    createCompany(
      name: String!
      services: [ServiceInput]
      specialties: [SpecialtyInput]
    ): Company!
    updateCompany(
      name: String! # FILTER
      updated_name: String
      updated_services: [ServiceInput]
      updated_specialties: [SpecialtyInput]
    ): Company!
    deleteCompany(name: String!): Company!
  }

  type Company {
    id: ID
    name: String!
    studies: [Study!]
    services: [Service!]
    specialties: [Specialty!]
    bids: [Bid!]
  }

  input ServiceInput {
    name: String!
  }

  input SpecialtyInput {
    name: String!
  }
`;
