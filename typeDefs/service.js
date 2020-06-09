const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    services: [Service!]
    service(id: ID!): Service!
    searchService(search: String!): [Service]!
  }

  extend type Mutation {
    createService(name: String!): Service!
    updateService(id: ID!, updated_name: String!): Service!
    deleteService(id: ID!): Service!
  }

  type Service {
    id: ID
    name: String!
    companies: [Company]!
    specialties: [Specialty]
  }
`;
