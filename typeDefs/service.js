const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    services: [Service!]
    service(id: ID!): Service!
  }

  type Service {
    id: ID
    name: String!
    companies: [Company]!
    specialties: [Specialty]
  }
`;
